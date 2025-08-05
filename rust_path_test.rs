use std::path::PathBuf;
use std::process::Command;

fn main() {
    println!("=== RUST PATH DEBUG ===");
    
    // Simulate the 'which' result
    let which_result = "/c/users/jwill/appdata/roaming/npm/claude";
    println!("1. 'which claude' returns: {}", which_result);
    
    // Step 1: Add .cmd
    let mut path = which_result.to_string();
    if !path.ends_with(".cmd") && !path.ends_with(".bat") {
        let cmd_path = format!("{}.cmd", path);
        println!("2. Trying CMD path: {}", cmd_path);
        
        // Convert to Windows path with proper case
        let windows_cmd_path = if cmd_path.starts_with("/c/") {
            let mut path = cmd_path.replace("/c/", "C:\\").replace("/", "\\");
            path = path.replace("C:\\users", "C:\\Users");
            path = path.replace("\\appdata\\", "\\AppData\\");
            path = path.replace("\\roaming\\", "\\Roaming\\");
            path
        } else {
            cmd_path.clone()
        };
        
        println!("3. Windows CMD path: {}", windows_cmd_path);
        println!("4. CMD file exists: {}", PathBuf::from(&windows_cmd_path).exists());
        
        if PathBuf::from(&windows_cmd_path).exists() {
            path = cmd_path; // Keep Unix path for later conversion
            println!("5. Using CMD path: {}", path);
        }
    }
    
    // Step 2: Final conversion
    if path.starts_with("/c/") {
        let old_path = path.clone();
        path = path.replace("/c/", "C:\\").replace("/", "\\");
        path = path.replace("C:\\users", "C:\\Users");
        path = path.replace("\\appdata\\", "\\AppData\\");
        path = path.replace("\\roaming\\", "\\Roaming\\");
        println!("6. Final conversion: '{}' -> '{}'", old_path, path);
    }
    
    println!("7. Final path: {}", path);
    println!("8. Final path exists: {}", PathBuf::from(&path).exists());
    
    // Test CLI script resolution
    if path.contains("AppData\\Roaming\\npm") && path.ends_with("claude.cmd") {
        let cli_js_path = path.replace("\\claude.cmd", "\\node_modules\\@anthropic-ai\\claude-code\\cli.js");
        println!("9. CLI script path: {}", cli_js_path);
        println!("10. CLI script exists: {}", PathBuf::from(&cli_js_path).exists());
        
        if PathBuf::from(&cli_js_path).exists() {
            println!("✅ SHOULD USE DIRECT NODE.JS EXECUTION");
            
            // Test direct Node.js execution
            match Command::new("node").arg(&cli_js_path).arg("--version").output() {
                Ok(output) if output.status.success() => {
                    let result = String::from_utf8_lossy(&output.stdout).trim().to_string();
                    println!("11. Direct Node.js test: '{}'", result);
                }
                Ok(_) => println!("11. Direct Node.js test FAILED: non-zero exit"),
                Err(e) => println!("11. Direct Node.js test FAILED: {}", e),
            }
        } else {
            println!("❌ WILL FALL BACK TO CMD.EXE");
        }
    }
}