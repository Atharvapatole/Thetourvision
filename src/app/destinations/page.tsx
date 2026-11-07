import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Compass, MapPin, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { DEMO_DESTINATIONS } from '@/lib/constants';

export const metadata = {
  title: 'Destinations Portfolio | The Tour Vision Pune',
  description: 'Explore our curated luxury destinations across India, Europe, Southeast Asia, and the Middle East.',
};

export default function DestinationsPage() {
  const domesticDestinations = DEMO_DESTINATIONS.filter((d) => d.is_domestic);
  const internationalDestinations = DEMO_DESTINATIONS.filter((d) => !d.is_domestic);

  return (
    <div className="bg-[#fcfaf7] min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 border border-amber-300/60 px-3.5 py-1 text-xs font-semibold text-amber-900 mb-4">
            <Compass className="h-3.5 w-3.5" />
            <span>GLOBAL & DOMESTIC PORTFOLIOS</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-navy">
            Curated World Destinations
          </h1>
          <p className="mt-4 text-base text-gray-600 leading-relaxed font-light">
            Every destination is deeply researched by our Pune travel specialists to ensure uncompromised luxury, cultural authenticity, and seamless connectivity from Maharashtra.
          </p>
        </div>

        {/* Domestic Wonders Section */}
        <div className="mb-20">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-navy">
                Incredible India Portfolios
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Royal palaces, Himalayan valleys, and tranquil backwaters.
              </p>
            </div>
            <span className="text-xs font-semibold text-primary-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {domesticDestinations.length} Portfolios
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {domesticDestinations.map((dest) => (
              <Link
                key={dest.id}
                href={`/destinations/${dest.slug}`}
                className="group flex flex-col rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden"
              >
                <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={dest.hero_image}
                    alt={dest.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
                      {dest.region}
                    </span>
                    <h3 className="font-serif text-2xl font-bold mt-0.5 group-hover:text-amber-300 transition-colors">
                      {dest.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {dest.overview}
                    </p>
                    <div className="mt-4 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                        Signature Highlights:
                      </span>
                      {dest.highlights.slice(0, 2).map((h, i) => (
                        <p key={i} className="text-xs text-gray-700 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                          <span className="line-clamp-1">{h}</span>
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Best: <strong className="text-gray-800">{dest.best_season.split('(')[0]}</strong>
                    </span>
                    <span className="text-xs font-bold text-primary-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>View Destination</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* International Luxury Section */}
        <div>
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-navy">
                International Luxury Portfolios
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                European alpine heights, tropical island pool villas, and desert safaris.
              </p>
            </div>
            <span className="text-xs font-semibold text-primary-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {internationalDestinations.length} Portfolios
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {internationalDestinations.map((dest) => (
              <Link
                key={dest.id}
                href={`/destinations/${dest.slug}`}
                className="group flex flex-col rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden"
              >
                <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={dest.hero_image}
                    alt={dest.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
                      {dest.country} • {dest.region}
                    </span>
                    <h3 className="font-serif text-2xl font-bold mt-0.5 group-hover:text-amber-300 transition-colors">
                      {dest.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {dest.overview}
                    </p>
                    <div className="mt-4 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                        Signature Highlights:
                      </span>
                      {dest.highlights.slice(0, 2).map((h, i) => (
                        <p key={i} className="text-xs text-gray-700 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                          <span className="line-clamp-1">{h}</span>
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Best: <strong className="text-gray-800">{dest.best_season.split('(')[0]}</strong>
                    </span>
                    <span className="text-xs font-bold text-primary-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>View Destination</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
