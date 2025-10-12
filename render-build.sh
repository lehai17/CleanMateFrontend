#!/usr/bin/env bash
set -o errexit

echo "🛠️ Installing dependencies..."
npm install --legacy-peer-deps

echo "⚙️ Building project..."
npm run build
