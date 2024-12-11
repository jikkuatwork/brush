#!/bin/zsh

echo "Stopping Brush API server..."
pm2 stop brush-api
pm2 save

echo "To check status, run: pm2 status"