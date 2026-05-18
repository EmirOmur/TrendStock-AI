const CONFIDENCE_COLOR = {
  HIGH: 'text-green-600 bg-green-50 border-green-200',
  MEDIUM: 'text-amber-600 bg-amber-50 border-amber-200',
  LOW: 'text-red-600 bg-red-50 border-red-200',
};

export default function AiRecommendationPanel({ product, analysis, analyzing, onAnalyze }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col h-full">
      {/* Panel header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🤖</span>
          <h3 className="font-bold text-gray-800 text-sm leading-snug">{product.name}</h3>
        </div>
        <p className="text-xs text-gray-400">
          {product.category} · ${product.price} · Risk Score:{' '}
          <span className="font-semibold text-gray-600">{product.riskMetrics.score}/100</span>
        </p>
      </div>

      {/* Analyze button */}
      <div className="p-5">
        <button
          onClick={onAnalyze}
          disabled={analyzing}
          className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg text-sm font-semibold
                     hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed
                     transition-colors duration-150 flex items-center justify-center gap-2"
        >
          {analyzing ? (
            <>
              <Spinner />
              Analyzing with Gemini...
            </>
          ) : (
            <>
              <span>✨</span>
              Analyze with Gemini
            </>
          )}
        </button>

        {!analysis && !analyzing && (
          <p className="text-xs text-gray-400 text-center mt-2">
            Gemini will explain the risks and recommend actions
          </p>
        )}
      </div>

      {/* Analysis results */}
      {analysis && (
        <div className="px-5 pb-5 overflow-y-auto custom-scrollbar space-y-4 flex-1">
          {/* Summary */}
          <Section title="Summary" icon="📋">
            <p className="text-sm text-gray-600 leading-relaxed">{analysis.summary}</p>
          </Section>

          {/* Risk explanation */}
          <Section title="Risk Explanation" icon="⚠️">
            <p className="text-sm text-gray-600 leading-relaxed">{analysis.riskExplanation}</p>
          </Section>

          {/* Recommended actions */}
          {analysis.recommendedActions?.length > 0 && (
            <Section title="Recommended Actions" icon="🎯">
              <div className="space-y-2">
                {analysis.recommendedActions.map((item, i) => (
                  <div key={i} className="rounded-lg bg-blue-50 border border-blue-100 p-3">
                    <p className="text-sm font-semibold text-blue-800">{item.action}</p>
                    <p className="text-xs text-blue-700 mt-1">{item.reason}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      <span className="font-medium">Impact:</span> {item.expectedImpact}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Warnings */}
          {analysis.financialWarning && (
            <Warning icon="💰" label="Financial Warning" color="red">
              {analysis.financialWarning}
            </Warning>
          )}
          {analysis.supplyChainWarning && (
            <Warning icon="🚢" label="Supply Chain Warning" color="orange">
              {analysis.supplyChainWarning}
            </Warning>
          )}

          {/* Trend opportunity */}
          {analysis.trendOpportunity && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3">
              <p className="text-xs font-semibold text-green-700 mb-1">🌱 Trend Opportunity</p>
              <p className="text-xs text-green-700 leading-relaxed">{analysis.trendOpportunity}</p>
            </div>
          )}

          {/* Confidence badge */}
          <div className="flex items-center justify-end pt-1">
            <span className="text-xs text-gray-400 mr-1">AI Confidence:</span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                CONFIDENCE_COLOR[analysis.confidence] ?? CONFIDENCE_COLOR.MEDIUM
              }`}
            >
              {analysis.confidence}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
        {icon} {title}
      </h4>
      {children}
    </div>
  );
}

function Warning({ icon, label, color, children }) {
  const colorMap = {
    red: 'bg-red-50 border-red-200 text-red-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
  };
  return (
    <div className={`rounded-lg border p-3 ${colorMap[color]}`}>
      <p className="text-xs font-semibold mb-1">{icon} {label}</p>
      <p className="text-xs leading-relaxed">{children}</p>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}
