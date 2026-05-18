import { useState } from 'react';
import SectionCard from '../components/SectionCard.jsx';

const INTEGRATIONS = [
  { id: 'gemini',    icon: '🤖', name: 'Google Gemini',       description: 'AI product analysis via gemini-2.0-flash', status: 'connected',    statusColor: 'text-green-400' },
  { id: 'backend',   icon: '⚡', name: 'Express Backend',      description: 'REST API running on localhost:5000',       status: 'connected',    statusColor: 'text-green-400' },
  { id: 'trends',    icon: '📡', name: 'Google Trends API',    description: 'Real-time keyword trend signals',          status: 'mock data',    statusColor: 'text-amber-400' },
  { id: 'news',      icon: '📰', name: 'Google News API',      description: 'Market intelligence & supply chain alerts', status: 'mock data',   statusColor: 'text-amber-400' },
  { id: 'shopify',   icon: '🛍️', name: 'Shopify',              description: 'E-commerce platform integration',          status: 'not connected', statusColor: 'text-slate-600' },
  { id: 'bigquery',  icon: '🗄️', name: 'Google BigQuery',      description: 'Historical sales data warehouse',          status: 'not connected', statusColor: 'text-slate-600' },
];

const defaultToggles = {
  darkMode:          true,
  autoRefresh:       false,
  geminiAnalysis:    true,
  fallbackMode:      true,
  emailAlerts:       false,
  stockoutAlerts:    true,
  trendAlerts:       true,
  priceAlerts:       false,
};

export default function SettingsPage() {
  const [toggles, setToggles] = useState(defaultToggles);
  const [saved, setSaved]     = useState(false);

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5 max-w-4xl">

      {/* ── AI Configuration ──────────────────────────────────────── */}
      <SectionCard title="AI Configuration" description="Gemini model settings and fallback behaviour">
        <div className="space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {[
              { label: 'Model',         value: 'gemini-2.0-flash' },
              { label: 'Max Tokens',    value: '2048' },
              { label: 'Temperature',   value: '0.3' },
              { label: 'Response Mode', value: 'Structured JSON' },
              { label: 'Fallback',      value: 'Deterministic Rules' },
              { label: 'Quota Handling', value: 'Auto Fallback' },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg bg-slate-800/60 p-2.5">
                <p className="text-slate-600 mb-0.5">{label}</p>
                <p className="font-semibold text-slate-200">{value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-1">
            <Toggle
              label="Enable Gemini Analysis"
              description="Run AI analysis on product risk scores"
              checked={toggles.geminiAnalysis}
              onChange={() => handleToggle('geminiAnalysis')}
            />
            <Toggle
              label="Fallback Mode"
              description="Show deterministic recommendations when Gemini quota is exceeded"
              checked={toggles.fallbackMode}
              onChange={() => handleToggle('fallbackMode')}
            />
          </div>
        </div>
      </SectionCard>

      {/* ── Alert Preferences ─────────────────────────────────────── */}
      <SectionCard title="Alert Preferences" description="Configure which events trigger notifications">
        <div className="space-y-3">
          <Toggle
            label="Stockout Alerts"
            description="Notify when stock drops below supplier lead time"
            checked={toggles.stockoutAlerts}
            onChange={() => handleToggle('stockoutAlerts')}
          />
          <Toggle
            label="Trend Opportunity Alerts"
            description="Notify when search trend diverges from sales trajectory"
            checked={toggles.trendAlerts}
            onChange={() => handleToggle('trendAlerts')}
          />
          <Toggle
            label="Price Pressure Alerts"
            description="Notify when competitor price changes exceed 5%"
            checked={toggles.priceAlerts}
            onChange={() => handleToggle('priceAlerts')}
          />
          <Toggle
            label="Email Notifications"
            description="Send daily risk digest to your registered email"
            checked={toggles.emailAlerts}
            onChange={() => handleToggle('emailAlerts')}
          />
        </div>
      </SectionCard>

      {/* ── Dashboard Preferences ─────────────────────────────────── */}
      <SectionCard title="Dashboard Preferences" description="Display and refresh settings">
        <div className="space-y-3">
          <Toggle
            label="Dark Mode"
            description="Use dark theme across the entire dashboard"
            checked={toggles.darkMode}
            onChange={() => handleToggle('darkMode')}
          />
          <Toggle
            label="Auto Refresh"
            description="Automatically refresh data every 5 minutes"
            checked={toggles.autoRefresh}
            onChange={() => handleToggle('autoRefresh')}
          />
        </div>
      </SectionCard>

      {/* ── Integration Status ────────────────────────────────────── */}
      <SectionCard title="Integration Status" description="Connected services and data sources">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {INTEGRATIONS.map((int) => (
            <div
              key={int.id}
              className="flex items-start gap-3 rounded-lg border border-slate-700/50 bg-slate-800/40 p-3"
            >
              <span className="text-xl leading-none mt-0.5">{int.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-200">{int.name}</p>
                <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{int.description}</p>
              </div>
              <span className={`shrink-0 text-xs font-medium ${int.statusColor}`}>
                {int.status}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Risk Score Thresholds ─────────────────────────────────── */}
      <SectionCard title="Risk Score Thresholds" description="How risk levels are calculated from score components">
        <div className="space-y-2 text-xs">
          {[
            { range: '70 – 100', level: 'HIGH',   color: 'text-red-400',   factors: 'STOCKOUT_RISK (+30), SALES_DROP (+25), TREND_DIVERGENCE (+20), PRICE_PRESSURE (+15), LOW_MARGIN (+10)' },
            { range: '40 – 69',  level: 'MEDIUM', color: 'text-amber-400', factors: 'Typically 2–3 risk factors active simultaneously' },
            { range: '0 – 39',   level: 'LOW',    color: 'text-green-400', factors: 'Healthy — 0–1 minor risk factors, strong margins, adequate stock' },
          ].map(({ range, level, color, factors }) => (
            <div key={level} className="rounded-lg border border-slate-700/50 bg-slate-800/40 p-3">
              <div className="flex items-center gap-3 mb-1">
                <span className={`font-bold ${color}`}>{level}</span>
                <span className="text-slate-600">Score {range}</span>
              </div>
              <p className="text-slate-500 leading-relaxed">{factors}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── About ─────────────────────────────────────────────────── */}
      <SectionCard title="About TrendStock AI">
        <div className="text-xs text-slate-500 space-y-1">
          <p>Version 1.0.0 · Hackathon MVP</p>
          <p>Built with React 18 · Vite · Tailwind CSS · Recharts · Google Gemini</p>
          <p>Backend: Node.js · Express · ES Modules</p>
          <p className="text-slate-700 pt-1">All product data is mock/demo only — not connected to real inventory systems.</p>
        </div>
      </SectionCard>

      {/* ── Save button ───────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="px-5 py-2 rounded-lg bg-cyan-600 text-white text-sm font-semibold
                     hover:bg-cyan-500 active:bg-cyan-700 transition-colors"
        >
          Save Preferences
        </button>
        {saved && (
          <span className="text-xs text-green-400 font-medium">✓ Saved successfully</span>
        )}
      </div>
    </div>
  );
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-semibold text-slate-200">{label}</p>
        {description && <p className="text-xs text-slate-600 mt-0.5">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative shrink-0 h-5 w-9 rounded-full border transition-colors duration-200 ${
          checked
            ? 'bg-cyan-600 border-cyan-500'
            : 'bg-slate-700 border-slate-600'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-3.5 w-3.5 rounded-full bg-white shadow
                      transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
}
