import { mockSupplyChainRisks } from '../data/mockSupplyChainRisks.js';

export function getSupplyChainRisks(filters = {}) {
  let data = [...mockSupplyChainRisks];

  if (filters.severity) {
    data = data.filter(r => r.severity === filters.severity);
  }
  if (filters.category) {
    data = data.filter(r => r.affectedCategories.includes(filters.category));
  }
  if (filters.sourceType) {
    data = data.filter(r => r.sourceType === filters.sourceType);
  }

  const summary = {
    total: mockSupplyChainRisks.length,
    high: mockSupplyChainRisks.filter(r => r.severity === 'high').length,
    medium: mockSupplyChainRisks.filter(r => r.severity === 'medium').length,
    low: mockSupplyChainRisks.filter(r => r.severity === 'low').length,
    totalFinancialImpact: mockSupplyChainRisks.reduce((s, r) => s + Math.abs(r.estimatedFinancialImpact), 0),
    affectedCategories: [...new Set(mockSupplyChainRisks.flatMap(r => r.affectedCategories))],
    avgProbability: Math.round(mockSupplyChainRisks.reduce((s, r) => s + r.probability, 0) / mockSupplyChainRisks.length),
  };

  return { risks: data, summary };
}

export function getSupplyChainRiskById(id) {
  return mockSupplyChainRisks.find(r => r.id === id) || null;
}
