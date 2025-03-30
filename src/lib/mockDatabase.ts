// Mock database for development use
// This module provides a centralized data store for all API routes

// Database record types
export interface McpRecord {
  config: string;
  createdAt: Date;
  userId?: string;
}

// The shared mock database
export const mockDatabase: Record<string, McpRecord> = {
  'test-uuid-123': {
    config: JSON.stringify({ description: 'Initial test MCP', resources: [], tools: [], prompts: [] }, null, 2),
    createdAt: new Date(),
    userId: 'mock-user-1'
  },
  'test-uuid-456': {
    config: JSON.stringify({ description: 'Another MCP', resources: [], tools: [], prompts: [] }, null, 2),
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    userId: 'mock-user-1'
  },
  'test-uuid-789': {
    config: JSON.stringify({ description: 'Third MCP Example', resources: [], tools: [], prompts: [] }, null, 2),
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    userId: 'mock-user-2' // Different user
  }
};

// Helper functions for database operations
export function getMcp(id: string): McpRecord | null {
  return mockDatabase[id] || null;
}

export function createMcp(id: string, record: McpRecord): void {
  mockDatabase[id] = record;
}

export function updateMcp(id: string, data: Partial<McpRecord>): boolean {
  if (!mockDatabase[id]) return false;
  
  mockDatabase[id] = {
    ...mockDatabase[id],
    ...data
  };
  
  return true;
}

export function deleteMcp(id: string): boolean {
  if (!mockDatabase[id]) return false;
  
  delete mockDatabase[id];
  return true;
}

export function listMcps(userId?: string): Array<{ mcpId: string; name: string; createdAt: Date; userId?: string }> {
  return Object.entries(mockDatabase)
    .filter(([_, data]) => !userId || data.userId === userId)
    .map(([id, data]) => ({
      mcpId: id,
      name: JSON.parse(data.config).description || `MCP ${id.substring(0, 6)}`,
      createdAt: data.createdAt,
      userId: data.userId
    }));
} 