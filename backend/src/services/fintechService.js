import { mockFintechOffers } from '../data/mockFintechOffers.js';

export function getFintechOffers(filters = {}) {
  let data = [...mockFintechOffers];

  if (filters.type) {
    data = data.filter(o => o.type === filters.type);
  }
  if (filters.riskLevel) {
    data = data.filter(o => o.riskLevel === filters.riskLevel);
  }
  if (filters.urgency) {
    data = data.filter(o => o.urgency === filters.urgency);
  }

  const summary = {
    total: mockFintechOffers.length,
    totalAvailableCapital: mockFintechOffers.reduce((s, o) => s + o.amount, 0),
    avgROI: Math.round(mockFintechOffers.reduce((s, o) => s + o.estimatedROI, 0) / mockFintechOffers.length * 10) / 10,
    highUrgency: mockFintechOffers.filter(o => o.urgency === 'high').length,
    byType: {
      micro_credit: mockFintechOffers.filter(o => o.type === 'micro_credit').length,
      inventory_financing: mockFintechOffers.filter(o => o.type === 'inventory_financing').length,
      campaign_budget: mockFintechOffers.filter(o => o.type === 'campaign_budget').length,
      supplier_payment: mockFintechOffers.filter(o => o.type === 'supplier_payment').length,
      working_capital: mockFintechOffers.filter(o => o.type === 'working_capital').length,
    },
  };

  return { offers: data, summary };
}

export function getFintechOfferById(id) {
  return mockFintechOffers.find(o => o.id === id) || null;
}
