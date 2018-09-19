#!/bin/bash

API="http://localhost:4741"
URL_PATH="/uploads"

curl "${API}${URL_PATH}" \
  --include \
  --header "Authorization: Bearer ${TOKEN}" \
  --form image=@/Users/tim/wdi/projects/bag-of-holding-backend/images/padawan.png \
  --form title="${TITLE}" \
  --form url="${URL}" \

echo
