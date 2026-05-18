// Reusable card wrapper with optional title, description, and right-slot.
//
// Props:
//   title        — section heading
//   description  — optional subtitle
//   right        — optional right-side element (badge, button, etc.)
//   padding      — if false, no inner padding (useful for flush content)
//   className    — extra classes for the outer div
//   children

export default function SectionCard({
  title,
  description,
  right,
  padding = true,
  className = '',
  children,
}) {
  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-900 ${className}`}>
      {(title || right) && (
        <div className="flex items-start justify-between px-4 pt-4 pb-3 border-b border-slate-800">
          <div>
            {title && (
              <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
            )}
            {description && (
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            )}
          </div>
          {right && <div className="shrink-0 ml-3">{right}</div>}
        </div>
      )}
      <div className={padding ? 'p-4' : ''}>{children}</div>
    </div>
  );
}
