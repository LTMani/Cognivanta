/**
 * ============================================================================
 * COGNIVANTA MASTER VERIFICATION SCRIPT
 * ============================================================================
 * Runs all platform security, audit, and quality gates:
 * 1. Reproducible Source LOC Audit (Mandatory 70,000+ LOC Threshold)
 * 2. Automated Zero-Credential Secret Scanner
 * 3. Core Unit Test Suite Assertions
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('=============================================================================');
console.log('          COGNIVANTA PLATFORM ACCEPTANCE & QUALITY GATES            ');
console.log('=============================================================================\n');

function runStep(name, cmd) {
  console.log(`[*] Running Gate: ${name}...`);
  try {
    const output = execSync(cmd, { cwd: path.join(__dirname, '..'), stdio: 'pipe' }).toString();
    console.log(output);
    console.log(`[+] Gate PASSED: ${name}\n`);
  } catch (err) {
    console.error(`[-] Gate FAILED: ${name}`);
    if (err.stdout) console.log(err.stdout.toString());
    if (err.stderr) console.error(err.stderr.toString());
    process.exit(1);
  }
}

// 1. Run LOC Audit
runStep('Source Code LOC Audit (70,000+ Threshold)', 'node scripts/count-loc.js');

// 2. Run Secret Scan
runStep('Automated Secret & Credential Scanner', 'node scripts/scan-secrets.js');

// 3. Run Core Unit Tests
runStep('Platform Core Unit Tests', 'node --test tests/unit/core.test.ts tests/unit/model-gateway.test.ts tests/unit/rag-engine.test.ts tests/unit/vector-store.test.ts tests/unit/agent-engine.test.ts');

console.log('=============================================================================');
console.log(' [ALL GATES PASSED] Cognivanta Enterprise Platform Verified Successfully.');
console.log('=============================================================================');
