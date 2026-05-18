import RiskBadge from './RiskBadge.jsx';

const SCORE_COLOR = {
  HIGH:   'bg-red-500',
  MEDIUM: 'bg-amber-500',
  LOW:    'bg-green-500',
};

export default function ProductCard({ product, isSelected, onSelect }) {
  const rm = product.riskMetrics;

  return (
    <div
      onClick={() => onSelect(product)}
      className={`cursor-pointer rounded-xl border p-3.5 transition-all duration-200 ${
        isSelected
          ? 'border-cyan-500/50 bg-slate-800 ring-1 ring-cyan-500/20'
          : 'border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800/40'
      }`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-600 uppercase tracking-widest">
          {product.category}
        </span>
        <RiskBadge level={rm.level} />
      </div>

      {/* Product name */}
      <h3 className="text-sm font-semibold text-slate-100 leading-snug mb-3 pr-2">
        {product.name}
      </h3>

      {/* Risk score bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-slate-600">Risk Score</span>
          <span className={`text-xs font-bold ${
            rm.level === 'HIGH' ? 'text-red-400' :
            rm.level === 'MEDIUM' ? 'text-amber-400' : 'text-green-400'
          }`}>
            {rm.score} / 100
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1">
          <div
            className={`h-1 rounded-full transition-all duration-700 ${SCORE_COLOR[rm.level]}`}
            style={{ width: `${rm.score}%` }}
          />
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-1 text-xs text-center mb-3">
        <Metric
          label="Stock"
          value={`${rm.daysUntilStockout}d`}
          danger={rm.isStockoutRisk}
        />
        <Metric
          label="Sales 7d"
          value={`${product.salesChange7d > 0 ? '+' : ''}${product.salesChange7d}%`}
          danger={product.salesChange7d < -15}
          positive={product.salesChange7d > 0}
        />
        <Metric
          label="Margin"
          value={`${product.profitMargin}%`}
          danger={product.profitMargin < 20}
        />
      </div>

      {/* Risk flag chips */}
      <div className="flex flex-wrap gap-1">
        {rm.isStockoutRisk && <Chip color="red">Stockout</Chip>}
        {rm.isSalesDrop    && <Chip color="orange">Sales Drop</Chip>}
        {rm.isTrendOpportunity && <Chip color="cyan">Trend ↑</Chip>}
        {rm.isPricePressure && <Chip color="purple">Price War</Chip>}
        {rm.score === 0 && <Chip color="green">Healthy ✓</Chip>}
      </div>
    </div>
  );
}

function Metric({ label, value, danger, positive }) {
  return (
    <div className="rounded bg-slate-800/60 py-1.5">
      <p className="text-slate-600 mb-0.5 text-xs">{label}</p>
      <p className={`font-semibold text-xs ${
        danger   ? 'text-red-400'  :
        positive ? 'text-green-400' :
                   'text-slate-300'
      }`}>
        {value}
      </p>
    </div>
  );
}

function Chip({ color, children }) {
  const map = {
    red:    'bg-red-500/10 text-red-400 border-red-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    cyan:   'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    green:  'bg-green-500/10 text-green-400 border-green-500/20',
  };
  return (
    <span className={`px-1.5 py-0.5 rounded text-xs border font-medium ${map[color]}`}>
      {children}
    </span>
  );
}
