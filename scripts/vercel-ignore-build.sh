#!/usr/bin/env bash
set -euo pipefail

# Vercel: exit 0 = skip build, exit 1 = run build (Faz 0 — gereksiz deployment storage).
changed="$(git diff --name-only HEAD^ HEAD 2>/dev/null || true)"
if [ -z "$changed" ]; then
  echo "No diff vs parent; building."
  exit 1
fi

skip_only=1
while IFS= read -r file; do
  [ -z "$file" ] && continue
  case "$file" in
    public/blogs/feed.json) continue ;;
    docs/ops-baseline.md) continue ;;
    docs/ops-baseline.snapshot.json) continue ;;
    docs/ops-phase0-runbook.md) continue ;;
    content/gundem-queue/*) continue ;;
    content/blog-queue/README.md) continue ;;
    *) skip_only=0; break ;;
  esac
done <<< "$changed"

if [ "$skip_only" -eq 1 ]; then
  echo "Only ops/feed/gundem-queue metadata changed; skipping build."
  exit 0
fi

echo "Deploy-relevant changes detected; building."
exit 1
