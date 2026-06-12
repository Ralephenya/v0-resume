// Resume preview deployer.
// Public Lambda Function URL. A visitor POSTs { imageUrl, email } and we publish
// a standalone racing-themed hero page (with their image) to the main site bucket
// at preview/<id>/index.html, then return the live URL. Objects under preview/
// auto-expire in 2 days via an S3 lifecycle rule (no cleanup code needed here).

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const s3 = new S3Client({ region: "af-south-1" })
const BUCKET = "0171-1798-8452-my-bucket"
const SITE = "https://cloudwithsteve.online"
// cloudwithsteve.online forwards all paths to the homepage, so deep preview
// links must use the CloudFront domain directly (it serves sub-paths correctly).
const PREVIEW_BASE = "https://d1brbmrnsse8eq.cloudfront.net"
const MAX_BYTES = 12 * 1024 * 1024 // 12 MB cap

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

const json = (status, body) => ({
  statusCode: status,
  headers: { "Content-Type": "application/json", ...CORS },
  body: JSON.stringify(body),
})

// Escape a string for safe embedding inside an HTML attribute / CSS url().
const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

export const handler = async (event) => {
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 204, headers: CORS, body: "" }
  }

  let payload
  try {
    const raw = event.isBase64Encoded
      ? Buffer.from(event.body || "", "base64").toString("utf8")
      : event.body || "{}"
    payload = JSON.parse(raw)
  } catch {
    return json(400, { error: "Invalid request body." })
  }

  const imageUrl = (payload.imageUrl || "").trim()
  const email = (payload.email || "").trim()

  // --- Validate the image URL ---
  let parsed
  try {
    parsed = new URL(imageUrl)
  } catch {
    return json(400, { error: "Please provide a valid image URL." })
  }
  if (!/^https?:$/.test(parsed.protocol)) {
    return json(400, { error: "Image URL must start with http:// or https://" })
  }

  // Confirm it's really an image and within size limits.
  try {
    const head = await fetch(imageUrl, { method: "GET", headers: { Range: "bytes=0-0" } })
    const type = head.headers.get("content-type") || ""
    const len = Number(head.headers.get("content-length") || "0")
    if (!type.startsWith("image/")) {
      return json(422, { error: "That URL doesn't point to an image." })
    }
    if (len && len > MAX_BYTES) {
      return json(422, { error: "Image is too large (max 12 MB)." })
    }
  } catch {
    return json(422, { error: "Couldn't reach that image URL." })
  }

  // --- Generate the preview page ---
  const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
  const safeImg = esc(imageUrl)
  const html = buildPage(safeImg, id)

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: `preview/${id}/index.html`,
        Body: html,
        ContentType: "text/html; charset=utf-8",
        CacheControl: "public,max-age=0,must-revalidate",
      }),
    )
  } catch (err) {
    console.error("S3 put failed", err)
    return json(500, { error: "Deployment failed while publishing to S3." })
  }

  // (email is captured for follow-up; logged for now)
  if (email) console.log("preview requested by", email, "->", id)

  return json(200, {
    id,
    url: `${PREVIEW_BASE}/preview/${id}/`,
    expiresInDays: 2,
  })
}

function buildPage(safeImg, id) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="robots" content="noindex"/>
<title>Live Preview · Deployed by Steve's Pipeline</title>
<link rel="icon" href="/favicon.svg"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',system-ui,sans-serif;background:#000;color:#fff;overflow-x:hidden}
  .hero{position:relative;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:2rem}
  .bg{position:absolute;inset:0;background-image:linear-gradient(rgba(0,0,0,.72),rgba(0,0,0,.55)),url('${safeImg}');background-size:cover;background-position:center}
  .bg::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,0,0,.85),rgba(229,9,20,.25))}
  .content{position:relative;z-index:2;max-width:60rem}
  .badge{display:inline-flex;align-items:center;gap:.5rem;border:1px solid rgba(229,9,20,.5);background:rgba(229,9,20,.12);color:#ff5a63;padding:.5rem 1rem;border-radius:999px;font-size:.8rem;letter-spacing:.15em;text-transform:uppercase;font-weight:700;margin-bottom:1.5rem}
  .dot{width:.6rem;height:.6rem;border-radius:50%;background:#22c55e;box-shadow:0 0 12px #22c55e;animation:pulse 1.4s infinite}
  @keyframes pulse{50%{opacity:.4}}
  h1{font-size:clamp(2.5rem,8vw,5.5rem);font-weight:900;line-height:1;letter-spacing:-.03em;margin-bottom:1rem;text-shadow:0 4px 30px rgba(0,0,0,.8)}
  .red{color:#e50914;text-shadow:0 0 30px rgba(229,9,20,.6)}
  p.lead{font-size:clamp(1rem,2.5vw,1.4rem);color:#d1d5db;margin-bottom:2rem}
  .meta{font-family:ui-monospace,monospace;font-size:.8rem;color:#9ca3af;margin-top:2.5rem;border-top:1px solid #1f2937;padding-top:1.5rem}
  a.cta{display:inline-block;margin-top:1.5rem;background:#e50914;color:#fff;text-decoration:none;padding:.9rem 2rem;border-radius:.6rem;font-weight:700;transition:transform .2s}
  a.cta:hover{transform:scale(1.05)}
  .frame{display:inline-block;margin-top:2rem;border:1px solid #1f2937;border-radius:1rem;overflow:hidden;max-width:90%;box-shadow:0 20px 60px rgba(0,0,0,.6)}
  .frame img{display:block;max-width:100%;max-height:40vh;object-fit:cover}
</style>
</head>
<body>
  <section class="hero">
    <div class="bg"></div>
    <div class="content">
      <span class="badge"><span class="dot"></span> Deployed live by Steve's CI/CD pipeline</span>
      <h1>Your image is <span class="red">live</span> 🏁</h1>
      <p class="lead">This page was generated and published to AWS S3 + CloudFront in seconds — the same stack that runs cloudwithsteve.online.</p>
      <div class="frame"><img src="${safeImg}" alt="Your submitted image"/></div>
      <div>
        <a class="cta" href="${SITE}">← Back to Steve's portfolio</a>
      </div>
      <div class="meta">
        Preview ID: ${id} &nbsp;·&nbsp; Region: af-south-1 &nbsp;·&nbsp; Auto-expires in 2 days
      </div>
    </div>
  </section>
</body>
</html>`
}
