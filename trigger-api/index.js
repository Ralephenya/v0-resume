const express = require('express')
const Database = require('better-sqlite3')
const { mkdirSync } = require('fs')
const { randomBytes } = require('crypto')

const app = express()
app.use(express.json())

// CORS — allow the main site and any preview to call this API
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-status-secret')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

// Persistent SQLite on a Fly.io volume
mkdirSync('/data', { recursive: true })
const db = new Database('/data/status.db')
db.exec(`
  CREATE TABLE IF NOT EXISTS previews (
    id TEXT PRIMARY KEY,
    status TEXT NOT NULL DEFAULT '{}',
    created_at INTEGER NOT NULL
  )
`)

const STATUS_SECRET = process.env.STATUS_SECRET || ''
const GITHUB_TOKEN  = process.env.GITHUB_TOKEN  || ''
const GITHUB_REPO   = process.env.GITHUB_REPO   || 'Ralephenya/v0-resume'
const MAX_LIVE_PREVIEWS = 40
const MAX_BYTES = 12 * 1024 * 1024 // 12 MB

const requireSecret = (req, res, next) => {
  if (!STATUS_SECRET || req.headers['x-status-secret'] !== STATUS_SECRET)
    return res.status(403).json({ error: 'Forbidden.' })
  next()
}

// GET /health
app.get('/health', (_, res) => res.json({ ok: true }))

// POST / — validate image, rate-limit, dispatch build
app.post('/', async (req, res) => {
  if (!GITHUB_TOKEN)
    return res.status(500).json({ error: 'Preview service not configured (missing GitHub token).' })

  const imageUrl = (req.body?.imageUrl || '').trim()

  let parsed
  try { parsed = new URL(imageUrl) }
  catch { return res.status(400).json({ error: 'Please provide a valid image URL.' }) }
  if (!/^https?:$/.test(parsed.protocol))
    return res.status(400).json({ error: 'Image URL must start with http:// or https://' })

  // Validate the image is real and not too large
  try {
    const head = await fetch(imageUrl, { method: 'GET', headers: { Range: 'bytes=0-0' } })
    const type = head.headers.get('content-type') || ''
    const len  = Number(head.headers.get('content-length') || '0')
    if (!type.startsWith('image/'))
      return res.status(422).json({ error: "That URL doesn't point to an image." })
    if (len && len > MAX_BYTES)
      return res.status(422).json({ error: 'Image is too large (max 12 MB).' })
  } catch {
    return res.status(422).json({ error: "Couldn't reach that image URL." })
  }

  // Rate / cost guard — cap live previews in last 2 days
  const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000
  const { c } = db.prepare('SELECT COUNT(*) AS c FROM previews WHERE created_at > ?').get(twoDaysAgo)
  if (c >= MAX_LIVE_PREVIEWS)
    return res.status(429).json({ error: 'Too many previews are live right now. Please try again later.' })

  const id = `${Date.now().toString(36)}${randomBytes(2).toString('hex')}`
  const initialStatus = { step: 1, status: 'queued', message: 'Queued — starting build' }
  db.prepare('INSERT INTO previews (id, status, created_at) VALUES (?, ?, ?)').run(id, JSON.stringify(initialStatus), Date.now())

  // Fire the GitHub Actions build
  try {
    const r = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/dispatches`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
        'User-Agent': 'cloudwithsteve-trigger',
      },
      body: JSON.stringify({
        event_type: 'preview-fly',
        client_payload: { image_url: imageUrl, preview_id: id },
      }),
    })
    if (r.status !== 204) {
      const text = await r.text()
      console.error('dispatch failed', r.status, text)
      db.prepare('DELETE FROM previews WHERE id = ?').run(id)
      return res.status(502).json({ error: "Couldn't trigger the build pipeline." })
    }
  } catch (err) {
    console.error('dispatch error', err)
    db.prepare('DELETE FROM previews WHERE id = ?').run(id)
    return res.status(502).json({ error: "Couldn't reach the build pipeline." })
  }

  res.json({
    id,
    statusUrl: `https://cloudwithsteve-trigger.fly.dev/status/${id}`,
    previewUrl: `https://cloudwithsteve-preview-${id}.fly.dev`,
    expiresInDays: 2,
  })
})

