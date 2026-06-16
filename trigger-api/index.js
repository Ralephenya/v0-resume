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

app.listen(3000, () => console.log('cloudwithsteve-trigger listening on :3000'))
