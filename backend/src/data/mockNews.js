// Mock news and market intelligence data — 12 items across multiple categories.
// In a real deployment these would come from Google News API, RSS feeds, or Pub/Sub events.

export const mockNews = [
  {
    id: 'news_001',
    title: 'Coffee Bean Prices Surge After Colombian Supply Disruption',
    source: 'Reuters Market Watch',
    category: 'Supply Chain',
    affectedCategories: ['Coffee'],
    riskLevel: 'HIGH',
    sentiment: 'NEGATIVE',
    impactScore: 88,
    summary:
      'Coffee bean futures rose 12% this week following reports of crop damage and export delays in Colombia. Specialty coffee sellers may face 15–20% margin compression over the next 30 days as raw material costs climb.',
    publishedAt: '2026-05-19T08:30:00Z',
    suggestedAction:
      'Review pricing strategy immediately and consider pre-purchasing reserve stock before further price increases hit the supply chain.',
  },
  {
    id: 'news_002',
    title: 'Back-to-School Searches Peak 3 Weeks Early — Electronics & Fashion Trending',
    source: 'Google Trends Insights',
    category: 'Market Trend',
    affectedCategories: ['Electronics', 'Fashion'],
    riskLevel: 'MEDIUM',
    sentiment: 'POSITIVE',
    impactScore: 72,
    summary:
      'Consumer search data shows back-to-school shopping intent is arriving 3 weeks ahead of schedule this year. USB hubs, laptop accessories, and casual fashion are seeing strong pre-season search volume surges with strong conversion intent.',
    publishedAt: '2026-05-18T14:00:00Z',
    suggestedAction:
      'Launch early back-to-school promotions now and verify stock levels for Electronics and Fashion categories before demand peaks.',
  },
  {
    id: 'news_003',
    title: 'Major Shipping Delays Reported Across Asian Ports — Lead Times Up 40%',
    source: 'Freightos Market Report',
    category: 'Supply Chain',
    affectedCategories: ['Electronics', 'Home', 'Fashion', 'Gaming'],
    riskLevel: 'HIGH',
    sentiment: 'NEGATIVE',
    impactScore: 95,
    summary:
      'Multiple Chinese, Vietnamese, and Bangladeshi ports are experiencing significant congestion, pushing average shipping lead times from 21 to 30+ days. Products sourced from Asia are at elevated stockout risk — any inventory model using pre-disruption lead times is now dangerously optimistic.',
    publishedAt: '2026-05-17T09:15:00Z',
    suggestedAction:
      'Increase safety stock immediately for all Asia-sourced products and update supplier lead time assumptions in your inventory models from 21 to 30+ days.',
  },
  {
    id: 'news_004',
    title: 'K-Beauty Skincare Demand Hits Record High on Social Commerce',
    source: 'Beauty Industry Monitor',
    category: 'Market Trend',
    affectedCategories: ['Beauty'],
    riskLevel: 'LOW',
    sentiment: 'POSITIVE',
    impactScore: 81,
    summary:
      'Korean beauty products are experiencing a sustained demand surge driven by viral content on major social platforms. Vitamin C serums and hydrating essences are among the top gainers, showing 35%+ search growth. Sellers who can maintain stock are seeing strong revenue uplift.',
    publishedAt: '2026-05-16T11:00:00Z',
    suggestedAction:
      'Capitalize on the K-Beauty wave with targeted social campaigns and ensure optimized product listings for high-traffic beauty search keywords.',
  },
  {
    id: 'news_005',
    title: 'Home Air Quality Products Spike Amid Seasonal Allergy Season',
    source: 'Consumer Trends Weekly',
    category: 'Market Trend',
    affectedCategories: ['Home'],
    riskLevel: 'MEDIUM',
    sentiment: 'POSITIVE',
    impactScore: 67,
    summary:
      'Searches for air purifiers and HEPA filters spiked 28% following regional pollen alerts and air quality advisories. Despite strong demand signals, many Home category sellers face inventory risk — a dangerous combination of high demand and low stock.',
    publishedAt: '2026-05-15T16:45:00Z',
    suggestedAction:
      'Restock air purifier inventory urgently and update product listings with allergy-season keywords to capture peak search traffic.',
  },
  {
    id: 'news_006',
    title: 'Gaming Peripheral Market Heats Up Ahead of Summer Gaming Season',
    source: 'PC Gamer Market Report',
    category: 'Market Trend',
    affectedCategories: ['Gaming'],
    riskLevel: 'MEDIUM',
    sentiment: 'POSITIVE',
    impactScore: 76,
    summary:
      'The gaming peripheral sector is seeing a surge in demand as summer school holidays approach. Mechanical keyboards and gaming mice are trending strongly across streaming platforms. Several dominant brands have cut prices by 10–15%, putting pressure on mid-tier sellers.',
    publishedAt: '2026-05-14T10:30:00Z',
    suggestedAction:
      'Review your pricing against top competitors immediately. Consider bundle deals (keyboard + mouse) to maintain margin while staying competitive.',
  },
  {
    id: 'news_007',
    title: 'Remote Work Equipment Demand Surges — Standing Desks Backlogged',
    source: 'Office Furnishing Today',
    category: 'Supply Chain',
    affectedCategories: ['Office'],
    riskLevel: 'HIGH',
    sentiment: 'NEGATIVE',
    impactScore: 89,
    summary:
      'A renewed wave of hybrid work mandates is driving 40% demand growth in home office furniture. Standing desks and ergonomic chairs are seeing 3–4 week backlog times as manufacturers struggle to keep up. Sellers without immediate stock risk losing significant sales to better-stocked competitors.',
    publishedAt: '2026-05-13T12:00:00Z',
    suggestedAction:
      'Place emergency restocking orders now and consider premium pricing to manage demand while stock lasts.',
  },
  {
    id: 'news_008',
    title: 'Pet Food Recall Scare Creates Anxiety — Grain-Free Segment Booming',
    source: 'Pet Industry News',
    category: 'Market Trend',
    affectedCategories: ['Pet Supplies'],
    riskLevel: 'MEDIUM',
    sentiment: 'POSITIVE',
    impactScore: 62,
    summary:
      'A high-profile recall of a major grain-based dog food brand has driven consumers toward premium grain-free alternatives. Search volumes for grain-free dog food are up 38% week-over-week, with strong buying intent signals from health-conscious pet owners.',
    publishedAt: '2026-05-12T15:20:00Z',
    suggestedAction:
      'Highlight grain-free certification prominently in product listings and increase ad spend to capture high-intent traffic now shifting away from recalled brands.',
  },
  {
    id: 'news_009',
    title: 'Fitness Category Sees Sustained Recovery After Gym Re-engagement',
    source: 'Wellness Market Tracker',
    category: 'Market Trend',
    affectedCategories: ['Sports'],
    riskLevel: 'LOW',
    sentiment: 'POSITIVE',
    impactScore: 55,
    summary:
      'Despite gym memberships hitting record highs again, the home fitness accessories market is holding strong. Consumers are maintaining parallel gym + home routines, keeping resistance bands, yoga mats, and similar accessories in steady demand through H1 2026.',
    publishedAt: '2026-05-11T09:00:00Z',
    suggestedAction:
      'No immediate action required. Consider building review count and organic search rank while conditions are stable.',
  },
  {
    id: 'news_010',
    title: 'Protein Supplement Market Grows 18% YoY — Online Channels Dominate',
    source: 'Nutrition Industry Monitor',
    category: 'Market Trend',
    affectedCategories: ['Grocery'],
    riskLevel: 'LOW',
    sentiment: 'POSITIVE',
    impactScore: 60,
    summary:
      'The sports nutrition and protein bar segment continues its multi-year growth trajectory, up 18% year-over-year. E-commerce now accounts for 62% of all protein supplement sales, with subscription models showing particularly strong retention metrics. Competition is increasing but market growth is absorbing new entrants.',
    publishedAt: '2026-05-10T11:30:00Z',
    suggestedAction:
      'Explore subscription or multi-pack bundle pricing to lock in loyal customers before new entrants gain market share.',
  },
  {
    id: 'news_011',
    title: 'Fast Fashion Slowdown — Consumers Shift to Premium Basics',
    source: 'Fashion Retail Digest',
    category: 'Market Trend',
    affectedCategories: ['Fashion'],
    riskLevel: 'MEDIUM',
    sentiment: 'NEUTRAL',
    impactScore: 58,
    summary:
      'Consumer sentiment surveys show growing preference for fewer, higher-quality clothing purchases over fast fashion. This trend is accelerating the decline of mid-range fashion while benefiting premium basics and leather goods. Sellers of premium basics like chinos and leather wallets face both a structural opportunity and margin pressure from luxury entrants.',
    publishedAt: '2026-05-09T14:00:00Z',
    suggestedAction:
      'Strengthen quality messaging and materials storytelling in listings. Consider repositioning mid-range items toward "premium everyday" positioning.',
  },
  {
    id: 'news_012',
    title: 'Caffeine Culture Expands: Cold Brew and Specialty Coffee Drive Category Growth',
    source: 'Beverage Business Insider',
    category: 'Market Trend',
    affectedCategories: ['Coffee'],
    riskLevel: 'LOW',
    sentiment: 'POSITIVE',
    impactScore: 70,
    summary:
      'Cold brew concentrate and specialty single-origin coffees are the two fastest-growing segments in the home coffee market, with 22% and 18% YoY growth respectively. The premiumization wave continues as consumers increasingly seek barista-quality experiences at home. Well-positioned sellers with strong brand stories are seeing above-average conversion rates.',
    publishedAt: '2026-05-08T08:00:00Z',
    suggestedAction:
      'Invest in brand storytelling around origin, process, and quality. Highlight unique value propositions to stand out from commodity competitors.',
  },
];
