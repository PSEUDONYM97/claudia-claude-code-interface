import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log("=== CLAUDE PATH DEBUG ===");

// Test 1: What does 'which claude' return?
try {
    const whichResult = execSync('which claude', { encoding: 'utf8' }).trim();
    console.log(`1. 'which claude' returns: "${whichResult}"`);
    
    // Test 2: Does the Unix shell script exist?
    const shellScriptExists = fs.existsSync(whichResult);
    console.log(`2. Unix shell script exists: ${shellScriptExists}`);
    
    // Test 3: Does the .cmd file exist at Unix path?
    const unixCmdPath = whichResult + '.cmd';
    const unixCmdExists = fs.existsSync(unixCmdPath);
    console.log(`3. CMD file exists at Unix path "${unixCmdPath}": ${unixCmdExists}`);
    
    // Test 4: Convert to Windows path (proper case)
    const windowsPath = whichResult.replace('/c/', 'C:\\').replace(/\//g, '\\');
    const properWindowsPath = windowsPath.replace('C:\\users', 'C:\\Users');
    const windowsCmdPath = windowsPath + '.cmd';
    const properWindowsCmdPath = properWindowsPath + '.cmd';
    console.log(`4. Windows path would be: "${windowsPath}"`);
    console.log(`4b. Proper Windows path would be: "${properWindowsPath}"`);
    console.log(`5. Windows CMD path would be: "${windowsCmdPath}"`);
    console.log(`5b. Proper Windows CMD path would be: "${properWindowsCmdPath}"`);
    
    // Test 5: Does Windows CMD file exist?
    const windowsCmdExists = fs.existsSync(windowsCmdPath);
    const properWindowsCmdExists = fs.existsSync(properWindowsCmdPath);
    console.log(`6. Windows CMD file exists: ${windowsCmdExists}`);
    console.log(`6b. Proper Windows CMD file exists: ${properWindowsCmdExists}`);
    
    // Test 6: Test direct execution
    console.log("\n=== EXECUTION TESTS ===");
    
    try {
        // The CLI script is in the npm directory, not the claude directory
        const cliScriptPath = properWindowsPath.replace('\\claude', '\\node_modules\\@anthropic-ai\\claude-code\\cli.js');
        const nodeResult = execSync(`node "${cliScriptPath}" --version`, { encoding: 'utf8' }).trim();
        console.log(`7. Direct Node.js execution works: "${nodeResult}"`);
        console.log(`   CLI script path: "${cliScriptPath}"`);
    } catch (e) {
        console.log(`7. Direct Node.js execution failed: ${e.message}`);
        const cliScriptPath = properWindowsPath.replace('\\claude', '\\node_modules\\@anthropic-ai\\claude-code\\cli.js');
        console.log(`   Tried CLI script path: "${cliScriptPath}"`);
    }
    
    try {
        const cmdResult = execSync(`"${properWindowsCmdPath}" --version`, { encoding: 'utf8' }).trim();
        console.log(`8. Proper Windows CMD file execution works: "${cmdResult}"`);
    } catch (e) {
        console.log(`8. Proper Windows CMD file execution failed: ${e.message}`);
    }
    
    try {
        const shellResult = execSync(`"${whichResult}" --version`, { encoding: 'utf8' }).trim();
        console.log(`9. Unix shell script execution works: "${shellResult}"`);
    } catch (e) {
        console.log(`9. Unix shell script execution failed: ${e.message}`);
    }
    
} catch (error) {
    console.error("Error during debugging:", error.message);
}