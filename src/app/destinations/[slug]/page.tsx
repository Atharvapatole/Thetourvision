import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  MapPin, Calendar, Sun, CheckCircle, ArrowRight, 
  Sparkles, Compass, ShieldCheck 
} from 'lucide-react';
import { DEMO_DESTINATIONS, DEMO_PACKAGES } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import WhatsAppButton from '@/components/shared/WhatsAppButton';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = DEMO_DESTINATIONS.find((d) => d.slug === slug);
  if (!destination) return { title: 'Destination Not Found' };

  return {
    title: `${destination.name} Luxury Travel Guide | The Tour Vision Pune`,
    description: destination.overview,
  };
}

export default async function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = DEMO_DESTINATIONS.find((d) => d.slug === slug);

  if (!destination) {
    notFound();
  }

  // Find packages linked to this destination
  const relatedPackages = DEMO_PACKAGES.filter((p) => p.destination_id === destination.id);

  return (
    <div className="bg-[#fcfaf7] min-h-screen">
      {/* 1. Cinematic Destination Hero */}
      <div className="relative h-[65vh] min-h-[450px] w-full overflow-hidden bg-brand-navy">
        <Image
          src={destination.hero_image}
          alt={destination.name}
          fill
          priority
          className="object-cover object-center brightness-[0.55]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl h-full flex flex-col justify-end pb-16 px-4 sm:px-8 text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 border border-amber-400/40 px-3.5 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md mb-4 self-start">
            <Compass className="h-3.5 w-3.5" />
            <span>{destination.region}, {destination.country}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-3xl">
            {destination.name}
          </h1>

          <p className="mt-3 text-lg text-amber-100 max-w-2xl font-light">
            {destination.tagline}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-gray-200">
            <span className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <Calendar className="h-4 w-4 text-amber-400" />
              <span><strong>Best Season:</strong> {destination.best_season}</span>
            </span>
            <span className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <Sun className="h-4 w-4 text-amber-400" />
              <span>{destination.is_domestic ? 'Domestic Pride' : 'International Pass'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Destination Overview & Signature Highlights */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Editorial Content */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <span className="text-primary-700 font-bold uppercase tracking-wider text-xs">
                Editorial Overview
              </span>
              <h2 className="font-serif text-3xl font-bold text-brand-navy mt-1">
                The Allure of {destination.name}
              </h2>
              <p className="mt-4 text-base text-gray-700 leading-relaxed font-light">
                {destination.overview}
              </p>
            </div>

            {/* Signature Highlights */}
            <div className="rounded-2xl border border-amber-200/80 bg-white p-8 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-brand-navy mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <span>Signature Experiences Curated by The Tour Vision</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {destination.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-800 leading-snug">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel Packages linked to this destination */}
            <div>
              <h3 className="font-serif text-2xl font-bold text-brand-navy mb-6">
                Curated Packages for {destination.name}
              </h3>

              {relatedPackages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {relatedPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="group rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                    >
                      <div className="relative h-48 w-full bg-gray-100">
                        <Image
                          src={pkg.cover_image}
                          alt={pkg.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 right-3 rounded-full bg-brand-navy/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-amber-300">
                          {pkg.days}D / {pkg.nights}N
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-serif text-base font-bold text-brand-navy group-hover:text-primary-700 transition-colors">
                            {pkg.title}
                          </h4>
                          <p className="mt-2 text-xs text-gray-500 line-clamp-2">
                            {pkg.summary}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase text-gray-400 block">Starting</span>
                            <span className="text-base font-bold text-brand-navy">
                              {formatCurrency(pkg.discounted_price_inr || pkg.price_inr)}
                            </span>
                          </div>
                          <Link
                            href={`/packages/${pkg.slug}`}
                            className="inline-flex items-center gap-1 rounded-lg bg-brand-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                          >
                            <span>Explore</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center bg-white">
                  <p className="text-sm text-gray-600">
                    We curate custom bespoke itineraries for {destination.name} upon request.
                  </p>
                  <Link
                    href="/trip-planner"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-700"
                  >
                    <span>Request Custom {destination.name} Itinerary</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Pune Concierge Consultation Card */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sticky top-28">
              <span className="text-primary-700 font-bold uppercase tracking-wider text-[11px] block">
                Bespoke Planning
              </span>
              <h3 className="font-serif text-xl font-bold text-brand-navy mt-1">
                Customize Your {destination.name} Vacation
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Connect directly with our senior destination planner in Pune for flight connections ex-Pune or Mumbai, luxury accommodations, and special requests.
              </p>

              <div className="mt-6 space-y-3">
                <Link
                  href={`/trip-planner?destination=${destination.name}`}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-navy py-3 text-xs font-bold text-white hover:bg-slate-800 transition-all shadow-sm"
                >
                  <Calendar className="h-4 w-4 text-amber-400" />
                  <span>Start Smart Trip Planner</span>
                </Link>

                <WhatsAppButton
                  variant="inline"
                  phone="919822012345"
                  prefilledText={`Hello The Tour Vision Pune, I am planning a holiday to ${destination.name}. Please share customized recommendations and private tour options.`}
                  label={`WhatsApp Pune Desk for ${destination.name}`}
                  className="w-full py-3 text-xs"
                />
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 text-[11px] text-gray-500 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Transparent itemized quotation in INR</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Local airport chauffeur assistance available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
