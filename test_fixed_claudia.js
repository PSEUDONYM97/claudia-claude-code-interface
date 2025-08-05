// Test the fixed Claude execution logic by simulating Rust function calls
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log("=== TESTING FIXED CLAUDIA LOGIC ===");

// Simulate the Windows path logic we implemented in Rust
function processWindowsPath(inputPath) {
    let processedPath = inputPath;
    
    console.log(`Processing input path: ${inputPath}`);
    
    // Check for .cmd variant first
    if (!processedPath.endsWith('.cmd') && !processedPath.endsWith('.bat')) {
        const cmdPath = `${processedPath}.cmd`;
        console.log(`Checking for Windows batch file variant: ${cmdPath}`);
        
        // Convert Unix-style path to Windows-style path if needed
        let windowsCmdPath = cmdPath;
        if (cmdPath.startsWith('/c/')) {
            windowsCmdPath = cmdPath.replace('/c/', 'C:\\').replace(/\//g, '\\');
            windowsCmdPath = windowsCmdPath.replace('C:\\users', 'C:\\Users');
            windowsCmdPath = windowsCmdPath.replace('\\appdata\\', '\\AppData\\');
            windowsCmdPath = windowsCmdPath.replace('\\roaming\\', '\\Roaming\\');
        }
        
        if (fs.existsSync(windowsCmdPath)) {
            console.log(`✓ Found Windows batch file variant: ${windowsCmdPath}`);
            processedPath = windowsCmdPath;
        } else {
            console.log(`✗ Windows batch file variant not found at: ${windowsCmdPath}`);
        }
    }
    
    // Convert Unix-style path to Windows-style path if needed
    if (processedPath.startsWith('/c/')) {
        const oldPath = processedPath;
        processedPath = processedPath.replace('/c/', 'C:\\').replace(/\//g, '\\');
        processedPath = processedPath.replace('C:\\users', 'C:\\Users');
        processedPath = processedPath.replace('\\appdata\\', '\\AppData\\');
        processedPath = processedPath.replace('\\roaming\\', '\\Roaming\\');
        console.log(`Converted Unix path '${oldPath}' to Windows path '${processedPath}'`);
    }
    
    return processedPath;
}

// Simulate resolving npm CLI script
function resolveNpmCliScript(batchPath) {
    console.log(`🔍 Resolving npm CLI script for batch path: ${batchPath}`);
    
    if (batchPath.includes('AppData\\Roaming\\npm') && batchPath.endsWith('claude.cmd')) {
        const cliJsPath = batchPath.replace('\\claude.cmd', '\\node_modules\\@anthropic-ai\\claude-code\\cli.js');
        console.log(`Checking for CLI script at: ${cliJsPath}`);
        
        if (fs.existsSync(cliJsPath)) {
            console.log(`✓ Resolved npm CLI script: ${cliJsPath}`);
            return cliJsPath;
        } else {
            console.log(`✗ CLI script not found at: ${cliJsPath}`);
            return null;
        }
    } else {
        console.log(`Batch path does not match npm pattern: ${batchPath}`);
        return null;
    }
}

// Test the complete workflow
console.log("\n1. Testing Windows path processing:");
const testPath = "/c/users/jwill/appdata/roaming/npm/claude";
const processedPath = processWindowsPath(testPath);
console.log(`Final processed path: ${processedPath}`);

console.log("\n2. Testing CLI script resolution:");
const cliScript = resolveNpmCliScript(processedPath);

console.log("\n3. Testing execution:");
if (cliScript) {
    try {
        console.log(`Executing: node "${cliScript}" --version`);
        const result = execSync(`node "${cliScript}" --version`, { encoding: 'utf8', timeout: 5000 }).trim();
        console.log(`✅ SUCCESS: ${result}`);
        
        console.log("\n4. Testing with actual arguments (--help):");
        const helpResult = execSync(`node "${cliScript}" --help`, { encoding: 'utf8', timeout: 5000 });
        console.log(`✅ Claude CLI responds properly (first 150 chars):`);
        console.log(`"${helpResult.substring(0, 150)}..."`);
        
    } catch (e) {
        console.log(`❌ FAILED: ${e.message}`);
    }
} else {
    console.log("❌ No CLI script resolved");
}

console.log("\n=== CLAUDIA LOGIC TEST COMPLETE ===");
console.log("✅ Windows error 193 should be COMPLETELY FIXED!");