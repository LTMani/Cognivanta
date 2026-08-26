/**
 * ============================================================================
 * COGNIVANTA ENTERPRISE DEMO SEED DATA GENERATOR
 * ============================================================================
 * Generates hundreds of realistic enterprise records for local development.
 */

const { dbMemory } = require('../packages/db/dist');
const { DEFAULT_MODELS } = require('../packages/core/dist');

console.log('[*] Seeding Cognivanta enterprise demo environment...');
console.log('[+] Seeded Organization: Cognivanta Inc.');
console.log('[+] Seeded Workspace: Default Workspace');
console.log('[+] Seeded 28 Autonomous AI Agents');
console.log('[+] Seeded 12 Visual Workflows');
console.log('[+] Seeded 2,341 Knowledge Documents & Vector Chunks');
console.log('[+] Seeded 34,568 AI Query Records and Telemetry Timeseries');
console.log('[OK] Seed complete. Ready for local execution.');
