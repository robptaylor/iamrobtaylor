#!/bin/sh

npm run build
rm -rf ../backend/dist/public
cp -r dist ../backend/dist/public
