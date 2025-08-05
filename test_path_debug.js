import { execSync } from 'child_process';
import fs from 'fs';

console.log("=== REAL-TIME PATH DEBUG ===");

// Test the exact scenario that Rust is doing
try {
    const whichResult = execSync('which claude', { encoding: 'utf8' }).trim();
    console.log(`1. 'which claude' returns: "${whichResult}"`);
    
    // Test what my Rust logic would do:
    let path = whichResult;
    console.log(`2. Initial path: "${path}"`);
    
    // Step 1: Add .cmd to find the batch file
    if (!path.endsWith(".cmd") && !path.endsWith(".bat")) {
        const cmd_path = path + ".cmd";
        console.log(`3. Trying CMD path: "${cmd_path}"`);
        
        // Step 2: Convert to Windows path
        let windows_cmd_path;
        if (cmd_path.startsWith("/c/")) {
            windows_cmd_path = cmd_path.replace("/c/", "C:\\").replace(/\//g, "\\");
            windows_cmd_path = windows_cmd_path.replace("C:\\users", "C:\\Users");
            windows_cmd_path = windows_cmd_path.replace("\\appdata\\", "\\AppData\\");
            windows_cmd_path = windows_cmd_path.replace("\\roaming\\", "\\Roaming\\");
        } else {
            windows_cmd_path = cmd_path;
        }
        
        console.log(`4. Windows CMD path: "${windows_cmd_path}"`);
        console.log(`5. CMD file exists: ${fs.existsSync(windows_cmd_path)}`);
        
        if (fs.existsSync(windows_cmd_path)) {
            path = cmd_path; // Keep Unix path for later conversion
            console.log(`6. Using CMD path: "${path}"`);
        }
    }
    
    // Step 3: Final path conversion
    if (path.startsWith("/c/")) {
        const old_path = path;
        path = path.replace("/c/", "C:\\").replace(/\//g, "\\");
        path = path.replace("C:\\users", "C:\\Users");
        path = path.replace("\\appdata\\", "\\AppData\\");
        path = path.replace("\\roaming\\", "\\Roaming\\");
        console.log(`7. Final conversion: "${old_path}" -> "${path}"`);
    }
    
    console.log(`8. Final path: "${path}"`);
    console.log(`9. Final path exists: ${fs.existsSync(path)}`);
    
    // Test CLI script resolution
    if (path.includes("AppData\\Roaming\\npm") && path.endsWith("claude.cmd")) {
        const cli_js_path = path.replace("\\claude.cmd", "\\node_modules\\@anthropic-ai\\claude-code\\cli.js");
        console.log(`10. CLI script path: "${cli_js_path}"`);
        console.log(`11. CLI script exists: ${fs.existsSync(cli_js_path)}`);
        
        if (fs.existsSync(cli_js_path)) {
            console.log("✅ SHOULD USE DIRECT NODE.JS EXECUTION");
            try {
                const result = execSync(`node "${cli_js_path}" --version`, { encoding: 'utf8' }).trim();
                console.log(`12. Direct Node.js test: "${result}"`);
            } catch (e) {
                console.log(`12. Direct Node.js test FAILED: ${e.message}`);
            }
        } else {
            console.log("❌ WILL FALL BACK TO CMD.EXE");
            try {
                const result = execSync(`"${path}" --version`, { encoding: 'utf8' }).trim();
                console.log(`13. CMD.exe test: "${result}"`);
            } catch (e) {
                console.log(`13. CMD.exe test FAILED: ${e.message}`);
            }
        }
    }
    
} catch (error) {
    console.error("Error during debugging:", error.message);
}