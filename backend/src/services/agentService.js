import { mockAgentLogs, agentDefinitions } from '../data/mockAgentLogs.js';

export function getAgentLogs(filters = {}) {
  let logs = [...mockAgentLogs];

  if (filters.agentId) {
    logs = logs.filter(l => l.agentId === filters.agentId);
  }
  if (filters.priority) {
    logs = logs.filter(l => l.priority === filters.priority);
  }
  if (filters.productId) {
    logs = logs.filter(l => l.linkedProductId === filters.productId);
  }

  const executiveSummary = mockAgentLogs.find(l => l.isExecutiveSummary) || null;

  const summary = {
    totalLogs: mockAgentLogs.length,
    criticalActions: mockAgentLogs.filter(l => l.priority === 'critical').length,
    highActions: mockAgentLogs.filter(l => l.priority === 'high').length,
    avgConfidence: Math.round(mockAgentLogs.reduce((s, l) => s + l.confidence, 0) / mockAgentLogs.length),
    agentsActive: agentDefinitions.length,
  };

  return { logs, agents: agentDefinitions, executiveSummary, summary };
}
