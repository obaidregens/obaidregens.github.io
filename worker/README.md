# ycweek submit Worker

Accepts an event URL from the ycweek page, classifies it with Bedrock (Opus 4.6),
and — if it's confidently a Startup School week SF event — commits it to the data
JSON and the regenerated page in one commit. Medium-confidence submissions go to a
review queue; junk is rejected.

```
form → Worker
  ├─ classify (Bedrock Opus 4.6, bearer token, plain fetch)
  ├─ dedupe against data JSON
  └─ confidence ≥ 0.75  → add + rebuild page  (one commit)
     confidence ≥ 0.40  → data/pending-submissions.json (review)
     else               → reject
```

Handles any URL: Luma/Partiful (structured), or LinkedIn/Instagram/X posts where
the details live in the caption and entry is comment-gated (the model extracts the
date, venue, audience restrictions, and the how-to-get-in note from the prose).

## Deploy

From `worker/`:

```bash
# 1. secrets
wrangler secret put AWS_BEARER_TOKEN_BEDROCK   # paste ~/.claude/bedrock-api-key
wrangler secret put GITHUB_TOKEN               # fine-grained PAT, Contents: read+write on the repo

# 2. deploy
wrangler deploy

# 3. take the printed workers.dev URL, put it in wrangler.jsonc → vars.SUBMIT_ENDPOINT,
#    and rebuild the page so the form points at the Worker:
SUBMIT_ENDPOINT="https://ycweek-submit.<subdomain>.workers.dev" bun ../scripts/build-ycweek.ts
#    then redeploy the Worker so its own rebuilds bake the same endpoint:
wrangler deploy
```

The GitHub token needs **Contents: read and write** on `obaidregens/obaidregens.github.io`
only — nothing else.

## Local test (no deploy)

```bash
export AWS_BEARER_TOKEN_BEDROCK="$(< ~/.claude/bedrock-api-key)"
bun ../scripts/classify-event.ts https://luma.com/<slug>   # classify only, adds nothing
```

## Review queue

Medium-confidence items land in `data/pending-submissions.json`. After `git pull`:

```bash
bun scripts/review-pending.ts                 # list
bun scripts/review-pending.ts approve <id>    # move into data JSON
bun scripts/review-pending.ts reject  <id>
bun scripts/build-ycweek.ts                   # rebuild, then commit
```

## Cost / tuning

Opus 4.6 per submission is ~2-4k tokens in, <1k out. To cut cost, set
`vars.BEDROCK_MODEL` to `us.anthropic.claude-sonnet-4-6` or
`us.anthropic.claude-haiku-4-5-20251001-v1:0`. Thresholds live at the top of `submit.ts`.
