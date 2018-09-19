#!/bin/bash

API="http://localhost:4741"
URL_PATH="/uploads"

curl "${API}${URL_PATH}" \
  --include \
  --header "Authorization: Bearer ${TOKEN}" \
  --form image=@/Users/m1ch4/wdi/projects/bag-of-holding-backend/images/padawan.png \
  --form title="${TITLE}" \
  --form url="${URL}" \
  --form tag="${TAG}" \

echo
