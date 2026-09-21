#!/usr/bin/env bash
set -euo pipefail

# Vercel: exit 0 = skip build, exit 1 = run build.
# Skip when the only change is generated feed metadata (plan Faz 0).
changed="$(git diff --name-only HEAD^ HEAD 2>/dev/null || true)"
if [ -z "$changed" ]; then
  echo "No diff vs parent; building."
  exit 1
fi

only_feed=1
while IFS= read -r file; do
  [ -z "$file" ] && continue
  if [ "$file" != "public/blogs/feed.json" ]; then
    only_feed=0
    break
  fi
done <<< "$changed"

if [ "$only_feed" -eq 1 ]; then
  echo "Only public/blogs/feed.json changed; skipping build."
  exit 0
fi

echo "Deploy-relevant changes detected; building."
exit 1
