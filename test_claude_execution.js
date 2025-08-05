// This script tests the Claude CLI execution from Node.js to simulate
// what happens when a user sends a message in Claudia

import { execSync } from 'child_process';

console.log("=== TESTING CLAUDE EXECUTION ===");

// Simulate the exact command that should be executed based on our path logic
const claudePath = "C:\\Users\\jwill\\AppData\\Roaming\\npm\\claude.cmd";
const cliScriptPath = "C:\\Users\\jwill\\AppData\\Roaming\\npm\\node_modules\\@anthropic-ai\\claude-code\\cli.js";

console.log(`1. Testing direct CMD file execution: "${claudePath}"`);
try {
    const cmdResult = execSync(`"${claudePath}" --version`, { encoding: 'utf8', timeout: 5000 }).trim();
    console.log(`   ✅ CMD file works: "${cmdResult}"`);
} catch (e) {
    console.log(`   ❌ CMD file failed: ${e.message}`);
}

console.log(`2. Testing direct Node.js execution: "node ${cliScriptPath}"`);
try {
    const nodeResult = execSync(`node "${cliScriptPath}" --version`, { encoding: 'utf8', timeout: 5000 }).trim();
    console.log(`   ✅ Node.js execution works: "${nodeResult}"`);
} catch (e) {
    console.log(`   ❌ Node.js execution failed: ${e.message}`);
}

console.log(`3. Testing with arguments (simulating actual usage):`);
try {
    const testResult = execSync(`node "${cliScriptPath}" --help`, { encoding: 'utf8', timeout: 5000 });
    console.log(`   ✅ Claude CLI responds to --help (first 200 chars):`);
    console.log(`   "${testResult.substring(0, 200)}..."`);
} catch (e) {
    console.log(`   ❌ Claude CLI --help failed: ${e.message}`);
}

console.log("=== TEST COMPLETE ===");