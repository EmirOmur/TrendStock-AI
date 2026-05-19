import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage }  from '../context/LanguageContext.jsx';

const STEP_CONFIGS = [
  { num: 1, page: '/trend-radar',     icon: '📡', color: 'from-cyan-500 to-blue-600',     titleKey: 'demoStep1Title', descKey: 'demoStep1Desc', pageKey: 'demoStep1Page' },
  { num: 2, page: '/inventory',       icon: '📦', color: 'from-amber-500 to-orange-600',  titleKey: 'demoStep2Title', descKey: 'demoStep2Desc', pageKey: 'demoStep2Page' },
  { num: 3, page: '/dynamic-pricing', icon: '💹', color: 'from-green-500 to-emerald-600', titleKey: 'demoStep3Title', descKey: 'demoStep3Desc', pageKey: 'demoStep3Page' },
  { num: 4, page: '/fintech-actions', icon: '💳', color: 'from-purple-500 to-pink-600',   titleKey: 'demoStep4Title', descKey: 'demoStep4Desc', pageKey: 'demoStep4Page' },
  { num: 5, page: '/ai-agent-console',icon: '🤖', color: 'from-violet-500 to-purple-700', titleKey: 'demoStep5Title', descKey: 'demoStep5Desc', pageKey: 'demoStep5Page' },
  { num: 6, page: '/reports',         icon: '📊', color: 'from-blue-500 to-cyan-600',     titleKey: 'demoStep6Title', descKey: 'demoStep6Desc', pageKey: 'demoStep6Page' },
];

export default function DemoWalkthrough({ onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { t }    = useLanguage();

  const cfg  = STEP_CONFIGS[currentStep];

  function goToPage() {
    navigate(cfg.page);
    onClose?.();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-gradient-to-r from-purple-950/60 to-cyan-950/40">
          <div>
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-wide">{t('demoWalkthrough')}</p>
            <p className="text-sm font-bold text-slate-100">{t('oneMinuteDemo')}</p>
          </div>
          <button onClick={onClose}
            className="h-7 w-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center
                       text-slate-400 hover:text-slate-100 text-xs transition-colors">
            ✕
          </button>
        </div>

        {/* Step progress */}
        <div className="px-5 py-3 border-b border-slate-800 flex gap-1.5">
          {STEP_CONFIGS.map((_, i) => (
            <button key={i} onClick={() => setCurrentStep(i)}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                i < currentStep ? 'bg-green-500' : i === currentStep ? 'bg-cyan-400' : 'bg-slate-700'
              }`} />
          ))}
        </div>

        {/* Current step */}
        <div className="p-5 space-y-4">
          <div className="flex items-start gap-4">
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${cfg.color} flex items-center justify-center shrink-0`}>
              <span className="text-2xl">{cfg.icon}</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">
                {t('stepLabel')} {cfg.num} {t('ofLabel')} {STEP_CONFIGS.length}
              </p>
              <p className="text-base font-bold text-slate-100">{t(cfg.titleKey)}</p>
              <p className="text-sm text-slate-300 mt-1 leading-relaxed">{t(cfg.descKey)}</p>
            </div>
          </div>

          {/* All steps mini-list */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 space-y-2">
            {STEP_CONFIGS.map((s, i) => (
              <button key={i} onClick={() => setCurrentStep(i)}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-all
                  ${i === currentStep ? 'bg-slate-800 border border-slate-700' : 'hover:bg-slate-800/50'}`}>
                <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold
                  ${i < currentStep ? 'bg-green-500/20 text-green-400' : i === currentStep ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-700 text-slate-500'}`}>
                  {i < currentStep ? '✓' : s.num}
                </div>
                <span className={`text-xs font-medium ${i === currentStep ? 'text-slate-100' : i < currentStep ? 'text-slate-400 line-through' : 'text-slate-500'}`}>
                  {t(s.titleKey)}
                </span>
                <span className="ml-auto text-xs text-slate-600">{t(s.pageKey)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 border-t border-slate-800 flex items-center gap-2">
          <button onClick={() => setCurrentStep(s => Math.max(0, s - 1))} disabled={currentStep === 0}
            className="px-3 py-2 rounded-lg border border-slate-700 text-xs text-slate-400
                       hover:text-slate-200 hover:border-slate-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            {t('backBtn')}
          </button>
          <button onClick={goToPage}
            className="flex-1 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600
                       text-white text-xs font-semibold hover:from-cyan-500 hover:to-purple-500 transition-all">
            {t('goTo')} {t(cfg.pageKey)} →
          </button>
          {currentStep < STEP_CONFIGS.length - 1 ? (
            <button onClick={() => setCurrentStep(s => s + 1)}
              className="px-3 py-2 rounded-lg border border-slate-700 text-xs text-slate-400
                         hover:text-slate-200 hover:border-slate-600 transition-colors">
              {t('nextBtn')}
            </button>
          ) : (
            <button onClick={onClose}
              className="px-3 py-2 rounded-lg border border-green-500/30 bg-green-500/10 text-xs text-green-400
                         hover:bg-green-500/20 transition-colors">
              {t('doneBtn')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
