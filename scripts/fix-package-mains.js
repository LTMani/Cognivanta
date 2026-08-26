const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, '../packages');
const packages = fs.readdirSync(packagesDir);

for (const pkg of packages) {
  const pkgJsonPath = path.join(packagesDir, pkg, 'package.json');
  if (fs.existsSync(pkgJsonPath)) {
    const json = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
    json.main = 'src/index.ts';
    json.types = 'src/index.ts';
    fs.writeFileSync(pkgJsonPath, JSON.stringify(json, null, 2) + '\n', 'utf8');
  }
}
console.log('[+] Fixed package.json main pointers for seamless local development.');
