# CI/CD — How this site ships

This repo runs **two independent pipelines**.

**Current (active)** — everything on Fly.io:
1. **Main-site deploy** — `git push main` → build → Fly.io (`cloudwithsteve.fly.dev`).
2. **Visitor preview** — visitor submits an image → GitHub Actions builds a personalized copy and deploys it as its own Fly.io app, then auto-destructs after 2 days.

**Legacy (archived, files kept)** — original AWS setup:
- S3 + CloudFront main site deploy (`deploy.yml` — **disabled**)
- Lambda-triggered preview to S3 buckets (`preview.yml` — **disabled**)
- AWS files: `lambda/`, `buildspec.yml`, old workflows remain in repo for reference.

---

## Current: Fly.io Pipeline (active)

### 1. Main-site deploy — `.github/workflows/deploy-fly.yml`

**Trigger:** push to `main`.

```
git push main ──► checkout ──► npm ci ──► next build (static export → ./out)
            ──► flyctl deploy ──► live at cloudwithsteve.fly.dev
```

**How it works:**
1. GitHub Actions checks out the repo, installs deps, builds a static export (`./out`)
2. `flyctl deploy --remote-only` builds the Docker image and deploys to `cloudwithsteve`
3. The `Dockerfile` copies `./out` to an nginx container and exposes port 80
4. Custom domain `cloudwithsteve.online` has DNS A/AAAA records pointing to Fly.io

**Key config:**
- `fly.toml`: `cloudwithsteve`, `jnb` region, `shared-cpu-1x`, 256MB, auto-stop
- `Dockerfile`: multi-stage build (Node → static export → nginx serve)

---

### 2. Visitor preview — the interactive demo (Fly.io)

```
 Browser form ──POST imageUrl──► Trigger API (cloudwithsteve-trigger.fly.dev)
      ▲                              │ validate image · rate-limit (max 40) · write status
      │                              └─repository_dispatch─► GitHub Actions (preview-fly.yml)
      │                                                          │ build w/ hero image + PREVIEW_MODE
      │ polls /status/<id>                                       │ fly apps create cloudwithsteve-preview-<id>
      └──────────────◄── updates status at each phase ◄───────────┘ fly deploy → https://cloudwithsteve-preview-<id>.fly.dev
                                                          (GA cron destroys app after 2 days)
```

**2a. The form** — `app/components/SubmissionForm.tsx`
POSTs the image, then polls the trigger API's status endpoint every 4s.

```ts
const { statusUrl, previewUrl } = await (await fetch(ENDPOINT, {
  method: "POST", body: JSON.stringify({ imageUrl })
})).json()

while (Date.now() < deadline) {
  await delay(4000)
  const st = await (await fetch(`${statusUrl}?t=${Date.now()}`, { cache: "no-store" })).json()
  if (st.step > 0) onStepChange(st.step)
  if (st.status === "live")   return onSuccess(st.url)
  if (st.status === "failed") throw new Error(st.message)
}
```

**2b. The trigger API** — `trigger-api/index.js` (Express app on Fly.io)
- Public endpoint on `cloudwithsteve-trigger.fly.dev`
- Validates the image URL, enforces a 40-preview rate cap
- Stores status in SQLite (persistent via Fly.io Volume)
- Fires `repository_dispatch (type: preview-fly)` via GitHub API
- Status endpoints: `GET /status/:id` (public), `POST /status/:id` (needs `x-status-secret`), `GET /previews` and `DELETE /previews/:id` (for cleanup)

**2c. The build** — `.github/workflows/preview-fly.yml`
Triggered by `repository_dispatch (type: preview-fly)`:
1. Updates status → "building"
2. Builds static site with visitor's hero image + `NEXT_PUBLIC_PREVIEW_MODE=1`
3. Creates a new Fly.io app: `cloudwithsteve-preview-<id>`
4. Generates a `Dockerfile` + `fly.toml` in a temp dir and deploys
5. Updates status → "live" with the preview URL

**Preview mode** (`NEXT_PUBLIC_PREVIEW_MODE=1`, read in `app/page.tsx`) hides the risky bits from a stranger's clone:
- the CI/CD form (prevents recursive builds),
- the contact/email form (shows "visit real site" button),
- the AI chat.

**2d. Auto-cleanup** — `.github/workflows/preview-cleanup-fly.yml`
Daily cron (3am UTC). Queries the trigger API for previews older than 2 days, destroys the Fly.io apps, and removes status records from SQLite.

---

### 3. Fly.io Guardrails

| Guard | Where | Effect |
|---|---|---|
| Image validation (type + ≤12 MB) | Trigger API | reject junk early |
| Max 40 live previews | Trigger API (`429`) | cap app count + cost |
| Serialized builds | `preview-fly.yml` concurrency | no parallel pile-up |
| Preview mode hides CI/CD form | `page.tsx` | no recursive builds |
| 2-day auto-delete | cleanup workflow | bounded apps |
| Auto-stop machines | `fly.toml` min_machines_running = 0 | $0 when idle |

---

## Legacy: AWS Pipeline (archived, files kept)

Originally deployed to S3 + CloudFront. Files remain in repo for reference:
- `lambda/preview/index.mjs` — trigger Lambda (Function URL)
- `lambda/cleanup/index.mjs` — daily cleanup Lambda
- `buildspec.yml` — CodeBuild spec (used before GitHub Actions)
- `.github/workflows/deploy.yml` — S3 + CloudFront deploy (disabled)
- `.github/workflows/preview.yml` — S3 bucket preview deploy (disabled)

See git history for the full AWS setup. If needed, re-enable the workflows in GitHub Actions settings and update DNS to point back to CloudFront.
