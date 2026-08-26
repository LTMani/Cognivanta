#!/usr/bin/env node

/**
 * ============================================================================
 * COGNIVANTA DEVELOPER COMMAND LINE INTERFACE (CLI)
 * ============================================================================
 */

import { CognivantaClient } from '@cognivanta/sdk';

const client = new CognivantaClient();

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log('-------------------------------------------------------------');
  console.log('       COGNIVANTA ENTERPRISE AI PLATFORM CLI v1.0.0          ');
  console.log('-------------------------------------------------------------\n');

  if (!command || command === 'help' || command === '--help') {
    console.log('Usage: cognivanta <command> [options]\n');
    console.log('Commands:');
    console.log('  status               Check cluster health and API telemetry');
    console.log('  chat <message>       Send a streaming prompt to AI engine');
    console.log('  agents:list          List all active autonomous agents');
    console.log('  agents:run <id> <p>  Execute an agent with task prompt');
    console.log('  eval:run <dsId>      Run automated golden dataset benchmark');
    console.log('  loc                  Run reproducible source LOC audit');
    console.log('  help                 Show this reference manual\n');
    return;
  }

  switch (command) {
    case 'status': {
      console.log('[+] Checking Cognivanta cluster status...');
      const analytics = await client.getAnalyticsOverview();
      console.log(`[OK] System Health: ${analytics.systemHealthPercentage}%`);
      console.log(`[OK] Active Users: ${analytics.activeUsersCount.toLocaleString()}`);
      console.log(`[OK] Total Queries: ${analytics.totalQueries.toLocaleString()}`);
      console.log(`[OK] Storage Used: ${(analytics.storageUsedBytes / (1024 * 1024 * 1024)).toFixed(1)} GB\n`);
      break;
    }

    case 'chat': {
      const message = args.slice(1).join(' ') || 'Summarize Q1 report highlights';
      console.log(`[+] User: ${message}`);
      const res = await client.sendMessage({ message });
      console.log(`\n[+] Assistant (${res.assistantMessage.modelUsed}):\n${res.assistantMessage.content}\n`);
      break;
    }

    case 'agents:list': {
      console.log('[+] Fetching active agents...');
      const agents = await client.listAgents();
      agents.forEach(a => console.log(`  - [${a.status.toUpperCase()}] ${a.name} (${a.roleType})`));
      console.log('');
      break;
    }

    case 'eval:run': {
      const dsId = args[1] || 'ds-finance-q1';
      console.log(`[+] Running evaluation benchmark on dataset: ${dsId}...`);
      const evalRes = await client.runEvaluation(dsId);
      console.log(`[OK] Faithfulness: ${(evalRes.scores.faithfulness * 100).toFixed(1)}%`);
      console.log(`[OK] ROUGE-L: ${(evalRes.scores.rougeL * 100).toFixed(1)}%`);
      console.log(`[OK] Passed: ${evalRes.passedSamples}/${evalRes.totalSamples} samples\n`);
      break;
    }

    default:
      console.log(`Unknown command "${command}". Run "cognivanta help" for available commands.`);
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error(`[ERROR] ${err.message}`);
    process.exit(1);
  });
}
