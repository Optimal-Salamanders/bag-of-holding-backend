#!/bin/bash

API="https://nameless-harbor-24935.herokuapp.com/"
URL_PATH="/uploads"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
--data '{
    "upload": {
      "title": "'"${TITLE}"'",
      "url": "'"${URL}"'",
      "tag": "'"${TAG}"'"
    }
  }'

echo
