'use client';

import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

export default function DemoBadge() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      aria-label="Demo Website Indicator"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full border border-amber-400/40 bg-brand-navy/90 px-3.5 py-1.5 text-xs font-medium text-amber-200 shadow-xl backdrop-blur-md transition-all hover:bg-brand-navy"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
      </span>
      <Sparkles className="h-3.5 w-3.5 text-amber-300" />
      <span className="tracking-wide">DEMO WEBSITE</span>
      <span className="text-[10px] text-gray-400 border-l border-gray-600 pl-1.5 hidden sm:inline">
        The Tour Vision (Pune)
      </span>
      <button
        onClick={() => setIsVisible(false)}
        className="ml-1 text-gray-400 hover:text-white transition-colors"
        title="Minimize badge"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
