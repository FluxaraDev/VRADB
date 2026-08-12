#!/bin/bash

echo "=== Deploying to GitHub Pages ==="

git add -A
git commit -m "deploy"
git push

echo "=== Remote deploy triggered. Building local preview... ==="

npm run build
npm run preview
