#!/bin/bash

API="https://nameless-harbor-24935.herokuapp.com"
URL_PATH="/uploads"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --header "Authorization: Bearer ${TOKEN}" \
  --request DELETE \

echo
