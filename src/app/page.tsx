'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Compass, MapPin, Calendar, Users, ArrowRight, 
  Sparkles, Star, Shield, HeartHandshake, Award, 
  CheckCircle, MessageCircle, Clock, ChevronRight
} from 'lucide-react';
import { 
  DEMO_DESTINATIONS, DEMO_PACKAGES, 
  POPULAR_DEPARTURE_CITIES, SITE_CONFIG 
} from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import WhatsAppButton from '@/components/shared/WhatsAppButton';

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState('Pune');
  const [destinationFilter, setDestinationFilter] = useState<'all' | 'domestic' | 'international'>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'honeymoon' | 'luxury' | 'family'>('all');

  const filteredDestinations = DEMO_DESTINATIONS.filter((d) => {
    if (destinationFilter === 'domestic') return d.is_domestic;
    if (destinationFilter === 'international') return !d.is_domestic;
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center bg-brand-navy overflow-hidden">
        {/* Background Image with Dark Vignette Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85"
            alt="Majestic Alpine Travel Landscape"
            fill
            priority
            className="object-cover object-center brightness-[0.45] scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 text-center sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-black/40 px-4 py-1.5 text-xs font-semibold text-amber-300 backdrop-blur-md mb-6 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>PUNE’S PREMIER BESPOKE TRAVEL CURATORS</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
            Extraordinary Journeys,{' '}
            <span className="italic font-normal text-amber-300">
              Impeccably Crafted.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
            From the snow-crowned summits of Switzerland to the royal palaces of Rajasthan, experience personalized itineraries with white-glove concierge precision.
          </p>

          {/* QUICK TRIP FINDER BAR */}
          <div className="mt-10 mx-auto max-w-4xl rounded-2xl bg-white/95 p-4 shadow-2xl backdrop-blur-md border border-white/20 text-left">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Departure City */}
              <div className="border-b sm:border-b-0 sm:border-r border-gray-200 pb-3 sm:pb-0 sm:pr-4">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-amber-600" />
                  Departure City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="mt-1 w-full bg-transparent text-sm font-semibold text-gray-900 focus:outline-none cursor-pointer"
                >
                  {POPULAR_DEPARTURE_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city} ({city === 'Pune' ? 'Direct / Chauffeur' : 'Connecting'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination Search */}
              <div className="border-b sm:border-b-0 sm:border-r border-gray-200 pb-3 sm:pb-0 sm:pr-4">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5 text-amber-600" />
                  Dream Destination
                </label>
                <select className="mt-1 w-full bg-transparent text-sm font-semibold text-gray-900 focus:outline-none cursor-pointer">
                  <option value="any">Explore All Portfolios</option>
                  <option value="kashmir">Kashmir (Dal Lake & Gulmarg)</option>
                  <option value="switzerland">Switzerland (Swiss Alps)</option>
                  <option value="rajasthan">Rajasthan (Udaipur & Jaipur)</option>
                  <option value="bali">Bali (Villas & Ubud)</option>
                  <option value="kerala">Kerala (Backwaters)</option>
                  <option value="dubai">Dubai (Luxury Safari)</option>
                </select>
              </div>

              {/* Travel Window */}
              <div className="border-b sm:border-b-0 sm:border-r border-gray-200 pb-3 sm:pb-0 sm:pr-4">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-amber-600" />
                  Travel Period
                </label>
                <select className="mt-1 w-full bg-transparent text-sm font-semibold text-gray-900 focus:outline-none cursor-pointer">
                  <option>Next 30 Days</option>
                  <option>Upcoming Season</option>
                  <option>Summer Holidays</option>
                  <option>Winter Snow Escape</option>
                  <option>Honeymoon Window</option>
                </select>
              </div>

              {/* CTA Button */}
              <div className="flex items-center justify-center">
                <Link
                  href="/packages"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 px-6 text-sm font-bold text-white transition-all hover:bg-primary-700 shadow-lg shadow-amber-600/30"
                >
                  <span>Discover Tours</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Social Proof Badges under Hero */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>Tailored Ex-Pune & Mumbai</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span>4.9/5 Rated by Pune Travelers</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-amber-400" />
              <span>Hand-Verified 4 & 5 Star Stays</span>
            </span>
          </div>
        </div>
      </section>

      {/* 2. FEATURED DESTINATIONS SHOWCASE */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-primary-600 font-bold uppercase tracking-wider text-xs">
              Handpicked Portfolios
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy mt-1">
              Iconic Global & Domestic Destinations
            </h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base max-w-xl">
              Curated for discerning voyagers seeking breathtaking landscapes, cultural elegance, and exceptional comfort.
            </p>
          </div>

          {/* Destination Filters */}
          <div className="mt-6 md:mt-0 flex items-center gap-2 bg-gray-100 p-1 rounded-xl self-start">
            <button
              onClick={() => setDestinationFilter('all')}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                destinationFilter === 'all'
                  ? 'bg-white text-brand-navy shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Destinations
            </button>
            <button
              onClick={() => setDestinationFilter('domestic')}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                destinationFilter === 'domestic'
                  ? 'bg-white text-brand-navy shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Domestic Wonders
            </button>
            <button
              onClick={() => setDestinationFilter('international')}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                destinationFilter === 'international'
                  ? 'bg-white text-brand-navy shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              International Escapes
            </button>
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((dest) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              <div className="relative h-72 w-full overflow-hidden bg-gray-100">
                <Image
                  src={dest.hero_image}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute top-4 left-4 rounded-full bg-brand-navy/80 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-amber-300">
                  {dest.is_domestic ? 'Domestic Pride' : 'International'}
                </span>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs uppercase tracking-wider text-amber-300 font-medium">
                    {dest.region}, {dest.country}
                  </span>
                  <h3 className="font-serif text-2xl font-bold mt-0.5 group-hover:text-amber-300 transition-colors">
                    {dest.name}
                  </h3>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                  {dest.overview}
                </p>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">
                    Best: <strong className="text-gray-700">{dest.best_season.split('(')[0]}</strong>
                  </span>
                  <span className="text-xs font-bold text-primary-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Explore Guide</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. POPULAR CURATED PACKAGES */}
      <section className="bg-brand-sand py-20 px-4 sm:px-8 border-y border-amber-900/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-primary-700 font-bold uppercase tracking-wider text-xs">
                Signature Itineraries
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy mt-1">
                Featured Luxury Packages
              </h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-base max-w-xl">
                Every package is fully customizable. Accommodations and chauffeurs are vetted by our Pune team.
              </p>
            </div>
            <Link
              href="/packages"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-primary-700 hover:text-primary-800"
            >
              <span>View All 15+ Packages</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Package Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DEMO_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="group flex flex-col rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100 overflow-hidden"
              >
                <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={pkg.cover_image}
                    alt={pkg.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 rounded-full bg-brand-navy/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-amber-300">
                    {pkg.days}D / {pkg.nights}N
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-md bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] text-white">
                    {pkg.category_name}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-brand-navy line-clamp-2 group-hover:text-primary-700 transition-colors">
                      {pkg.title}
                    </h3>
                    <p className="mt-2 text-xs text-gray-500 line-clamp-2">
                      {pkg.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] uppercase text-gray-400 block font-semibold">
                          Starting From
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-extrabold text-brand-navy">
                            {formatCurrency(pkg.discounted_price_inr || pkg.price_inr)}
                          </span>
                          {pkg.discounted_price_inr && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatCurrency(pkg.price_inr)}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-500">per person</span>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <Link
                        href={`/packages/${pkg.slug}`}
                        className="flex-1 text-center rounded-lg bg-brand-navy py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                      >
                        Details
                      </Link>
                      <WhatsAppButton
                        variant="inline"
                        prefilledText={`Hello The Tour Vision Pune, I am interested in booking the "${pkg.title}" package. Please share detailed itinerary and dates.`}
                        label="Inquire"
                        className="py-2 px-3 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE THE TOUR VISION */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary-600 font-bold uppercase tracking-wider text-xs">
            The Tour Vision Advantage
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy mt-1">
            Why Discerning Travelers Choose Us
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            We are not a generic mass-market ticketing desk. We design refined, private journeys customized to your family’s rhythm and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-5">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-brand-navy">
              Local Pune Concierge
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-gray-600">
              Personal consultation at our Pune office or via video call. Direct WhatsApp support before, during, and after your trip.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-5">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-brand-navy">
              Verified Stays & Fleets
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-gray-600">
              Every heritage palace, alpine chalet, and private villa is rigorously vetted. Dedicated private chauffeurs with verified records.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-5">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-brand-navy">
              Itemized Transparency
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-gray-600">
              Clear itemized quotations with breakdown of accommodations, transfers, and GST. No hidden surcharges or surprise billing.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-5">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-brand-navy">
              24x7 Voyager Support
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-gray-600">
              Dedicated emergency hotline active around the clock for flight changes, weather advisories, and on-ground concierge requests.
            </p>
          </div>
        </div>
      </section>

      {/* 5. SMART TRIP PLANNER & AI CONCIERGE BANNER */}
      <section className="bg-brand-navy text-white py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-slate-900 to-brand-navy border border-amber-400/20 p-8 sm:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-amber-400 font-semibold tracking-wider text-xs uppercase flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Interactive Intelligence</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-2 text-white">
              Plan Your Dream Holiday in 4 Simple Steps
            </h2>
            <p className="mt-3 text-sm text-gray-300 leading-relaxed">
              Use our interactive Smart Trip Planner to select departure dates, travel companions, preferred pacing, and accommodation tier. Our system generates real-time suggestions and alerts our Pune advisors to craft your custom proposal.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href="/trip-planner"
                className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary-500 shadow-lg"
              >
                <span>Launch Smart Trip Planner</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/ai-travel-assistant"
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/10"
              >
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Ask AI Concierge</span>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md max-w-sm w-full">
            <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
              Quick Highlights
            </h4>
            <ul className="mt-4 space-y-3 text-xs text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Instant itinerary outline and pricing preview</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Direct sync with The Tour Vision CRM database</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Instant PDF proposal generated by our staff</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED TESTIMONIALS */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary-600 font-bold uppercase tracking-wider text-xs">
            Client Stories
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy mt-1">
            Word of Trust from Fellow Travelers
          </h2>
          <p className="text-gray-600 mt-2 text-sm">
            Read authentic reviews from families, couples, and adventurers who trusted The Tour Vision for their milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs leading-relaxed text-gray-700 italic">
                “Our 8-day Swiss Alps journey was flawless from start to finish. The hotel recommendations right next to train stations in Lucerne and Interlaken saved us so much effort with luggage. The Swiss Travel Pass tips were invaluable!”
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-brand-navy">Sameer & Priya Deshmukh</h4>
                <p className="text-[11px] text-gray-500">Baner, Pune • Swiss Alps Odyssey</p>
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs leading-relaxed text-gray-700 italic">
                “The Tour Vision arranged our honeymoon trip to Kashmir. The private cedar houseboat on Dal Lake and the pre-booked Gulmarg Gondola Phase 2 tickets made us feel like royalty. Unmatched service!”
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-brand-navy">Dr. Rajesh & Sunita Kulkarni</h4>
                <p className="text-[11px] text-gray-500">Kothrud, Pune • Kashmir Paradise</p>
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs leading-relaxed text-gray-700 italic">
                “Rajasthan heritage palace tour organized with utmost precision. Punctual private chauffeur in an Innova Crysta, verified heritage stays in Udaipur, and golden hour boat cruise on Lake Pichola.”
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-brand-navy">Vikramaditya Shinde</h4>
                <p className="text-[11px] text-gray-500">Viman Nagar, Pune • Royal Rajasthan</p>
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
