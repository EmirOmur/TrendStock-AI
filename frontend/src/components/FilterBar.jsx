// Reusable filter + search bar component.
//
// Props:
//   searchValue     — controlled search string
//   onSearchChange  — callback(value)
//   searchPlaceholder — placeholder text
//   filters         — array of { key, label, options: [{ value, label }] }
//   activeFilters   — object { [key]: value }
//   onFilterChange  — callback(key, value)
//   sortOptions     — optional array of { value, label }
//   activeSort      — current sort value
//   onSortChange    — callback(value)

export default function FilterBar({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search…',
  filters = [],
  activeFilters = {},
  onFilterChange,
  sortOptions = [],
  activeSort = '',
  onSortChange,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search input */}
      {onSearchChange && (
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">🔍</span>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-7 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700
                       text-xs text-slate-200 placeholder-slate-600
                       focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20
                       w-44 transition-colors"
          />
        </div>
      )}

      {/* Filter dropdowns */}
      {filters.map(({ key, label, options }) => (
        <select
          key={key}
          value={activeFilters[key] ?? ''}
          onChange={(e) => onFilterChange?.(key, e.target.value)}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700
                     text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50
                     cursor-pointer transition-colors"
        >
          <option value="">{label}: All</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ))}

      {/* Sort dropdown */}
      {sortOptions.length > 0 && onSortChange && (
        <select
          value={activeSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700
                     text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50
                     cursor-pointer transition-colors ml-auto"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}
    </div>
  );
}
