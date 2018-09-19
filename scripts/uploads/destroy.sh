#!/bin/bash

API="http://localhost:4741"
URL_PATH="/uploads"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --header "Authorization: Bearer ${TOKEN}" \
  --request DELETE \

echo
