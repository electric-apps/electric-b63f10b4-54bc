#!/bin/bash
# Forward AskUserQuestion hook events to Electric Agent studio.
# Blocks until the user answers in the web UI.
BODY="$(cat)"
RESPONSE=$(curl -s -X POST "http://host.docker.internal:4400/api/sessions/b63f10b4-002e-4d45-87b8-1de3caf162b7/hook-event" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer d3c96d4a179c0d2cbc5302fdce08253082d9fe30d0bbb188479aa7eba0696417" \
  -d "${BODY}" \
  --max-time 360 \
  --connect-timeout 5 \
  2>/dev/null)
if echo "${RESPONSE}" | grep -q '"hookSpecificOutput"'; then
  echo "${RESPONSE}"
fi
exit 0