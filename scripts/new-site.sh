#!/bin/bash
# usage: scripts/new-site.sh <slug>   (run from anywhere)
# Copies the kit to /workspace/<slug>, without node_modules, build output, or sample assets.
set -e
S=$1; [ -z "$S" ] && { echo "usage: new-site.sh slug"; exit 1; }
KIT=$(cd "$(dirname "$0")/.." && pwd); DEST=/workspace/$S
[ -e "$DEST" ] && { echo "$DEST already exists"; exit 1; }
cp -r "$KIT" "$DEST"
rm -rf "$DEST/node_modules" "$DEST/.next" "$DEST/public/images/_opt" "$DEST/public/sample" "$DEST/fill-config.md" "$DEST/scripts/new-site.sh"
mkdir -p "$DEST/public/images"
echo "{}" > "$DEST/lib/image-manifest.json"
sed -i "s/\"name\": \"claudaura-starter\"/\"name\": \"$S\"/" "$DEST/package.json"
# Pick a free vercel.app name: <slug>.vercel.app may already belong to a stranger.
DOM=""
for c in "$S" "$S-ca" "$S-demo" "$S-gta"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://$c.vercel.app")
  [ "$code" = "404" ] && { DOM="$c.vercel.app"; break; }
done
[ -z "$DOM" ] && DOM="$S.vercel.app"
echo "$DOM" > "$DEST/.site-domain"
echo "Site domain: https://$DOM (set siteUrl in site.config.ts to this)"
echo "Created $DEST. Now rewrite site.config.ts and put images in public/images."
