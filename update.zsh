#!/bin/zsh
cd /home/jikku/brush
git pull
bun install
bun run build
pm2 restart brush-api
pm2 save
sudo chown -R jikku:jikku dist
sudo chmod -R 755 dist
sudo nginx -t && sudo systemctl reload nginx