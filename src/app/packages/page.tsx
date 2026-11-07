'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Compass, MapPin, Calendar, Users, ArrowRight, 
  Sparkles, CheckCircle, Search, Filter 
} from 'lucide-react';
import { DEMO_PACKAGES } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import WhatsAppButton from '@/components/shared/WhatsAppButton';

export default function PackagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredPackages = DEMO_PACKAGES.filter((pkg) => {
    const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pkg.destination_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || 
                            pkg.category_name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').includes(categoryFilter);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-[#fcfaf7] min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 border border-amber-300/60 px-3.5 py-1 text-xs font-semibold text-amber-900 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>BESPOKE VACATION PACKAGES</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-navy">
            Curated Travel Experiences
          </h1>
          <p className="mt-4 text-base text-gray-600 leading-relaxed font-light">
            Every journey includes verified 4-star superior or 5-star palace accommodations, dedicated private chauffeur transfers, and 24x7 local concierge care from Pune.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-10 rounded-2xl bg-white p-4 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by package or destination (e.g. Kashmir, Swiss...)"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-xs font-medium text-gray-800 placeholder-gray-400 focus:border-amber-500 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Category Quick Pills */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
            {[
              { id: 'all', label: 'All Packages' },
              { id: 'luxury', label: 'Luxury Escapes' },
              { id: 'honeymoon', label: 'Honeymoon' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                  categoryFilter === cat.id
                    ? 'bg-brand-navy text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Packages Grid */}
        {filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="group flex flex-col rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 overflow-hidden"
              >
                <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={pkg.cover_image}
                    alt={pkg.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 rounded-full bg-brand-navy/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-amber-300 shadow">
                    {pkg.days} Days / {pkg.nights} Nights
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider block">
                      {pkg.destination_name} • {pkg.category_name}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-brand-navy group-hover:text-primary-700 transition-colors">
                      {pkg.title}
                    </h3>
                    <p className="mt-2 text-xs text-gray-600 leading-relaxed line-clamp-3">
                      {pkg.summary}
                    </p>

                    <div className="mt-4 text-[11px] text-gray-500 space-y-1">
                      <p>
                        <strong>Departure:</strong> {pkg.departure_city}
                      </p>
                      <p>
                        <strong>Stay:</strong> {pkg.accommodation_grade}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-gray-100">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] uppercase text-gray-400 block font-semibold">
                          Pricing Starts At
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-extrabold text-brand-navy">
                            {formatCurrency(pkg.discounted_price_inr || pkg.price_inr)}
                          </span>
                          {pkg.discounted_price_inr && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatCurrency(pkg.price_inr)}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] text-gray-500">per person (INR)</span>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <Link
                        href={`/packages/${pkg.slug}`}
                        className="flex-1 text-center rounded-xl bg-brand-navy py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-sm"
                      >
                        Explore Itinerary
                      </Link>
                      <WhatsAppButton
                        variant="inline"
                        prefilledText={`Hello The Tour Vision Pune, I would like to inquire about booking the "${pkg.title}" package.`}
                        label="Inquire"
                        className="py-2.5 px-3 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center max-w-lg mx-auto">
            <Compass className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">No matching packages found</h3>
            <p className="text-xs text-gray-500 mt-1">
              Try adjusting your search terms or launch the Smart Trip Planner to build a customized itinerary.
            </p>
            <Link
              href="/trip-planner"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-navy px-4 py-2 text-xs font-semibold text-white"
            >
              <span>Build Custom Package</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
