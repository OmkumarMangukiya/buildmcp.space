/**
 * Utility for logging prompts sent to LLMs
 */
import * as fs from 'fs';
import * as path from 'path';

// Directory where logs will be stored
const LOGS_DIR = path.join(process.cwd(), 'llm-logs');

/**
 * Ensures the logs directory exists
 */
function ensureLogsDirectory() {
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  }
}

/**
 * Log a prompt sent to the LLM
 */
export function logPrompt(prompt: string, metadata: Record<string, any> = {}) {
  ensureLogsDirectory();
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `prompt-${timestamp}.md`;
  const filepath = path.join(LOGS_DIR, filename);
  
  const content = `# MCP Server Generation Prompt
  
## Timestamp
${new Date().toISOString()}

## Metadata
\`\`\`json
${JSON.stringify(metadata, null, 2)}
\`\`\`

## Full Prompt
\`\`\`
${prompt}
\`\`\`
`;

  fs.writeFileSync(filepath, content);
  console.log(`Prompt logged to: ${filepath}`);
  
  // Update latest.md with the most recent prompt
  const latestPath = path.join(LOGS_DIR, 'latest.md');
  fs.writeFileSync(latestPath, content);
  
  return filepath;
}

/**
 * Read documentation from a file
 */
export function readDocFile(filename: string): string {
  try {
    // Try to read from the public directory first
    const publicPath = path.join(process.cwd(), 'public', filename);
    if (fs.existsSync(publicPath)) {
      return fs.readFileSync(publicPath, 'utf8');
    }
    
    // Try to read from the root directory next
    const rootPath = path.join(process.cwd(), filename);
    if (fs.existsSync(rootPath)) {
      return fs.readFileSync(rootPath, 'utf8');
    }
    
    // If file not found, return a placeholder
    return `[Documentation file ${filename} not found]`;
  } catch (error) {
    console.error(`Error reading doc file ${filename}:`, error);
    return `[Error reading documentation file ${filename}]`;
  }
} 