#!/usr/bin/env bash
#
# Regenera public/guacamole-common.min.js a partir do guacamole-common-js OFICIAL (npm),
# aplicando 2 patches para bugs UPSTREAM conhecidos da build 1.5.0 (a última no npm).
#
# Proveniência: `npm i guacamole-common-js@<versão>` → dist/cjs/guacamole-common.min.js
# (a única build "pronta"; a esm usa `export`, que também não roda num <script> puro).
#
# Bug 1 — module.exports: a build cjs termina com `module.exports=Guacamole;`, que lança
#   `ReferenceError: module is not defined` num <script> global. Patch: guard de typeof.
# Bug 2 — SessionRecording com Blob (replay .guac): no fonte (guacamole-common.js ~l.12872)
#   `if (source instanceof Blob) parseBlob(recordingBlob, ...)` passa `recordingBlob`
#   (undefined) em vez de `source` e não guarda a fonte → `undefined.size` no play.
#   Patch: `(t=e,g(t,w,S))` = `recordingBlob=source; parseBlob(source,...)`.
#
# O host não tem Node → o npm install roda num container node:18-alpine descartável.
# Uso: ./scripts/build-guacamole-bundle.sh [versao]   (default 1.5.0)
set -euo pipefail

VERSION="${1:-1.5.0}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/guacamole-common.min.js"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "→ Baixando guacamole-common-js@$VERSION (build cjs oficial) via container…"
docker run --rm -v "$TMP:/out" node:18-alpine sh -c "
  cd /tmp && npm init -y >/dev/null 2>&1
  npm i guacamole-common-js@$VERSION --no-audit --no-fund >/dev/null 2>&1
  cp node_modules/guacamole-common-js/dist/cjs/guacamole-common.min.js /out/raw.min.js
"

echo "→ Aplicando patches…"
cp "$TMP/raw.min.js" "$OUT"
# Bug 1: guard do module.exports (funciona em <script> e mantém CommonJS)
sed -i 's|module.exports=Guacamole|"undefined"!=typeof module\&\&(module.exports=Guacamole)|' "$OUT"
# Bug 2: SessionRecording Blob — guarda a fonte e a parseia
sed -i 's|if(e instanceof Blob)g(t,w,S);else|if(e instanceof Blob)(t=e,g(t,w,S));else|' "$OUT"

echo "→ Verificando…"
grep -q 'typeof module' "$OUT" || { echo "ERRO: patch 1 (module.exports) não aplicado"; exit 1; }
grep -q '(t=e,g(t,w,S))' "$OUT" || { echo "ERRO: patch 2 (SessionRecording) não aplicado"; exit 1; }
echo "✓ OK — $OUT regenerado (guacamole-common-js@$VERSION + 2 patches)."
