#!/bin/sh

API="https://nameless-harbor-24935.herokuapp.com/"
URL_PATH="/uploads"

curl "${API}${URL_PATH}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo
