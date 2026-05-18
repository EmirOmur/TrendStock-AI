import RiskBadge from './RiskBadge.jsx';

const SCORE_BAR_COLOR = {
  HIGH: 'bg-red-500',
  MEDIUM: 'bg-amber-500',
  LOW: 'bg-green-500',
};

export default function ProductCard({ product, isSelected, onSelect }) {
  const { riskMetrics } = product;

  return (
    <div
      onClick={() => onSelect(product)}
      className={`cursor-pointer rounded-xl border p-4 shadow-sm transition-all duration-200 hover:shadow-md ${
        isSelected
          ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          {product.category}
        </span>
        <RiskBadge level={riskMetrics.level} />
      </div>

      <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-3">
        {product.name}
      </h3>

      {/* Risk score bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Risk Score</span>
          <span className="font-bold text-gray-600">{riskMetrics.score} / 100</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${SCORE_BAR_COLOR[riskMetrics.level]}`}
            style={{ width: `${riskMetrics.score}%` }}
          />
        </div>
      </div>

      {/* Key metrics row */}
      <div className="grid grid-cols-3 gap-2 text-xs text-center mb-3">
        <div>
          <p className="text-gray-400 mb-0.5">Stock Days</p>
          <p className={`font-semibold ${riskMetrics.isStockoutRisk ? 'text-red-600' : 'text-gray-700'}`}>
            {riskMetrics.daysUntilStockout}d
          </p>
        </div>
        <div>
          <p className="text-gray-400 mb-0.5">Sales 7d</p>
          <p className={`font-semibold ${product.salesChange7d < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {product.salesChange7d > 0 ? '+' : ''}{product.salesChange7d}%
          </p>
        </div>
        <div>
          <p className="text-gray-400 mb-0.5">Margin</p>
          <p className={`font-semibold ${product.profitMargin < 20 ? 'text-amber-600' : 'text-gray-700'}`}>
            {product.profitMargin}%
          </p>
        </div>
      </div>

      {/* Risk flags */}
      <div className="flex flex-wrap gap-1">
        {riskMetrics.isStockoutRisk && (
          <Flag color="red">Stockout</Flag>
        )}
        {riskMetrics.isSalesDrop && (
          <Flag color="orange">Sales Drop</Flag>
        )}
        {riskMetrics.isTrendOpportunity && (
          <Flag color="blue">Trend ↑</Flag>
        )}
        {riskMetrics.isPricePressure && (
          <Flag color="purple">Price War</Flag>
        )}
        {riskMetrics.score === 0 && (
          <Flag color="green">Healthy</Flag>
        )}
      </div>
    </div>
  );
}

function Flag({ color, children }) {
  const colorMap = {
    red: 'bg-red-50 text-red-600 border-red-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    green: 'bg-green-50 text-green-600 border-green-100',
  };
  return (
    <span className={`px-1.5 py-0.5 rounded text-xs border font-medium ${colorMap[color]}`}>
      {children}
    </span>
  );
}
