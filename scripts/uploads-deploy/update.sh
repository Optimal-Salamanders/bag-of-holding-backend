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


https://git.heroku.com/thawing-inlet-61413.git
https://git.heroku.com/nameless-harbor-24935.git
