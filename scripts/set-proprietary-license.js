const fs = require('fs');
const path = require('path');

function updateLicense(dirPath) {
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dirPath, file.name);
    if (file.isDirectory() && file.name !== 'node_modules' && file.name !== '.git') {
      updateLicense(fullPath);
    } else if (file.name === 'package.json') {
      const json = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      json.license = 'UNLICENSED';
      fs.writeFileSync(fullPath, JSON.stringify(json, null, 2) + '\n', 'utf8');
      console.log(`[+] Updated license to UNLICENSED in: ${fullPath}`);
    }
  }
}

const rootDir = path.resolve(__dirname, '..');
updateLicense(rootDir);

// Check if LICENSE file exists and ensure it is proprietary
const licensePath = path.join(rootDir, 'LICENSE');
if (fs.existsSync(licensePath)) {
  fs.writeFileSync(licensePath, 'Copyright (c) 2026 Cognivanta Inc. All rights reserved. PROPRIETARY AND CONFIDENTIAL.\n', 'utf8');
  console.log('[+] Set proprietary LICENSE notice.');
}
