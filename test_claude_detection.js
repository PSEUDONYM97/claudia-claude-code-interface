// Quick test to see what claude path would be detected
import { execSync } from 'child_process';
import fs from 'fs';

console.log('Testing claude path detection...');

// Test where command (Windows native)
try {
    const whereResult = execSync('where claude', { encoding: 'utf8' });
    console.log('where claude result:');
    console.log(whereResult);
} catch (e) {
    console.log('where command failed:', e.message);
}

// Test which command (Unix-style)
try {
    const whichResult = execSync('which claude', { encoding: 'utf8' });
    console.log('which claude result:');
    console.log(whichResult);
} catch (e) {
    console.log('which command failed:', e.message);
}

// Test direct node execution
const cliPath = 'C:/Users/jwill/AppData/Roaming/npm/node_modules/@anthropic-ai/claude-code/cli.js';
console.log('CLI script exists:', fs.existsSync(cliPath));

// Test direct execution
try {
    const directResult = execSync(`node "${cliPath}" --version`, { encoding: 'utf8' });
    console.log('Direct node execution result:');
    console.log(directResult);
} catch (e) {
    console.log('Direct execution failed:', e.message);
}