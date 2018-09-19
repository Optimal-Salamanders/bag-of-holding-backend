#!/bin/bash

API="http://localhost:4741"
URL_PATH="/uploads"

curl "${API}${URL_PATH}" \
  --include \
  --form image=@/Users/tim/wdi/trainings/amazon-s3-training/images/padawan.png \
  --form title="${TITLE}" \
  --form url="${URL}" \

echo
