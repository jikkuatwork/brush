#!/bin/zsh

echo "Starting Brush API server..."
pm2 start backend.js --name "brush-api" --interpreter $(which bun)
pm2 save

echo "To check status, run: pm2 status"
