const fs = require('fs');
const path = require('path');

function replaceInDir(dirPath) {
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dirPath, file.name);
    if (file.isDirectory()) {
      replaceInDir(fullPath);
    } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix React.FC<undefined>
      content = content.replace(/React\.FC<undefined>/g, 'React.FC<any>');
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

const componentsDir = path.join(__dirname, '../apps/web/src');
replaceInDir(componentsDir);
console.log('[+] Fixed React.FC<undefined> across all frontend files.');
