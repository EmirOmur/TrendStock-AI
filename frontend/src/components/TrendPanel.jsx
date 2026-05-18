export default function TrendPanel({ product }) {
  if (!product) return null;

  const trendColor = product.trendChange > 0 ? 'text-green-600' : 'text-red-600';
  const priceColor = product.competitorPriceChange < 0 ? 'text-red-600' : 'text-green-600';

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Market Signals</h3>

      <div className="space-y-3">
        <Row
          label="Search Trend"
          value={`${product.trendChange > 0 ? '+' : ''}${product.trendChange}%`}
          valueClass={trendColor}
        />
        <Row
          label="Competitor Price"
          value={`${product.competitorPriceChange > 0 ? '+' : ''}${product.competitorPriceChange}%`}
          valueClass={priceColor}
          hint={product.competitorPriceChange < -5 ? 'Aggressive undercutting' : undefined}
        />
        <Row
          label="Your Price"
          value={`$${product.price}`}
          sub={product.price !== product.previousPrice ? `was $${product.previousPrice}` : undefined}
        />
        <Row label="Profit Margin" value={`${product.profitMargin}%`}
          valueClass={product.profitMargin < 20 ? 'text-amber-600 font-semibold' : 'text-gray-700'}
        />
        <div className="pt-2 border-t border-gray-100">
          <Row label="Supplier Country" value={product.supplierCountry} />
          <Row label="Lead Time" value={`${product.supplierLeadTimeDays} days`} />
          <Row label="Daily Sales Avg" value={`${product.avgDailySales} units/day`} />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, valueClass = 'text-gray-700', hint, sub }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <div className="text-right">
        <span className={`font-medium ${valueClass}`}>{value}</span>
        {hint && <p className="text-xs text-red-400">{hint}</p>}
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}
