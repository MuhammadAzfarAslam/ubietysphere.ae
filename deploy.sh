#!/bin/bash
set -e

echo "=> Stopping PM2 to free resources..."
pm2 stop ubietysphere.ae

echo "=> Installing dependencies..."
pnpm install

echo "=> Building Next.js app..."
pnpm build

echo "=> Copying public/ to standalone..."
cp -r public .next/standalone/public

echo "=> Copying .next/static/ to standalone..."
cp -r .next/static .next/standalone/.next/static

echo "=> Restarting PM2..."
pm2 restart ubietysphere.ae

echo "=> Done! App is live."
