import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage }  from '../context/LanguageContext.jsx';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1', type: 'Risk',
    title:   { en: 'Stockout in 6 Days — Wireless Earbuds',    tr: '6 Günde Stok Tükeniyor — Wireless Earbuds' },
    message: { en: 'SoundPulse Pro Wireless Earbuds will run out of stock in 6 days. Reorder 450 units immediately.', tr: 'SoundPulse Pro Wireless Earbuds 6 gün içinde stoktan tükenecek. 450 birim sipariş verin.' },
    timestamp: '2026-05-19T08:30:00Z', read: false, relatedPage: '/inventory',
    icon: '🚨', color: 'text-red-400 bg-red-500/10 border-red-500/20',
  },
  {
    id: 'n2', type: 'Opportunity',
    title:   { en: 'Demand Surge +42% — Wireless Earbuds',     tr: 'Talep Artışı +%42 — Wireless Earbuds' },
    message: { en: 'Trend signals show a 42% demand increase expected in the next 14 days. Secure stock before peak.', tr: 'Trend sinyalleri önümüzdeki 14 günde %42 talep artışı gösteriyor. Zirve öncesi stok güvenceye alın.' },
    timestamp: '2026-05-19T08:25:00Z', read: false, relatedPage: '/trend-radar',
    icon: '📈', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  },
  {
    id: 'n3', type: 'Finance',
    title:   { en: '₺85,000 Micro-Credit Offer Available',     tr: '₺85.000 Mikro Kredi Teklifi Mevcut' },
    message: { en: 'A short-term financing offer to restock wireless earbuds is ready. 3-month term · 24% est. ROI.', tr: 'Kablosuz kulaklık yeniden stoklama için kısa vadeli finansman teklifi hazır. 3 aylık vade · %24 tahmini ROI.' },
    timestamp: '2026-05-19T08:22:00Z', read: false, relatedPage: '/fintech-actions',
    icon: '💳', color: 'text-green-400 bg-green-500/10 border-green-500/20',
  },
  {
    id: 'n4', type: 'Risk',
    title:   { en: 'Coffee Bean Prices Rising +22%',            tr: 'Kahve Çekirdeği Fiyatları +%22 Artıyor' },
    message: { en: 'Colombian crop damage confirmed. Lock in supplier forward contracts within 5 days to avoid cost increase.', tr: 'Kolombiya hasat hasarı doğrulandı. Maliyet artışından kaçınmak için 5 gün içinde vadeli sözleşme yapın.' },
    timestamp: '2026-05-19T07:55:00Z', read: false, relatedPage: '/supply-chain',
    icon: '☕', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  {
    id: 'n5', type: 'Pricing',
    title:   { en: '+7% Price Increase Recommended',           tr: '+%7 Fiyat Artışı Önerildi' },
    message: { en: 'Earbuds competitor avg ₺1,349 vs your ₺1,299. AI suggests increase to ₺1,389 for +₺32K revenue.', tr: 'Kulaklık rakip ort. ₺1.349 vs sizin ₺1.299. AI ₺1.389\'a çıkışı öneriyor: +₺32K gelir.' },
    timestamp: '2026-05-19T07:45:00Z', read: true, relatedPage: '/dynamic-pricing',
    icon: '💹', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  {
    id: 'n6', type: 'Supply Chain',
    title:   { en: 'Asian Port Delays — Electronics at Risk',  tr: 'Asya Liman Gecikmeleri — Elektronik Risk Altında' },
    message: { en: 'Shanghai/Shenzhen congestion: 8-14 day shipping delays. 4 electronics products affected.', tr: 'Şanghay/Shenzhen tıkanıklığı: 8-14 günlük sevkiyat gecikmesi. 4 elektronik ürün etkileniyor.' },
    timestamp: '2026-05-18T15:30:00Z', read: true, relatedPage: '/supply-chain',
    icon: '🚢', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  },
];

const TYPE_KEYS = {
  'Risk':         'notifTypeRisk',
  'Opportunity':  'notifTypeOpp',
  'Finance':      'notifTypeFinance',
  'Pricing':      'notifTypePricing',
  'Supply Chain': 'notifTypeSupply',
};

function timeAgo(ts, lang) {
  const diff = Date.now() - new Date(ts).getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor(diff / 60000);
  if (lang === 'tr') {
    if (h >= 24) return `${Math.floor(h / 24)}g önce`;
    if (h >= 1)  return `${h}s önce`;
    return `${m}dk önce`;
  }
  if (h >= 24) return `${Math.floor(h / 24)}d ago`;
  if (h >= 1)  return `${h}h ago`;
  return `${m}m ago`;
}

export default function NotificationCenter() {
  const [open, setOpen]   = useState(false);
  const [notes, setNotes] = useState(INITIAL_NOTIFICATIONS);
  const navigate          = useNavigate();
  const { t, language }   = useLanguage();

  const unread = notes.filter(n => !n.read).length;

  function markRead(id)   { setNotes(ns => ns.map(n => n.id === id ? { ...n, read: true } : n)); }
  function markAllRead()  { setNotes(ns => ns.map(n => ({ ...n, read: true }))); }
  function goTo(note)     { markRead(note.id); navigate(note.relatedPage); setOpen(false); }

  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="relative h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center
                   text-slate-400 hover:text-slate-100 hover:border-slate-600 transition-colors">
        <span className="text-base">🔔</span>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 h-4 min-w-4 px-0.5 rounded-full bg-red-500
                           border-2 border-slate-950 flex items-center justify-center text-white font-bold"
            style={{ fontSize: '9px' }}>
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-50 w-80 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-100">{t('notifications')}</span>
                {unread > 0 && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/20">
                    {unread} {t('newBadge')}
                  </span>
                )}
              </div>
              {unread > 0 && (
                <button onClick={markAllRead} className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                  {t('markAllRead')}
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto divide-y divide-slate-800">
              {notes.map(note => (
                <div key={note.id}
                  className={`px-4 py-3 transition-colors ${note.read ? 'opacity-60' : 'bg-slate-800/20'}`}>
                  <div className="flex items-start gap-2.5">
                    <span className="text-base shrink-0 mt-0.5">{note.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <p className={`text-xs font-semibold leading-tight ${note.read ? 'text-slate-400' : 'text-slate-100'}`}>
                          {note.title[language] ?? note.title.en}
                        </p>
                        {!note.read && <span className="h-2 w-2 rounded-full bg-cyan-400 shrink-0 mt-1" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-2">
                        {note.message[language] ?? note.message.en}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-xs px-1.5 py-0.5 rounded-full border ${note.color}`}>
                          {t(TYPE_KEYS[note.type] ?? 'notifTypeRisk')}
                        </span>
                        <span className="text-xs text-slate-600">{timeAgo(note.timestamp, language)}</span>
                        <button onClick={() => goTo(note)}
                          className="ml-auto text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                          {t('goToPage')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
