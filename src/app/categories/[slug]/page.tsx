import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';
import { DEMO_PACKAGES } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import WhatsAppButton from '@/components/shared/WhatsAppButton';

const categoryTitles: { [key: string]: { title: string; desc: string } } = {
  'honeymoon-and-romance': {
    title: 'Honeymoon & Romantic Vacations',
    desc: 'Intimate escapes featuring private pool villas, Dal Lake luxury houseboats, couples wellness spas, and sunset candlelit dinners.',
  },
  'luxury-escapes': {
    title: '5-Star Luxury Escapes & Palaces',
    desc: 'Bespoke royal palace heritage sanctuaries, Swiss alpine panoramic trains, and private chauffeured expeditions.',
  },
  'family-vacations': {
    title: 'Curated Family Vacations',
    desc: 'Comfort-paced holidays designed for multi-generational travelers with vetted family resorts and safe transport.',
  },
  'adventure-and-wildlife': {
    title: 'Adventure & Expeditions',
    desc: 'Alpine snow expeditions in Gulmarg and Swiss peaks, desert dune glamping, and coral reef explorations.',
  },
};

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const catInfo = categoryTitles[slug] || {
    title: `${slug.replace(/-/g, ' ').toUpperCase()} TOURS`,
    desc: 'Curated holiday itineraries tailored by The Tour Vision Pune.',
  };

  const matchingPackages = DEMO_PACKAGES.filter((p) => {
    const normCategory = p.category_name.toLowerCase().replace(/ & /g, '-and-').replace(/ /g, '-');
    return normCategory.includes(slug) || slug.includes(normCategory);
  });

  return (
    <div className="bg-[#fcfaf7] min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1 text-xs font-semibold text-amber-900 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>CURATED TRAVEL CATEGORY</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brand-navy">
            {catInfo.title}
          </h1>
          <p className="mt-3 text-sm text-gray-600 font-light leading-relaxed">
            {catInfo.desc}
          </p>
        </div>

        {matchingPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {matchingPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="group flex flex-col rounded-3xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all"
              >
                <div className="relative h-60 w-full bg-gray-100 overflow-hidden">
                  <Image
                    src={pkg.cover_image}
                    alt={pkg.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 rounded-full bg-brand-navy/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-amber-300">
                    {pkg.days}D / {pkg.nights}N
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-primary-700 block">
                      {pkg.destination_name}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-brand-navy mt-1 group-hover:text-primary-700 transition-colors">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-3">
                      {pkg.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase text-gray-400 block">Starting</span>
                      <span className="text-lg font-bold text-brand-navy">
                        {formatCurrency(pkg.discounted_price_inr || pkg.price_inr)}
                      </span>
                    </div>
                    <Link
                      href={`/packages/${pkg.slug}`}
                      className="rounded-xl bg-brand-navy px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center max-w-lg mx-auto">
            <Compass className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-brand-navy">
              Custom Itineraries Available
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Our Pune team curates bespoke packages for this category upon request.
            </p>
            <Link
              href="/trip-planner"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-700"
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
