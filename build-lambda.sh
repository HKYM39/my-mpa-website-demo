#!/bin/bash

echo "🚀 Cleaning last install dependencies"
rm -rf ./layer/nodejs/*

echo "🚀 Install dependencies"
cp ./apps/backend/package.json ./layer
yarn install --production --forzen-lockfile

echo "🚀 Running sum build"
sam build --ship-pull-image

if [$? -eq 0]; then
  if["$ENV" = 'production'] || ["$ENV" = "test"]; then
    echo "🚀 Delpoying to production ...."
    sam deploy -g
  else
    echo "Staring local API ...."
    sam local start-api --warm-containers EAGER
  fi
else
  echo "❌ Sam build failed!"
  exit 1
fi