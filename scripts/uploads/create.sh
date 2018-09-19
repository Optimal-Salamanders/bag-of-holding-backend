#!/bin/bash

API="http://localhost:4741"
URL_PATH="/uploads"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --data '{
    "upload": {
      "title": "'"${TITLE}"'",
      "url":"'"${URL}"'"
    }
  }'

echo
