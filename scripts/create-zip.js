const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('[*] Archiving Cognivanta Enterprise Platform into zip file...');

const rootDir = path.resolve(__dirname, '..');
const parentDir = path.resolve(rootDir, '..');
const destinationZip = path.join(parentDir, 'Cognivanta-Enterprise-Platform.zip');

if (fs.existsSync(destinationZip)) {
  fs.unlinkSync(destinationZip);
}

// Use git archive if available, or powershell Compress-Archive
try {
  // Using git archive ensures clean source tree without node_modules
  execSync(`git archive --format=zip -o "${destinationZip}" HEAD`, { cwd: rootDir, stdio: 'inherit' });
  const stats = fs.statSync(destinationZip);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`[+] SUCCESS! Created clean enterprise zip archive:`);
  console.log(`    Location: ${destinationZip}`);
  console.log(`    Size: ${sizeMB} MB`);
} catch (err) {
  console.log('Falling back to PowerShell Compress-Archive...');
  const psScript = `
    $files = Get-ChildItem -Path "${rootDir}" -Exclude 'node_modules','.git','dist','.vite'
    Compress-Archive -Path $files.FullName -DestinationPath "${destinationZip}" -CompressionLevel Optimal
  `;
  execSync(`powershell -NoProfile -Command "${psScript.replace(/\n/g, ' ')}"`, { stdio: 'inherit' });
  const stats = fs.statSync(destinationZip);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`[+] SUCCESS! Created zip archive at: ${destinationZip} (${sizeMB} MB)`);
}
