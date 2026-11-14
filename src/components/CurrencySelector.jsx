import { useEffect, useMemo, useRef, useState } from 'react';
import { Globe, ChevronDown, Search, Check, X } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const QUICK_CODES = ['KES', 'USD', 'EUR', 'GBP', 'NGN', 'ZAR'];

export default function CurrencySelector({ compact = false }) {
  const { currency, setCurrency, worldCurrencies } = useCurrency();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);

  const activeCurrencyObj = useMemo(
    () =>
      worldCurrencies.all.find((c) => c.code === currency) || {
        code: currency,
        name: currency,
        symbol: currency,
      },
    [currency, worldCurrencies]
  );

  const filteredCurrencies = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return worldCurrencies.all;
    return worldCurrencies.all.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q)
    );
  }, [query, worldCurrencies]);

  const quickPicks = useMemo(
    () =>
      QUICK_CODES.map((code) =>
        worldCurrencies.all.find((c) => c.code === code)
      ).filter(Boolean),
    [worldCurrencies]
  );

  useEffect(() => {
    setHighlightedIndex(0);
  }, [query, open]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 30);
      return () => clearTimeout(timer);
    } else {
      setQuery('');
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectCurrency = (code) => {
    setCurrency(code);
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        Math.min(prev + 1, filteredCurrencies.length - 1)
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredCurrencies[highlightedIndex]) {
      e.preventDefault();
      selectCurrency(filteredCurrencies[highlightedIndex].code);
    }
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className="relative inline-block text-left z-30"
    >
      {/* Trigger Pill */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select currency"
        className={`group flex items-center gap-2.5 bg-white hover:bg-blush-50/70 transition-all rounded-full shadow-soft border ${
          open ? 'border-rose-400 ring-2 ring-rose-100' : 'border-blush-100'
        } ${compact ? 'px-3.5 py-1.5 text-xs' : 'px-4 py-2 text-sm'}`}
      >
        <span className="w-6 h-6 rounded-full bg-blush-50 text-rose-600 grid place-items-center shrink-0 group-hover:bg-rose-100/70 transition">
          <Globe size={13} />
        </span>

        {!compact && (
          <span className="text-mulberry/60 font-medium hidden sm:inline">
            Currency
          </span>
        )}

        <span className="font-bold tracking-wide text-mulberry">
          {activeCurrencyObj.code}
        </span>

        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold">
          {activeCurrencyObj.symbol}
        </span>

        <ChevronDown
          size={15}
          className={`text-mulberry/50 transition-transform duration-200 ${
            open ? 'rotate-180 text-rose-600' : ''
          }`}
        />
      </button>

      {/* Dropdown Popover */}
      {open && (
        <div
          role="listbox"
          className="absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mt-2.5 w-[310px] sm:w-[350px] rounded-3xl bg-white/95 backdrop-blur-md shadow-card border border-blush-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Search Header */}
          <div className="p-3.5 border-b border-blush-100 bg-blush-50/40">
            <div className="relative flex items-center">
              <Search
                size={15}
                className="absolute left-3.5 text-mulberry/40 pointer-events-none"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search code, name, or symbol…"
                className="w-full pl-9 pr-8 py-2 rounded-2xl bg-white border border-blush-200 text-sm text-mulberry placeholder:text-mulberry/40 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 p-1 rounded-full text-mulberry/40 hover:text-rose-600 hover:bg-blush-100 transition"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Popular Quick Picks (shown when not searching) */}
            {!query.trim() && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {quickPicks.map((item) => {
                  const isSelected = item.code === currency;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => selectCurrency(item.code)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                        isSelected
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-white text-mulberry/75 border border-blush-200 hover:border-rose-300 hover:text-rose-600'
                      }`}
                    >
                      {item.code}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Scrollable Currency List */}
          <div
            ref={listRef}
            className="max-h-72 overflow-y-auto p-2 space-y-0.5 overscroll-contain"
          >
            {filteredCurrencies.length === 0 ? (
              <div className="py-8 px-4 text-center text-sm text-mulberry/50">
                No currencies match “{query}”
              </div>
            ) : (
              filteredCurrencies.map((item, idx) => {
                const isSelected = item.code === currency;
                const isHighlighted = idx === highlightedIndex;

                return (
                  <button
                    key={item.code}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onClick={() => selectCurrency(item.code)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-2xl text-left transition ${
                      isSelected
                        ? 'bg-rose-50/90 text-rose-700'
                        : isHighlighted
                        ? 'bg-blush-50 text-mulberry'
                        : 'text-mulberry hover:bg-blush-50/70'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`px-2 min-w-[2.6rem] h-8 rounded-xl grid place-items-center text-xs font-bold shrink-0 transition ${
                          isSelected
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-blush-100/70 text-rose-600'
                        }`}
                      >
                        {item.symbol}
                      </span>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm tracking-wide">
                            {item.code}
                          </span>
                        </div>
                        <p className="text-xs text-mulberry/55 truncate">
                          {item.name}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <Check size={16} className="text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}