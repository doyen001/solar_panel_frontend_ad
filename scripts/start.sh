#!/bin/bash
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd /home/ubuntu/easylink-solar/ad

# Build if not already built
npm run build
# Restart app safely — package.json's "start" script pins the port to 3002
# (3000 is easylink-solar, 3001 is easylink-solar-server on this same instance).
pm2 delete easylink-solar-ad || true
pm2 start npm --name "easylink-solar-ad" -- start
pm2 save
