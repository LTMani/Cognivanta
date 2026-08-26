#!/usr/bin/env node

/**
 * ============================================================================
 * COGNIVANTA AUTOMATED SECRET SCANNER & CREDENTIAL GATE
 * ============================================================================
 * Scans the repository for leaked API keys, tokens, private keys, and real passwords.
 */

const fs = require('fs');
const path = require('path');

const SECRET_PATTERNS = [
  { name: 'OpenAI Secret Key', regex: /sk-[a-zA-Z0-9]{32,}/g },
  { name: 'Anthropic API Key', regex: /sk-ant-[a-zA-Z0-9]{32,}/g },
  { name: 'Google Gemini API Key', regex: /AIzaSy[a-zA-Z0-9_-]{33}/g },
  { name: 'AWS Access Key ID', regex: /AKIA[0-9A-Z]{16}/g },
  { name: 'AWS Secret Access Key', regex: /(?:aws_secret_access_key|AWS_SECRET_ACCESS_KEY)\s*=\s*[a-zA-Z0-9/+=]{40}/g },
  { name: 'Generic Private Key', regex: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g },
  { name: 'GitHub Personal Token', regex: /gh[pousr]_[A-Za-z0-9_]{36,}/g },
  { name: 'Slack Bot/User Token', regex: /xox[baprs]-[0-9]{10,}-[a-zA-Z0-9]{24,}/g },
  { name: 'Hardcoded JWT Token', regex: /eyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}/g }
];

const EXCLUDED_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  '.git',
  '.next',
  'coverage',
  '.turbo',
  '.cache'
]);

const ALLOWED_MOCK_STRINGS = new Set([
  'mock-openai-key-dev-placeholder',
  'mock-anthropic-key-dev-placeholder',
  'mock-gemini-key-dev-placeholder',
  'mock-cohere-key-dev-placeholder',
  'mock-s3-access-key',
  'mock-s3-secret-key',
  'demo-dev-jwt-secret-do-not-use-in-production-min-32-chars-long',
  'demo-dev-encryption-key-32-bytes-placeholder!',
  'demo-dev-cookie-secret-placeholder'
]);

function scanFile(filePath, findings) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    for (let lineNum = 1; lineNum <= lines.length; lineNum++) {
      const line = lines[lineNum - 1];

      // Check if line contains any pattern
      for (const pattern of SECRET_PATTERNS) {
        let match;
        const regex = new RegExp(pattern.regex);
        while ((match = regex.exec(line)) !== null) {
          const matchedStr = match[0];
          if (!ALLOWED_MOCK_STRINGS.has(matchedStr)) {
            findings.push({
              file: filePath,
              line: lineNum,
              type: pattern.name,
              snippet: line.trim()
            });
          }
        }
      }
    }
  } catch (err) {
    // Ignore binary or unreadable files
  }
}

function scanDir(dir, findings) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name)) {
        scanDir(fullPath, findings);
      }
    } else if (entry.isFile()) {
      if (entry.name === '.env' || entry.name.endsWith('.key') || entry.name.endsWith('.pem')) {
        findings.push({
          file: fullPath,
          line: 1,
          type: 'Forbidden secret file detected in repository',
          snippet: entry.name
        });
      } else {
        scanFile(fullPath, findings);
      }
    }
  }
}

function runScanner() {
  console.log('=============================================================================');
  console.log('                 COGNIVANTA AUTOMATED SECRET SCANNER                         ');
  console.log('=============================================================================\n');

  const findings = [];
  scanDir(process.cwd(), findings);

  if (findings.length === 0) {
    console.log(' [OK] ZERO HARDCODED SECRETS OR CREDENTIALS DETECTED.');
    console.log(' [OK] Repository passes all enterprise credential security gates.\n');
    console.log('=============================================================================\n');
    return true;
  } else {
    console.error(' [SECURITY VIOLATION] Detected potential credentials in source code:');
    for (const f of findings) {
      console.error(`  - ${f.file}:${f.line} [${f.type}] -> ${f.snippet}`);
    }
    console.error('\nPlease remove all credentials before proceeding.');
    console.log('=============================================================================\n');
    return false;
  }
}

if (require.main === module) {
  const passed = runScanner();
  process.exit(passed ? 0 : 1);
}

module.exports = { runScanner };
