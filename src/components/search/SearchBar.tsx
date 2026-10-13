import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Sparkles } from 'lucide-react';

interface SearchBarProps {
  initialQuery?: string;
  onSearch?: (query: string) => void;
  placeholder?: string;
  size?: 'normal' | 'hero';
}

const POPULAR_SEARCH_SUGGESTIONS = [
  'Where is the SAC Room?',
  'Where is the library?',
  'What are the mess timings?',
  'Where is the medical room?',
  'Which block has CSE?',
  'Where is the outdoor OAT?',
  'Where is the Student Hub?',
  'Find the Examination Cell',
];

export const SearchBar: React.FC<SearchBarProps> = ({
  initialQuery = '',
  onSearch,
  placeholder = 'Search buildings, branches (CSE, AIDS, CSM), labs, library, offices, mess...',
  size = 'normal',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    if (onSearch) {
      onSearch(trimmed);
    } else {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    if (onSearch) {
      onSearch(suggestion);
    } else {
      navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    }
  };

  const isHero = size === 'hero';

  return (
    <div className="w-full">
      <form onSubmit={handleSearchSubmit} className="relative group">
        <div
          className={`flex items-center w-full rounded-2xl bg-white shadow-xl transition-all border ${
            isHero
              ? 'p-2 sm:p-2.5 border-black/15 focus-within:border-[#E67E6A] focus-within:ring-4 focus-within:ring-[#E67E6A]/20'
              : 'p-1.5 border-neutral-300 focus-within:border-[#E67E6A] focus-within:ring-2 focus-within:ring-[#E67E6A]/20'
          }`}
        >
          <div className="pl-3 pr-2 text-black">
            <Search className={isHero ? 'w-6 h-6 text-[#E67E6A]' : 'w-4 h-4 text-black'} />
          </div>

          <input
            type="text"
            id="campus-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            aria-label="Search campus directory"
            className={`w-full bg-transparent text-black placeholder:text-neutral-500 focus:outline-none font-semibold ${
              isHero ? 'text-base sm:text-lg py-1' : 'text-sm py-1'
            }`}
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                if (onSearch) onSearch('');
              }}
              className="p-1.5 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 mr-1"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            id="campus-search-submit-button"
            className={`font-bold text-white bg-[#E67E6A] hover:bg-[#d66c58] active:bg-[#c95c47] rounded-xl transition-all shadow-md shrink-0 ${
              isHero ? 'px-6 py-3 text-sm sm:text-base' : 'px-4 py-2 text-xs sm:text-sm'
            }`}
          >
            Search
          </button>
        </div>
      </form>

      {/* Suggested quick pills for hero */}
      {isHero && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-white/80 font-bold mr-1">
            <Sparkles className="w-3.5 h-3.5 text-[#E67E6A]" />
            <span>Popular Queries:</span>
          </div>
          {POPULAR_SEARCH_SUGGESTIONS.slice(0, 5).map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              type="button"
              className="text-xs bg-black/70 hover:bg-[#E67E6A] text-white hover:text-white px-3 py-1 rounded-full border border-neutral-700 hover:border-[#E67E6A] transition-all font-medium"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
