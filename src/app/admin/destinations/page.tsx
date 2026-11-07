'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MapPin, Plus, ExternalLink, Globe } from 'lucide-react';
import { DEMO_DESTINATIONS } from '@/lib/constants';

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<any[]>(DEMO_DESTINATIONS);
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('');
  const [country, setCountry] = useState('India');
  const [region, setRegion] = useState('North India');
  const [isDomestic, setIsDomestic] = useState(true);
  const [overview, setOverview] = useState('');
  const [bestSeason, setBestSeason] = useState('October to March');
  const [heroImage, setHeroImage] = useState(
    'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80'
  );

  const handleAddDestination = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newDest = {
      id: `d-${Date.now()}`,
      name,
      slug,
      country,
      region,
      is_domestic: isDomestic,
      tagline: `Curated luxury journey in ${name}`,
      overview,
      best_season: bestSeason,
      hero_image: heroImage,
      highlights: ['Hand-verified 5-star stays', 'Private chauffeured sightseeing'],
      is_featured: true,
      is_published: true,
    };

    setDestinations([newDest, ...destinations]);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-navy">
            Destination Catalog Management
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure country portfolios, seasonal guides, and regional highlights.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-xs font-bold text-white hover:bg-primary-700 shadow-sm self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Destination</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((dest) => (
          <div
            key={dest.id}
            className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div className="relative h-48 w-full bg-gray-100">
              <Image
                src={dest.hero_image}
                alt={dest.name}
                fill
                className="object-cover"
              />
              <span className="absolute top-3 left-3 rounded-full bg-brand-navy/90 px-2.5 py-1 text-[11px] font-bold text-amber-300">
                {dest.is_domestic ? 'Domestic' : 'International'}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                  {dest.country} • {dest.region}
                </span>
                <h3 className="font-serif text-lg font-bold text-brand-navy mt-1">
                  {dest.name}
                </h3>
                <p className="text-xs text-gray-500 mt-2 line-clamp-3">
                  {dest.overview}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-500">
                  Best: <strong>{dest.best_season}</strong>
                </span>
                <a
                  href={`/destinations/${dest.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 hover:underline"
                >
                  <span>View</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="font-serif text-xl font-bold text-brand-navy mb-4">
              Add New Destination
            </h3>

            <form onSubmit={handleAddDestination} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Destination Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Andaman Islands"
                  className="w-full rounded-xl border border-gray-200 p-2.5 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-2.5 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Region *</label>
                  <input
                    type="text"
                    required
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-2.5 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Overview Description *</label>
                <textarea
                  rows={3}
                  required
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  placeholder="Overview of landscapes and attractions..."
                  className="w-full rounded-xl border border-gray-200 p-2.5 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Best Season</label>
                  <input
                    type="text"
                    value={bestSeason}
                    onChange={(e) => setBestSeason(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-2.5"
                  />
                </div>
                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isDomestic}
                      onChange={(e) => setIsDomestic(e.target.checked)}
                      className="rounded text-primary-600 focus:ring-amber-500"
                    />
                    <span className="font-semibold text-gray-700">Domestic Destination</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary-600 px-5 py-2 text-xs font-bold text-white hover:bg-primary-700"
                >
                  Save Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
