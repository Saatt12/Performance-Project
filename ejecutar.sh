#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

perfil=${1:-humo}
case "$perfil" in
  humo|carga|pico|estres) ;;
  *) printf 'Uso: %s [humo|carga|pico|estres]\n' "$0" >&2; exit 2 ;;
esac

testId=${TESTID:-"$perfil-$(date -u +%Y%m%dT%H%M%SZ)-$$"}
if [[ ! "$testId" =~ ^[A-Za-z0-9_-]+$ ]]; then
  printf 'TESTID solo admite letras, números, guiones y guiones bajos.\n' >&2
  exit 2
fi

mkdir -p resultados
if [[ -e "resultados/$testId.json" || -e "resultados/$testId.ndjson" ]]; then
  printf 'TESTID ya existe: %s\n' "$testId" >&2
  exit 2
fi

export K6_PROMETHEUS_RW_SERVER_URL=${K6_PROMETHEUS_RW_SERVER_URL:-http://127.0.0.1:9090/api/v1/write}
export K6_PROMETHEUS_RW_PUSH_INTERVAL=1s
export K6_PROMETHEUS_RW_STALE_MARKERS=true
printf 'Ejecución %s\n' "$testId"
exec k6 run --quiet --no-color --features native-histograms \
  -e "TESTID=$testId" -e "PERFIL=$perfil" \
  --out experimental-prometheus-rw --out "json=resultados/$testId.ndjson" \
  --summary-export "resultados/$testId.json" ecomm.js
