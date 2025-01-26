#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

# Navigate to project directory
cd /home/plumber/htdocs/lokale-loodgieters.nl

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Build the application
echo "🏗️ Building the application..."
npm run build

# Restart the application with PM2
echo "🔄 Restarting the application..."
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js

# Verify Nginx configuration
echo "🔍 Verifying Nginx configuration..."
sudo nginx -t

# Reload Nginx
echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

echo "✅ Deployment completed successfully!"

