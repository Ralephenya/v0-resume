// Resume preview trigger.
// Public Lambda Function URL. A visitor POSTs { imageUrl } and we:
//  1. validate the image, 2. enforce a simple rate cap, 3. write an initial
//  status file, 4. fire a GitHub repository_dispatch that runs the real build
//  workflow (preview.yml), which deploys to its own bucket and updates the
//  status file as it goes. The website polls the status file directly.

import { S3Client, PutObjectCommand, ListBucketsCommand } from "@aws-sdk/client-s3"

const s3 = new S3Client({ region: "af-south-1" })
const STATUS_BUCKET = "0171-1798-8452-my-bucket"
const CF_BASE = "https://d1brbmrnsse8eq.cloudfront.net"
const REGION = "af-south-1"
const MAX_BYTES = 12 * 1024 * 1024 // 12 MB
const MAX_LIVE_PREVIEWS = 40 // cost / bucket-limit guard

const GITHUB_REPO = process.env.GITHUB_REPO || "Ralephenya/v0-resume"
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ""

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

export const handler = async (event) => {
  if (event.requestContext?.http?.method === "OPTIONS")
    return { statusCode: 204, headers: CORS, body: "" }

  if (!GITHUB_TOKEN)
    return json(500, { error: "Preview service not configured (missing GitHub token)." })

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

  // --- Validate the image URL ---
  let parsed
  try {
    parsed = new URL(imageUrl)
  } catch {
    return json(400, { error: "Please provide a valid image URL." })
  }
  if (!/^https?:$/.test(parsed.protocol))
    return json(400, { error: "Image URL must start with http:// or https://" })

  try {
    const head = await fetch(imageUrl, { method: "GET", headers: { Range: "bytes=0-0" } })
    const type = head.headers.get("content-type") || ""
    const len = Number(head.headers.get("content-length") || "0")
    if (!type.startsWith("image/"))
      return json(422, { error: "That URL doesn't point to an image." })
    if (len && len > MAX_BYTES)
      return json(422, { error: "Image is too large (max 12 MB)." })
  } catch {
    return json(422, { error: "Couldn't reach that image URL." })
  }

  // --- Rate / cost guard: cap how many live previews can exist at once ---
  try {
    const { Buckets = [] } = await s3.send(new ListBucketsCommand({}))
    const live = Buckets.filter((b) => b.Name?.startsWith("resume-preview-")).length
    if (live >= MAX_LIVE_PREVIEWS)
      return json(429, {
        error: "Too many previews are live right now. Please try again in a bit.",
      })
  } catch {
    /* non-fatal — continue */
  }

  const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

  // --- Initial status so the website can start polling immediately ---
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: STATUS_BUCKET,
        Key: `preview/${id}/status.json`,
        Body: JSON.stringify({ step: 1, status: "queued", message: "Queued — starting build" }),
        ContentType: "application/json",
        CacheControl: "no-cache",
      }),
    )
  } catch (err) {
    console.error("status write failed", err)
    return json(500, { error: "Couldn't start the preview." })
  }

  // --- Fire the GitHub Actions build ---
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/dispatches`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
        "User-Agent": "resume-preview-lambda",
      },
      body: JSON.stringify({
        event_type: "preview",
        client_payload: { image_url: imageUrl, preview_id: id },
      }),
    })
    if (res.status !== 204) {
      const text = await res.text()
      console.error("dispatch failed", res.status, text)
      return json(502, { error: "Couldn't trigger the build pipeline." })
    }
  } catch (err) {
    console.error("dispatch error", err)
    return json(502, { error: "Couldn't reach the build pipeline." })
  }

  return json(200, {
    id,
    statusUrl: `${CF_BASE}/preview/${id}/status.json`,
    previewUrl: `http://resume-preview-${id}.s3-website.${REGION}.amazonaws.com`,
    expiresInDays: 2,
  })
}
