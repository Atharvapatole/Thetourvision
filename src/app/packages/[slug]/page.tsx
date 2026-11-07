'use client';

import React, { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Calendar, Clock, MapPin, Users, Check, X, 
  Send, Sparkles, Shield, ChevronDown, CheckCircle, 
  ArrowRight, Phone 
} from 'lucide-react';
import { DEMO_PACKAGES, SITE_CONFIG } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import WhatsAppButton from '@/components/shared/WhatsAppButton';

export default function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const pkg = DEMO_PACKAGES.find((p) => p.slug === slug);

  if (!pkg) {
    notFound();
  }

  // Inquiry Form State
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [specialRequests, setSpecialRequests] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<any>(null);
  const [submitError, setSubmitError] = useState('');

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          email,
          phone,
          departure_city: 'Pune',
          destination_name: pkg.destination_name,
          package_id: pkg.id,
          travel_dates: travelDate,
          adults,
          children: childrenCount,
          internal_notes: `Direct inquiry for package: ${pkg.title}. Special requests: ${specialRequests}`,
          lead_source: 'website',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit inquiry');

      setSubmittedInquiry(data.inquiry);
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please try again or WhatsApp our Pune team.');
    } finally {
      setSubmitting(false);
    }
  };

  const itineraryDays = [
    {
      day: 1,
      title: 'Arrival & Welcome with Private Chauffeur Greeting',
      desc: 'Meet your dedicated tour representative upon arrival. Private air-conditioned transfer to your verified luxury accommodation. Enjoy welcome refreshments and leisurely evening orientation.',
      meals: 'Welcome Dinner',
      stay: pkg.accommodation_grade,
    },
    {
      day: 2,
      title: 'Heritage & Iconic City Exploration',
      desc: 'Embark on a guided morning tour with private vehicle and licensed English/Hindi guide. Visit historic landmarks, artisan bazaars, and scenic vantage points.',
      meals: 'Breakfast',
      stay: pkg.accommodation_grade,
    },
    {
      day: 3,
      title: 'Scenic Landscapes & Signature Experience',
      desc: 'Full-day excursion into breathtaking natural scenery. Experience signature highlights (cable cars, boat cruises, or nature trails) with pre-arranged VIP passes.',
      meals: 'Breakfast & Curated Lunch',
      stay: pkg.accommodation_grade,
    },
    {
      day: 4,
      title: 'Bespoke Leisure & Culinary Evening',
      desc: 'Enjoy a leisurely morning at your luxury resort. In the late afternoon, partake in private tea tastings or cultural performances followed by specialty dining.',
      meals: 'Breakfast & Dinner',
      stay: pkg.accommodation_grade,
    },
    {
      day: 5,
      title: 'Farewell & Assisted Departure Transfer',
      desc: 'Leisurely breakfast. Assistance with check-out and seamless private chauffeur transfer to the airport/station for your return to Pune/Mumbai.',
      meals: 'Breakfast',
      stay: 'None',
    },
  ];

  return (
    <div className="bg-[#fcfaf7] min-h-screen pb-20">
      {/* 1. Header Banner */}
      <div className="relative h-[60vh] min-h-[420px] w-full bg-brand-navy overflow-hidden">
        <Image
          src={pkg.cover_image}
          alt={pkg.title}
          fill
          priority
          className="object-cover object-center brightness-[0.55]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl h-full flex flex-col justify-end pb-12 px-4 sm:px-8 text-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="rounded-full bg-amber-400/20 border border-amber-400/40 px-3 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md">
              {pkg.category_name}
            </span>
            <span className="text-xs text-gray-300">
              {pkg.destination_name}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-4xl">
            {pkg.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-gray-200">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-amber-400" />
              <span>{pkg.days} Days / {pkg.nights} Nights</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-amber-400" />
              <span>Departs: {pkg.departure_city}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-amber-400" />
              <span>{pkg.accommodation_grade}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Itinerary, Inclusions, FAQs */}
          <div className="lg:col-span-2 space-y-12">
            {/* Package Overview */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-navy mb-4">
                Journey Overview
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">
                {pkg.summary}
              </p>
              <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-amber-700 shrink-0" />
                <span>
                  <strong>Pune Concierge Guarantee:</strong> This itinerary is completely customizable. You can extend days, upgrade to royal heritage suites, or include private flights.
                </span>
              </div>
            </div>

            {/* Day-by-Day Itinerary */}
            <div>
              <h3 className="font-serif text-2xl font-bold text-brand-navy mb-6">
                Day-by-Day Itinerary ({pkg.days} Days)
              </h3>

              <div className="space-y-6">
                {itineraryDays.slice(0, pkg.days).map((day) => (
                  <div
                    key={day.day}
                    className="relative pl-8 border-l-2 border-amber-300/80 pb-4 last:pb-0"
                  >
                    <div className="absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-amber-300 shadow">
                      {day.day}
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                      <h4 className="font-serif text-base font-bold text-brand-navy">
                        Day {day.day}: {day.title}
                      </h4>
                      <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                        {day.desc}
                      </p>
                      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-4 text-[11px] text-gray-500">
                        <span><strong>Meals:</strong> {day.meals}</span>
                        <span>•</span>
                        <span><strong>Stay:</strong> {day.stay}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
                <h4 className="font-serif text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-600" />
                  <span>Package Inclusions</span>
                </h4>
                <ul className="space-y-2.5 text-xs text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Accommodations in luxury handpicked properties</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Daily gourmet buffet breakfast</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Dedicated private chauffeur vehicle throughout</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>All toll taxes, parking fees, and driver allowances</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>24x7 Pune operations emergency helpline</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
                <h4 className="font-serif text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                  <X className="h-5 w-5 text-red-600" />
                  <span>Exclusions</span>
                </h4>
                <ul className="space-y-2.5 text-xs text-gray-700">
                  <li className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <span>Airfare / Train tickets unless explicitly booked</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <span>Personal laundry, telephone calls, and mini-bar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <span>Monument entry tickets unless noted in quotation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <span>5% GST (itemized transparently in final quotation)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Interactive Inquiry Card */}
          <div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl sticky top-28">
              {/* Price Callout */}
              <div className="border-b border-gray-100 pb-5">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">
                  Package Price
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-brand-navy">
                    {formatCurrency(pkg.discounted_price_inr || pkg.price_inr)}
                  </span>
                  {pkg.discounted_price_inr && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatCurrency(pkg.price_inr)}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 block mt-0.5">
                  per traveler (twin-sharing, ex-Pune/Mumbai)
                </span>
              </div>

              {/* Inquiry Form */}
              {submittedInquiry ? (
                <div className="my-6 rounded-xl bg-emerald-50 border border-emerald-200 p-5 text-center">
                  <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2">
                    <Check className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-emerald-900">
                    Inquiry Received!
                  </h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    Your reference number is{' '}
                    <strong>{submittedInquiry.inquiry_number}</strong>.
                  </p>
                  <p className="text-[11px] text-gray-600 mt-3 leading-relaxed">
                    Our Pune travel planner will reach out to you within 2 business hours with an itemized proposal.
                  </p>
                  <button
                    onClick={() => setSubmittedInquiry(null)}
                    className="mt-4 text-xs font-semibold text-emerald-800 underline"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="mt-5 space-y-3.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Request Customized Quotation
                  </h4>

                  {submitError && (
                    <div className="rounded-lg bg-red-50 p-2 text-xs text-red-600 border border-red-200">
                      {submitError}
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Anand Kulkarni"
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 block">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="anand@example.com"
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 block">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98220 12345"
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block">
                      Preferred Travel Month / Dates
                    </label>
                    <input
                      type="text"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      placeholder="e.g. Next month, 15th to 22nd"
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 block">
                        Adults (12+ yrs)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={adults}
                        onChange={(e) => setAdults(Number(e.target.value))}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 block">
                        Children (below 12)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={childrenCount}
                        onChange={(e) => setChildrenCount(Number(e.target.value))}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block">
                      Special Preferences (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Vegetarian food, balcony view room, honeymoon decor..."
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 text-xs font-bold text-white transition-all hover:bg-primary-700 shadow-md disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    <span>{submitting ? 'Registering Lead...' : 'Send Inquiry to Pune Desk'}</span>
                  </button>
                </form>
              )}

              {/* Instant WhatsApp Action */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <WhatsAppButton
                  variant="inline"
                  prefilledText={`Hello The Tour Vision Pune, I am interested in booking "${pkg.title}". Please share full details and pricing.`}
                  label="Instant WhatsApp Consultation"
                  className="w-full py-2.5 text-xs"
                />
              </div>

              <div className="mt-4 text-[10px] text-gray-400 text-center">
                The Tour Vision • Pune, Maharashtra • No Spam Guarantee
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