// GET /status/:id — polled by the frontend
app.get('/status/:id', (req, res) => {
  const row = db.prepare('SELECT status FROM previews WHERE id = ?').get(req.params.id)
  if (!row) return res.status(404).json({ error: 'Preview not found.' })
  res.setHeader('Cache-Control', 'no-cache')
  res.json(JSON.parse(row.status))
})

// POST /status/:id — called by GitHub Actions to update status
app.post('/status/:id', requireSecret, (req, res) => {
  const row = db.prepare('SELECT id FROM previews WHERE id = ?').get(req.params.id)
  if (!row) return res.status(404).json({ error: 'Preview not found.' })
  db.prepare('UPDATE previews SET status = ? WHERE id = ?').run(JSON.stringify(req.body), req.params.id)
  res.json({ ok: true })
})

// GET /previews — list all, used by cleanup workflow
app.get('/previews', requireSecret, (req, res) => {
  const rows = db.prepare('SELECT id, status, created_at FROM previews ORDER BY created_at DESC').all()
  res.json(rows.map(r => ({ id: r.id, created_at: r.created_at, status: JSON.parse(r.status) })))
})

// DELETE /previews/:id — called by cleanup after destroying the Fly app
app.delete('/previews/:id', requireSecret, (req, res) => {
  db.prepare('DELETE FROM previews WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

// ─── Pit Crew AI Chat ───────────────────────────────────────────────────────
// Proxies to the private Ollama app. On timeout/error returns { reply: null }
// so the frontend falls back to its built-in localAnswer() function.

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://cloudwithsteve-ollama.flycast'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:0.5b'
const CHAT_TIMEOUT_MS = 20000

const SYSTEM_PROMPT = `You are Pit Crew AI, the assistant on Steve Ralephenya's developer portfolio website. Answer questions about Steve concisely (2-3 sentences max). If asked something unrelated to Steve, politely redirect.

PROFILE: Steve Junior Ralephenya. Full Stack .NET Developer | AI Integration | AWS Certified. Location: Johannesburg, South Africa. Email: bikoralephenya@gmail.com. Available for Full Stack .NET / AI Integration roles. 4+ years experience.

CURRENT ROLE (Feb 2026–Present): Full Stack Developer at Mphoti Consulting. Migrating legacy ASPX conveyancing platform to Blazor WebAssembly. Stack: Blazor WASM, .NET Aspire, Ocelot, ASP.NET, SQL Server, Claude/MCP. Driving the team's AI adoption roadmap.

PREVIOUS ROLES:
- Software Engineer, Bsure Insurance Advisors (Feb 2025–Jan 2026): Twilio WhatsApp integration, Angular portal, Discovery REST integration. Stack: C#, Web API, Angular, Twilio.
- Junior→Intermediate Full Stack Developer, Warp Development (Apr 2023–Jan 2025): OrderEazi order/inventory platform, ERP integrations (Sage, Xero), courier integrations (ShipLogic). Stack: C#, ASP.NET MVC, Angular.
- Junior Developer, Livex Software (Feb 2022–Mar 2023): Inventory, student admin, billing systems. Stack: ASP.NET Core, MVC, SQL.

TOP SKILLS: C#/ASP.NET Core, Blazor WASM, Angular, TypeScript, REST APIs, SQL Server, Claude API, MCP, AWS, Docker, Entity Framework.

CERTIFICATIONS: AWS Certified Developer – Associate (DVA-C02, Mar 2026), 6x Anthropic certifications (Claude 101, Claude Code 101, Claude Code in Action, Intro to Agent Skills, Intro to Subagents, Intro to Claude Cowork), IBM Master the Mainframe Level 3.

PROJECTS: Blazor WebAssembly Migration (conveyancing), Claude/MCP Integrations (custom MCP servers), Twilio WhatsApp Team Inbox, ERP & Courier Integrations, Meta WhatsApp Template Engine.`

app.post('/chat', async (req, res) => {
  const message = (req.body?.message || '').trim()
  if (!message) return res.status(400).json({ error: 'message is required' })

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS)

  try {
    const r = await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message },
        ],
      }),
    })
    clearTimeout(timer)

    if (!r.ok) {
      console.warn('Ollama returned', r.status)
      return res.json({ reply: null })
    }

    const data = await r.json()
    const reply = data?.message?.content || null
    res.json({ reply })
  } catch (err) {
    clearTimeout(timer)
    console.warn('Ollama unavailable, using fallback:', err.message)
    res.json({ reply: null })
  }
})

app.listen(3000, () => console.log('cloudwithsteve-trigger listening on :3000'))
