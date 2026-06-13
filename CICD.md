# CI/CD — How this site ships (and how the live preview demo works)

This repo runs **two independent pipelines**, both authenticating to AWS via **GitHub OIDC** (no stored AWS keys):

1. **Main-site deploy** — `git push main` → build → S3 → CloudFront.
2. **Visitor preview** — a visitor submits an image on the live site → a real GitHub Actions build deploys a personalized copy of the site to its own bucket, then self-destructs after 2 days.

> Doubles as show-notes for the YouTube walkthrough. Section headers map to suggested video chapters.

---

## 0. The shared foundation — OIDC auth (no secrets)

GitHub proves its identity to AWS with a short-lived token instead of long-lived keys. An IAM role (`resume-github-actions`) trusts GitHub's OIDC provider **only for this repo**:

```json
{
  "Effect": "Allow",
  "Principal": { "Federated": "arn:aws:iam::<acct>:oidc-provider/token.actions.githubusercontent.com" },
  "Action": "sts:AssumeRoleWithWebIdentity",
  "Condition": {
    "StringEquals": { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" },
    "StringLike":  { "token.actions.githubusercontent.com:sub": "repo:Ralephenya/v0-resume:*" }
  }
}
```

The `sub` condition is the security boundary — a fork or any other repo **cannot** assume the role. Workflows pick it up with:

```yaml
permissions:
  id-token: write
  contents: read
steps:
  - uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: arn:aws:iam::<acct>:role/resume-github-actions
      aws-region: af-south-1
```

---

## 1. Main-site deploy — `.github/workflows/deploy.yml`

**Trigger:** push to `main`.

```
git push main ──► checkout ──► npm ci ──► next build (static export → ./out)
            ──► s3 sync (2-pass cache) ──► cloudfront invalidation ──► live
```

The **two-pass cache** matters:
- Hashed assets (`page-7f0a1b0e.js`) → `max-age=31536000, immutable` (cache forever).
- `*.html` → `max-age=0, must-revalidate` (never cache, so new deploys show instantly).

Then `cloudfront create-invalidation --paths "/*"` flushes the edge.

> `cloudwithsteve.online` is a registrar 301-forward to the CloudFront domain, which drops sub-paths — that's why deep links use the CloudFront URL.

---

## 2. Visitor preview — the interactive demo

Four parts + a status file that bridges the async build back to the browser.

```
 Browser form ──POST imageUrl──► Lambda (resume-preview)
      ▲                              │ validate image · rate-limit (max 40) · write status
      │                              └─repository_dispatch─► GitHub Actions (preview.yml)
      │                                                          │ build w/ hero image + PREVIEW_MODE
      │ polls preview/<id>/status.json                           │ create resume-preview-<id> bucket
      └──────────────◄── writes status at each phase ◄───────────┘ deploy → http://...s3-website...
                                                          (cleanup Lambda deletes bucket after 2 days)
```

### Why GitHub Actions (not CodeBuild)?
The original demo used CodeBuild, but this AWS account is capped at **0 concurrent builds** (`Cannot have more than 0 builds in queue` — needs an AWS support case to lift). GitHub Actions is free (2,000 min/mo), unblocked, and a genuinely real build. *(Great "build in public" beat for the video.)*

### 2a. The form — `app/components/SubmissionForm.tsx`
POSTs the image, then **polls a status file** every 4s to drive the on-screen stages — so the progress shown is the real build, not a fake animation.

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

### 2b. The trigger Lambda — `lambda/preview/index.mjs`
Public Function URL. Validate → rate-limit → write initial status → fire the build.

```js
// validate it's a real image (<=12MB), cap live previews, then:
await fetch(`https://api.github.com/repos/${REPO}/dispatches`, {
  method: "POST",
  headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github+json" },
  body: JSON.stringify({ event_type: "preview", client_payload: { image_url, preview_id } })
})
```

The `GITHUB_TOKEN` lives **only** in the Lambda env — never in the browser. That's the whole reason the proxy Lambda exists.

> **CORS gotcha (fixed):** the Function URL CORS config *and* the Lambda code both set `Access-Control-Allow-Origin`, producing duplicate headers the browser rejects. Fix: let the Function URL own CORS; don't set it in code.

### 2c. The build — `.github/workflows/preview.yml`
Listens for `repository_dispatch (type: preview)`, builds with the visitor's hero image **in reduced preview mode**, provisions a new bucket, deploys, and writes status at each phase.

```yaml
on: { repository_dispatch: { types: [preview] } }
concurrency: { group: visitor-preview }   # serialize = predictable cost
...
- env:
    NEXT_PUBLIC_BACKGROUND_IMAGE: ${{ steps.vars.outputs.image_url }}
    NEXT_PUBLIC_PREVIEW_MODE: "1"
  run: npm ci --legacy-peer-deps && npm run build
- run: |
    aws s3api create-bucket --bucket "resume-preview-$ID" --region af-south-1 ...
    aws s3 website "s3://resume-preview-$ID" --index-document index.html ...
    aws s3 sync ./out "s3://resume-preview-$ID" --delete
```

**The status file is the clever glue:** GitHub Actions can't call back to the browser, so the workflow writes `preview/<id>/status.json` to the main bucket; the page polls it over CloudFront (HTTPS, same origin).

**Preview mode** (`NEXT_PUBLIC_PREVIEW_MODE=1`, read in `app/page.tsx`) hides the risky bits from a stranger's clone:
- the CI/CD form (so a preview can't recursively spawn builds),
- the contact/email form (→ a "visit real site" button),
- the AI chat.

### 2d. Auto-cleanup — `lambda/cleanup/index.mjs`
A lifecycle rule expires *objects* but never deletes a *bucket*, so a daily EventBridge-triggered Lambda empties + deletes any `resume-preview-*` bucket older than 2 days.

---

## 3. Guardrails (cost + safety)

| Guard | Where | Effect |
|---|---|---|
| Image validation (type + ≤12 MB) | Lambda | reject junk early |
| Max 40 live previews | Lambda (`429`) | cap bucket count + cost |
| Serialized builds | `preview.yml` concurrency | no parallel pile-up |
| Preview mode hides CI/CD form | `page.tsx` | no recursive builds |
| 2-day auto-delete | cleanup Lambda | bounded storage |
| Scoped IAM (`resume-preview-*`) | role policies | contained blast radius |
| OIDC `sub` = this repo only | trust policy | only this repo can deploy |

Build minutes: GitHub free tier. AWS cost: a few cents of S3.

---

## 4. Infra reference

| Thing | Value |
|---|---|
| Prod bucket | `0171-1798-8452-my-bucket` (af-south-1) |
| CloudFront | `E2VV89C2YG4XWJ` → `d1brbmrnsse8eq.cloudfront.net` |
| OIDC role | `resume-github-actions` |
| Trigger Lambda | `resume-preview` (Function URL) |
| Cleanup Lambda | `resume-preview-cleanup` + EventBridge `resume-preview-cleanup-daily` |
| Workflows | `deploy.yml` (main site), `preview.yml` (visitor previews) |

## 🔒 Don't show on camera
- The `GITHUB_TOKEN` and the Lambda env page.
- (Optional) blur the AWS account ID in ARNs.
- The Function URL is public by design — fine to show, it's rate-limited.
