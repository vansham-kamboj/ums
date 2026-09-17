import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

export default function SearchInput({ 
  placeholder = 'Search...', 
  onSearch, 
  onSelect, 
  renderResult,
  debounceMs = 300,
  minChars = 2,
  className = ''
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const timerRef = useRef(null);
  const containerRef = useRef(null);

  const doSearch = useCallback(async (q) => {
    if (!onSearch || q.length < minChars) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    try {
      const data = await onSearch(q);
      setResults(data || []);
      setShowDropdown(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [onSearch, minChars]);

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (query.length >= minChars) {
      timerRef.current = setTimeout(() => doSearch(query), debounceMs);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [query, debounceMs, minChars, doSearch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    if (onSelect) onSelect(item);
    setShowDropdown(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-disabled" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full pl-9 pr-8 py-2.5 bg-bg border border-border rounded-md text-sm placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500 transition-all"
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-disabled animate-spin" />}
        {!loading && query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setShowDropdown(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-disabled hover:text-text-secondary"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {showDropdown && results.length > 0 && (
        <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-surface border border-border rounded-md shadow-md max-h-64 overflow-y-auto animate-fade-in">
          {results.map((item, i) => (
            <button
              key={item.id || i}
              onClick={() => handleSelect(item)}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-brand-100/40 transition-colors border-b border-border last:border-b-0"
            >
              {renderResult ? renderResult(item) : (
                <span className="text-text-primary">{item.name || item.title || item.id}</span>
              )}
            </button>
          ))}
        </div>
      )}
      {showDropdown && results.length === 0 && !loading && query.length >= minChars && (
        <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-surface border border-border rounded-md shadow-md p-4 text-sm text-text-secondary text-center animate-fade-in">
          No results found
        </div>
      )}
    </div>
  );
}
