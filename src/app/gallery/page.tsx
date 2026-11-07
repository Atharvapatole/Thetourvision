'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Camera, Sparkles, MapPin } from 'lucide-react';

export default function GalleryPage() {
  const [filter, setFilter] = useState('all');

  const galleryItems = [
    {
      id: 1,
      title: 'Dal Lake Morning Shikara & Mist',
      destination: 'Kashmir',
      category: 'domestic',
      image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 2,
      title: 'Lake Pichola Royal Palace at Twilight',
      destination: 'Rajasthan',
      category: 'domestic',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 3,
      title: 'Jungfraujoch Alpine Ice & Glacier Summit',
      destination: 'Switzerland',
      category: 'international',
      image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 4,
      title: 'Misty Emerald Tea Terraces of Munnar',
      destination: 'Kerala',
      category: 'domestic',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 5,
      title: 'Tropical Ubud Jungle Canopy Sanctuary',
      destination: 'Bali',
      category: 'international',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 6,
      title: 'Sunset Over the Arabian Red Dunes',
      destination: 'Dubai',
      category: 'international',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const filtered = galleryItems.filter((item) => {
    if (filter === 'domestic') return item.category === 'domestic';
    if (filter === 'international') return item.category === 'international';
    return true;
  });

  return (
    <div className="bg-[#fcfaf7] min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1 text-xs font-semibold text-amber-900 mb-3">
            <Camera className="h-3.5 w-3.5 text-amber-600" />
            <span>VISUAL CHRONICLES</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brand-navy">
            Destination Gallery
          </h1>
          <p className="mt-3 text-sm text-gray-600 font-light">
            Glimpses of royal palaces, snow peaks, serene backwaters, and private villas visited by our Pune voyagers.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All Photos' },
              { id: 'domestic', label: 'Incredible India' },
              { id: 'international', label: 'International Wonders' },
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => setFilter(b.id)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  filter === b.id
                    ? 'bg-brand-navy text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative h-80 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 bg-gray-100"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{item.destination}</span>
                </span>
                <h3 className="font-serif text-lg font-bold mt-1">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
