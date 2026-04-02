#!/usr/bin/env bash
# 로컬 + 같은 Wi-Fi(LAN)에서 정적 사이트 제공
set -e
cd "$(dirname "$0")"
PORT="${PORT:-8080}"

LAN_IP=""
if command -v ipconfig >/dev/null 2>&1; then
  LAN_IP=$(ipconfig getifaddr en0 2>/dev/null || true)
fi
if [[ -z "$LAN_IP" ]] && command -v ip >/dev/null 2>&1; then
  LAN_IP=$(ip route get 1.1.1.1 2>/dev/null | awk '{for(i=1;i<=NF;i++) if ($i=="src") {print $(i+1); exit}}' || true)
fi

echo ""
echo "  모헤어 정적 서버 (포트 ${PORT})"
echo "  ─────────────────────────────"
echo "  이 기기에서:     http://127.0.0.1:${PORT}/"
echo "  같은 Wi-Fi에서:  http://${LAN_IP:-<이-기기-LAN-IP>}:${PORT}/"
echo ""
echo "  (휴대폰 등에서 안 열리면 macOS 방화벽에서 Python 허용 또는 포트 ${PORT} 허용)"
echo ""

exec python3 -m http.server "$PORT" --bind 0.0.0.0
