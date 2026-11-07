'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Search, X, Compass, MapPin, Sparkles, 
  ArrowRight, Loader2, ArrowUpRight, MessageCircle 
} from 'lucide-react';
import { searchDestinationsAndPackages, SearchResultDestination, SearchResponse } from '@/lib/services/destinations';
import WhatsAppButton from '@/components/shared/WhatsAppButton';

interface DestinationSearchBarProps {
  onSearchSubmit?: (query: string, searchResult: SearchResponse | null) => void;
  onClearSearch?: () => void;
  initialQuery?: string;
  autoScrollTargetId?: string;
}

export default function DestinationSearchBar({
  onSearchSubmit,
  onClearSearch,
  initialQuery = '',
  autoScrollTargetId = 'tours-discovery',
}: DestinationSearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchResultDestination[]>([]);
  const [searchResult, setSearchResult] = useState<SearchResponse | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [hasSearchedOnce, setHasSearchedOnce] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounced search query
  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setSuggestions([]);
      setSearchResult(null);
      setIsOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setHighlightedIndex(-1);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        const result = await searchDestinationsAndPackages(trimmed, 8, controller.signal);
        setSuggestions(result.destinations);
        setSearchResult(result);
        setHasSearchedOnce(true);
        setIsOpen(true);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Search error:', err);
        }
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Navigate to destination details page
  const handleSelectDestination = (destination: SearchResultDestination) => {
    setIsOpen(false);
    setQuery(destination.name);
    // Smooth navigation to destination page
    router.push(`/destinations/${destination.slug}`);
  };

  // Submit search query and filter Tours Discovery on the homepage
  const handlePerformSearch = useCallback(
    (customQuery?: string) => {
      const q = (customQuery !== undefined ? customQuery : query).trim();
      setIsOpen(false);

      if (onSearchSubmit) {
        onSearchSubmit(q, searchResult);
      }

      // Smoothly scroll to the Tours Discovery section
      if (autoScrollTargetId) {
        const el = document.getElementById(autoScrollTargetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    },
    [query, searchResult, onSearchSubmit, autoScrollTargetId]
  );

  // Clear query and reset search
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setSearchResult(null);
    setIsOpen(false);
    setHighlightedIndex(-1);
    if (onClearSearch) {
      onClearSearch();
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      if (suggestions.length > 0) {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        handleSelectDestination(suggestions[highlightedIndex]);
      } else {
        handlePerformSearch();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div className="w-full relative py-12 px-4 sm:px-8 bg-gradient-to-b from-[#faf7f2] via-[#fcfaf7] to-[#ffffff] border-b border-amber-900/10">
      <div className="max-w-4xl mx-auto text-center" ref={containerRef}>
        {/* Section Heading & Subtitle */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/80 border border-amber-300/60 px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-900 shadow-sm">
            <Compass className="h-3.5 w-3.5 text-amber-600 animate-spin-slow" />
            <span>FIND YOUR NEXT DESTINATION</span>
          </div>
          <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-brand-navy mt-2.5 tracking-tight">
            Search destinations and discover your next unforgettable journey.
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 font-light max-w-xl mx-auto">
            Explore regal palaces, alpine summits, serene backwaters, and exotic island sanctuaries curated by our Pune travel specialists.
          </p>
        </div>

        {/* Large Prominent Search Bar */}
        <div className="relative group">
          <div className="relative flex items-center w-full rounded-2xl bg-white shadow-xl shadow-amber-950/5 border border-amber-200/70 p-2 sm:p-2.5 transition-all duration-300 focus-within:ring-4 focus-within:ring-amber-500/20 focus-within:border-amber-400 hover:border-amber-300">
            {/* Left Search Icon */}
            <div className="pl-3 pr-2 text-amber-600 shrink-0">
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
              ) : (
                <Search className="h-5 w-5 text-amber-600" />
              )}
            </div>

            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0 || (query.trim() && hasSearchedOnce)) {
                  setIsOpen(true);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="Where would you like to travel?"
              className="w-full bg-transparent text-sm sm:text-base font-medium text-gray-900 placeholder-gray-400 focus:outline-none px-2 py-2"
              autoComplete="off"
              aria-label="Destination search"
            />

            {/* Clear Button */}
            {query.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors mr-2 shrink-0"
                aria-label="Clear search input"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Search Submit Button */}
            <button
              type="button"
              onClick={() => handlePerformSearch()}
              className="rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm px-5 sm:px-7 py-3 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg shrink-0 border border-brand-navy hover:border-amber-400/30"
            >
              <span>Search</span>
              <ArrowRight className="h-4 w-4 text-amber-400" />
            </button>
          </div>

          {/* Quick Suggestion Pills */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500">
            <span className="font-semibold text-amber-900/70">Popular:</span>
            {['Kashmir', 'Dubai', 'Bali', 'Switzerland', 'Kerala', 'Rajasthan'].map((dest) => (
              <button
                key={dest}
                type="button"
                onClick={() => {
                  setQuery(dest);
                  handlePerformSearch(dest);
                }}
                className="rounded-full bg-white/80 hover:bg-amber-100/80 border border-amber-200/60 px-3 py-1 text-[11px] font-medium text-gray-700 hover:text-amber-900 transition-all shadow-2xs"
              >
                {dest}
              </button>
            ))}
          </div>

          {/* Live Search Suggestions Dropdown */}
          {isOpen && query.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2.5 z-50 rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden text-left animate-in fade-in-50 slide-in-from-top-2 duration-200">
              {/* Results List */}
              {suggestions.length > 0 ? (
                <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                  <div className="px-4 py-2.5 bg-amber-50/60 flex items-center justify-between text-[11px] font-semibold text-amber-900 uppercase tracking-wider border-b border-amber-100">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                      Matching Destinations ({suggestions.length})
                    </span>
                    <span className="text-[10px] text-gray-500 lowercase">Use ↑↓ keys to navigate, Enter to select</span>
                  </div>

                  {suggestions.map((dest, idx) => {
                    const isHighlighted = idx === highlightedIndex;
                    return (
                      <div
                        key={dest.id}
                        onClick={() => handleSelectDestination(dest)}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        className={`group px-4 py-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                          isHighlighted ? 'bg-amber-50/90 text-brand-navy' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Destination Image Thumbnail */}
                          <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200/80 shadow-xs">
                            <Image
                              src={dest.hero_image}
                              alt={dest.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          {/* Destination Info */}
                          <div className="min-w-0 text-left">
                            <div className="flex items-center gap-2">
                              <h4 className="font-serif text-sm font-bold text-brand-navy group-hover:text-primary-700 truncate">
                                {dest.name}
                              </h4>
                              <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                                {dest.is_domestic ? 'Domestic' : 'International'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                              <MapPin className="h-3 w-3 text-amber-600 shrink-0" />
                              <span>{dest.region ? `${dest.region}, ` : ''}{dest.country}</span>
                            </p>
                          </div>
                        </div>

                        {/* Package Count / Bespoke Badge & Action Icon */}
                        <div className="flex items-center gap-3 shrink-0 pl-3">
                          {dest.package_count > 0 ? (
                            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full">
                              <span>{dest.package_count} {dest.package_count === 1 ? 'Tour Package' : 'Tour Packages'}</span>
                            </span>
                          ) : (
                            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                              <Sparkles className="h-3 w-3 text-amber-600" />
                              <span>Bespoke Concierge</span>
                            </span>
                          )}

                          <div className={`p-1.5 rounded-lg transition-colors ${
                            isHighlighted ? 'bg-amber-200 text-amber-900' : 'bg-gray-100 text-gray-400 group-hover:text-brand-navy group-hover:bg-gray-200'
                          }`}>
                            <ArrowUpRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* "View All Results" Bottom Action */}
                  <div className="p-3 bg-gray-50 flex items-center justify-between border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => handlePerformSearch()}
                      className="text-xs font-bold text-primary-700 hover:text-primary-800 flex items-center gap-1.5 hover:underline"
                    >
                      <span>Explore all matching packages in Tours Discovery</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-[11px] text-gray-400 font-medium">
                      Press <kbd className="font-mono bg-white border border-gray-200 px-1 py-0.5 rounded text-[10px]">Enter</kbd> to filter page
                    </span>
                  </div>
                </div>
              ) : (
                /* Empty State */
                <div className="p-8 text-center bg-white">
                  <div className="h-12 w-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
                    <Compass className="h-6 w-6" />
                  </div>
                  <h4 className="font-serif text-base font-bold text-brand-navy">
                    No destinations found matching &quot;{query}&quot;
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
                    Looking for a private getaway to another corner of the globe? Our Pune bespoke travel concierge curates custom private tours worldwide.
                  </p>

                  <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => handlePerformSearch()}
                      className="text-xs font-semibold text-brand-navy bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition-colors"
                    >
                      Show all destinations
                    </button>
                    <WhatsAppButton
                      variant="inline"
                      prefilledText={`Hello The Tour Vision Pune, I am looking for a customized travel plan for "${query}". Can you please assist me with private pricing and options?`}
                      label="Inquire via WhatsApp"
                      className="py-2 px-3 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
