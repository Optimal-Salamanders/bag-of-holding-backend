#!/bin/sh

API="https://nameless-harbor-24935.herokuapp.com/"
URL_PATH="/examples"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo
