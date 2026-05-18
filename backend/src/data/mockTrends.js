// Supplementary trend data — Google Trends-style search volume over the last 14 days.
// Keyed by product ID. Used by trendService and available for future TrendPanel extension.

export const mockTrends = {
  prod_001: {
    productId: 'prod_001',
    keyword: 'espresso blend specialty coffee',
    searchVolume: [42, 44, 43, 45, 47, 46, 48, 50, 51, 52, 53, 55, 54, 56],
    peakSeason: 'Winter (Oct–Feb)',
    marketGrowthYoY: '+8%',
    relatedKeywords: ['arabica beans', 'specialty coffee', 'single origin espresso'],
    notes: 'Stable upward trend but product sales are declining — possible visibility or pricing issue.',
  },

  prod_002: {
    productId: 'prod_002',
    keyword: 'USB-C hub multiport adapter',
    searchVolume: [55, 58, 60, 63, 68, 72, 75, 78, 82, 85, 88, 91, 95, 98],
    peakSeason: 'Year-round (peaks in Sept with back-to-school)',
    marketGrowthYoY: '+32%',
    relatedKeywords: ['USB-C multiport', 'laptop hub', 'fast charging hub'],
    notes: 'Strong search growth driven by MacBook/laptop adoption. Trend opportunity is real.',
  },

  prod_003: {
    productId: 'prod_003',
    keyword: 'vitamin C serum brightening skin',
    searchVolume: [60, 62, 65, 68, 70, 74, 78, 80, 83, 86, 90, 92, 95, 98],
    peakSeason: 'Spring & Summer (Mar–Aug)',
    marketGrowthYoY: '+22%',
    relatedKeywords: ['vitamin C serum', 'brightening serum', 'anti-aging vitamin c'],
    notes: 'High search growth but sales declining — critical trend divergence. Price or discoverability issue.',
  },

  prod_004: {
    productId: 'prod_004',
    keyword: 'resistance bands home workout',
    searchVolume: [48, 49, 50, 51, 50, 52, 53, 54, 53, 55, 56, 55, 57, 58],
    peakSeason: 'January (New Year resolutions) & Spring',
    marketGrowthYoY: '+15%',
    relatedKeywords: ['resistance bands set', 'home gym equipment', 'workout bands'],
    notes: 'Healthy steady trend with slight growth. No immediate risk.',
  },

  prod_005: {
    productId: 'prod_005',
    keyword: 'air purifier home HEPA',
    searchVolume: [35, 36, 35, 37, 36, 38, 37, 38, 39, 40, 39, 41, 40, 42],
    peakSeason: 'Autumn (Sep–Nov, allergy season)',
    marketGrowthYoY: '+10%',
    relatedKeywords: ['HEPA air purifier', 'home air cleaner', 'air quality monitor'],
    notes: 'Modest trend growth. Stockout risk is the primary concern given 21-day lead time.',
  },

  prod_006: {
    productId: 'prod_006',
    keyword: 'slim fit chinos men fashion',
    searchVolume: [50, 52, 55, 58, 60, 65, 68, 72, 75, 78, 82, 85, 88, 92],
    peakSeason: 'Spring/Summer (Mar–Jun)',
    marketGrowthYoY: '+18%',
    relatedKeywords: ['slim chinos', 'men slim pants', 'chino trousers fashion'],
    notes: 'Strong fashion trend upswing but sales are dropping — competitor discounting likely pulling demand.',
  },
};
