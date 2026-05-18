// Product-level market context panel — dark theme.
// Shows competitor pricing, trend signals, supplier details for the selected product.

export default function TrendPanel({ product }) {
  if (!product) return null;

  const trendPositive = product.trendChange > 0;
  const priceNegative = product.competitorPriceChange < -5;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
        🏪 Product Context
      </h3>

      <div className="space-y-2.5">
        <Row
          label="Search Trend"
          value={`${trendPositive ? '+' : ''}${product.trendChange}%`}
          valueClass={trendPositive ? 'text-cyan-400' : 'text-red-400'}
        />
        <Row
          label="Competitor Price"
          value={`${product.competitorPriceChange > 0 ? '+' : ''}${product.competitorPriceChange}%`}
          valueClass={priceNegative ? 'text-red-400' : 'text-slate-300'}
          hint={priceNegative ? 'Aggressive undercutting detected' : undefined}
        />
        <Row
          label="Your Price"
          value={`$${product.price}`}
          sub={product.price !== product.previousPrice ? `was $${product.previousPrice}` : undefined}
        />
        <Row
          label="Profit Margin"
          value={`${product.profitMargin}%`}
          valueClass={product.profitMargin < 20 ? 'text-amber-400 font-bold' : 'text-slate-300'}
          hint={product.profitMargin < 20 ? 'Below 20% threshold' : undefined}
        />

        <div className="pt-2 border-t border-slate-800 space-y-2.5">
          <Row label="Supplier" value={product.supplierCountry} />
          <Row label="Lead Time" value={`${product.supplierLeadTimeDays} days`} />
          <Row label="Avg Daily Sales" value={`${product.avgDailySales} units/day`} />
          <Row label="Stock Remaining" value={`${product.currentStock} units`}
            valueClass={product.riskMetrics?.isStockoutRisk ? 'text-red-400 font-bold' : 'text-slate-300'}
          />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, valueClass = 'text-slate-300', hint, sub }) {
  return (
    <div className="flex items-start justify-between text-xs gap-2">
      <span className="text-slate-500 flex-shrink-0">{label}</span>
      <div className="text-right">
        <span className={`font-medium ${valueClass}`}>{value}</span>
        {hint && <p className="text-xs text-red-400/80 mt-0.5">{hint}</p>}
        {sub  && <p className="text-xs text-slate-600 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
