#!/bin/bash
# scripts/deploy.sh for stubless-site. Cloudflare Workers.
#
# Copied from deferless-site's deploy.sh, the sibling built to the same spec. This repo was
# built by the oss-sync site rollout on 2026-09-22 with no deploy.sh and no verify-cf.mjs /
# layout-gate.mjs, so it never entered deploy_repo_list and never got a Worker on the account:
# the live host answered 307 off the *.thecompound.tech wildcard, which reads exactly like a
# site nobody deployed, because nothing had.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

WORKER="https://stubless-site.kyisaiah47.workers.dev"
HOST="stubless.thecompound.tech"

. "$HOME/CompoundLabs/compound-ops/tools/deploy-lock.sh" || { echo "deploy gate missing, refusing to deploy" >&2; exit 1; }
deploy_gate "stubless-site"

echo "==> the register gate, before anything is built"
npm run check

echo "==> build"
npx opennextjs-cloudflare build

echo "==> deploy"
npx opennextjs-cloudflare deploy

echo "==> populate the incremental cache the deployed build reads"
npx opennextjs-cloudflare populateCache remote

echo "==> verify the worker"
node scripts/verify-cf.mjs "$WORKER"

echo "==> the layout gate, against the worker"
node scripts/layout-gate.mjs "$WORKER"

echo "==> the studio credit gate, against the worker"
node "$HOME/CompoundLabs/compound-ops/tools/gates/studio-credit-gate.mjs" "$WORKER"

if [ -n "$HOST" ]; then
  SERVED=$(curl -s -o /dev/null -w '%{header_json}' -m 15 "https://$HOST/" 2>/dev/null | tr 'A-Z' 'a-z' | grep -c cloudflare || true)
  if [ "$SERVED" != "0" ]; then
    echo "==> verify $HOST"
    node scripts/verify-cf.mjs "https://$HOST"
    echo "==> the layout gate, against $HOST"
    node scripts/layout-gate.mjs "https://$HOST"
  else
    echo "==> $HOST is not on the Worker yet, skipping its verify"
  fi
fi

echo "stubless-site: deployed and verified"
