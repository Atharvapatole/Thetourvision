'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Compass, MapPin, Calendar, Users, DollarSign, 
  Sparkles, CheckCircle, ArrowRight, ArrowLeft, 
  Send, Shield, Heart, Crown, Award, Check 
} from 'lucide-react';
import { POPULAR_DEPARTURE_CITIES, TRAVEL_STYLES, SITE_CONFIG } from '@/lib/constants';
import WhatsAppButton from '@/components/shared/WhatsAppButton';

export default function TripPlannerPage() {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [departureCity, setDepartureCity] = useState('Pune');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [travelStyle, setTravelStyle] = useState('luxury');
  const [accommodation, setAccommodation] = useState('5-Star Luxury Heritage');
  const [budget, setBudget] = useState('150000');
  const [specialNotes, setSpecialNotes] = useState('');

  // Contact Info
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // State after submission
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedInquiry, setConfirmedInquiry] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: fullName,
          email,
          phone,
          departure_city: departureCity,
          destination_name: destination,
          start_date: startDate || null,
          end_date: endDate || null,
          adults,
          children,
          budget: Number(budget) || 0,
          currency: 'INR',
          travel_style: travelStyle,
          accommodation_preference: accommodation,
          preferences: {
            special_requests: specialNotes,
          },
          lead_source: 'trip_planner',
          internal_notes: `Lead generated via Smart Trip Planner. Style: ${travelStyle}, Acc: ${accommodation}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit itinerary plan');

      setConfirmedInquiry(data.inquiry);
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission error. Please verify your details or use WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#fcfaf7] min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 border border-amber-300/60 px-3.5 py-1 text-xs font-semibold text-amber-900 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>CUSTOM VACATION BUILDER</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brand-navy">
            Smart Trip Planner
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-xl mx-auto font-light">
            Design your ideal holiday with tailored destinations, accommodation tiers, and pacing. Our Pune advisors will generate an itemized custom proposal.
          </p>
        </div>

        {/* Multi-step progress bar */}
        {!confirmedInquiry && (
          <div className="mb-10">
            <div className="flex items-center justify-between max-w-2xl mx-auto relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
              {[
                { step: 1, title: 'Destination' },
                { step: 2, title: 'Travelers' },
                { step: 3, title: 'Style & Budget' },
                { step: 4, title: 'Contact' },
              ].map((item) => (
                <div key={item.step} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all shadow ${
                      currentStep >= item.step
                        ? 'bg-brand-navy text-amber-300 border-2 border-amber-400'
                        : 'bg-white text-gray-400 border-2 border-gray-200'
                    }`}
                  >
                    {item.step}
                  </div>
                  <span
                    className={`text-[11px] font-semibold mt-1.5 hidden sm:inline ${
                      currentStep >= item.step ? 'text-brand-navy' : 'text-gray-400'
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confirmation Screen */}
        {confirmedInquiry ? (
          <div className="rounded-3xl border border-emerald-200 bg-white p-8 sm:p-12 shadow-xl text-center max-w-2xl mx-auto">
            <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 stroke-[3]" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Trip Plan Registered With Pune CRM
            </span>
            <h2 className="font-serif text-3xl font-bold text-brand-navy mt-1">
              Thank You, {confirmedInquiry.customer_name || fullName}!
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Your inquiry reference number is:
            </p>

            <div className="mt-3 inline-block rounded-xl bg-gray-100 border border-gray-300 px-6 py-2.5 text-base font-mono font-bold text-brand-navy">
              {confirmedInquiry.inquiry_number}
            </div>

            <div className="mt-8 rounded-2xl bg-amber-50/60 border border-amber-200/80 p-5 text-left text-xs text-amber-950 space-y-2">
              <h4 className="font-bold text-amber-900 text-sm">
                What happens next?
              </h4>
              <p>
                1. <strong>Itinerary Crafting:</strong> A senior travel advisor at The Tour Vision Pune will review your requested destination ({destination}) and travel preferences.
              </p>
              <p>
                2. <strong>Itemized Proposal:</strong> You will receive a verified quotation with hotel options, private chauffeur rates, and day-by-day sightseeing.
              </p>
              <p>
                3. <strong>Direct Contact:</strong> We will reach out to you via WhatsApp / email within 2 to 4 business hours.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <WhatsAppButton
                variant="inline"
                prefilledText={`Hello The Tour Vision Pune, I have submitted Trip Planner request #${confirmedInquiry.inquiry_number} for ${destination}. Let's discuss!`}
                label="Connect Instantly via WhatsApp"
                className="w-full sm:w-auto"
              />
              <Link
                href="/account"
                className="w-full sm:w-auto rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-xs font-semibold text-gray-700 hover:border-gray-800"
              >
                Track in Customer Portal
              </Link>
            </div>
          </div>
        ) : (
          /* Multi-step Form Card */
          <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-xl">
            {errorMsg && (
              <div className="mb-6 rounded-xl bg-red-50 p-4 text-xs text-red-600 border border-red-200">
                {errorMsg}
              </div>
            )}

            {/* STEP 1: Destination & Departure */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-brand-navy">
                    Where would you like to travel?
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Select your departure city from Maharashtra and your desired destination.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Departure City
                    </label>
                    <select
                      value={departureCity}
                      onChange={(e) => setDepartureCity(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs font-medium text-gray-800 focus:border-amber-500 focus:bg-white focus:outline-none"
                    >
                      {POPULAR_DEPARTURE_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Target Destination *
                    </label>
                    <input
                      type="text"
                      required
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="e.g. Kashmir, Switzerland, Rajasthan, Bali..."
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs font-medium text-gray-800 focus:border-amber-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Tentative Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs font-medium text-gray-800 focus:border-amber-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Tentative End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs font-medium text-gray-800 focus:border-amber-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (!destination.trim()) {
                        setErrorMsg('Please specify a destination before continuing.');
                        return;
                      }
                      setErrorMsg('');
                      setCurrentStep(2);
                    }}
                    className="flex items-center gap-2 rounded-xl bg-brand-navy px-6 py-3 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-md"
                  >
                    <span>Next: Travel Party</span>
                    <ArrowRight className="h-4 w-4 text-amber-400" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Travelers & Pacing */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-brand-navy">
                    Who will be traveling?
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Help us size vehicle arrangements and hotel room configurations.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 max-w-md">
                  <div className="rounded-xl border border-gray-200 p-4">
                    <label className="text-xs font-bold text-gray-800 block">
                      Adults (12+ years)
                    </label>
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="h-8 w-8 rounded-lg bg-gray-100 font-bold text-gray-700 hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="text-base font-bold text-brand-navy">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults(adults + 1)}
                        className="h-8 w-8 rounded-lg bg-gray-100 font-bold text-gray-700 hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-4">
                    <label className="text-xs font-bold text-gray-800 block">
                      Children (below 12)
                    </label>
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="h-8 w-8 rounded-lg bg-gray-100 font-bold text-gray-700 hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="text-base font-bold text-brand-navy">{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren(children + 1)}
                        className="h-8 w-8 rounded-lg bg-gray-100 font-bold text-gray-700 hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="flex items-center gap-2 rounded-xl bg-brand-navy px-6 py-3 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-md"
                  >
                    <span>Next: Style & Budget</span>
                    <ArrowRight className="h-4 w-4 text-amber-400" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Style, Accommodations & Budget */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-brand-navy">
                    Travel Style & Accommodation Preference
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Select your preferred tier so we propose matching properties.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-2">
                    Primary Travel Style
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {TRAVEL_STYLES.slice(0, 6).map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setTravelStyle(style.id)}
                        className={`rounded-xl border p-3.5 text-left transition-all ${
                          travelStyle === style.id
                            ? 'border-brand-navy bg-brand-navy text-white shadow-md'
                            : 'border-gray-200 bg-gray-50 text-gray-800 hover:border-gray-400'
                        }`}
                      >
                        <span className="block text-xs font-bold">{style.name}</span>
                        <span className="text-[10px] opacity-75 mt-0.5 block">{style.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Preferred Accommodation Tier
                    </label>
                    <select
                      value={accommodation}
                      onChange={(e) => setAccommodation(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs font-medium text-gray-800 focus:border-amber-500 focus:bg-white focus:outline-none"
                    >
                      <option>5-Star Luxury Palaces / Resorts</option>
                      <option>4-Star Superior Boutique Properties</option>
                      <option>Private Pool Villas & Overwater Bungalows</option>
                      <option>Heritage Havelis & Luxury Houseboats</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Estimated Overall Budget (INR)
                    </label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs font-medium text-gray-800 focus:border-amber-500 focus:bg-white focus:outline-none"
                    >
                      <option value="75000">₹75,000 – ₹1,25,000 (Domestic Short)</option>
                      <option value="150000">₹1,25,000 – ₹2,50,000 (Luxury Domestic / SE Asia)</option>
                      <option value="350000">₹2,50,000 – ₹5,00,000 (Europe / Maldives)</option>
                      <option value="600000">₹5,00,000+ (Ultra Luxury & Custom)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="flex items-center gap-2 rounded-xl bg-brand-navy px-6 py-3 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-md"
                  >
                    <span>Next: Review & Contact</span>
                    <ArrowRight className="h-4 w-4 text-amber-400" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Contact & Review */}
            {currentStep === 4 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-brand-navy">
                    Where should we send your customized proposal?
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Provide your contact details so our Pune travel specialists can deliver your itemized itinerary.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Vikram Joshi"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs font-medium text-gray-800 focus:border-amber-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vikram@example.com"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs font-medium text-gray-800 focus:border-amber-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      WhatsApp / Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98220 12345"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs font-medium text-gray-800 focus:border-amber-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Special Inclusions / Requests (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="e.g. Pure vegetarian meals required, wedding anniversary celebration, wheelchair accessibility..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs font-medium text-gray-800 focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Summary Box */}
                <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 text-xs text-gray-700 space-y-1">
                  <span className="font-bold text-brand-navy block uppercase text-[10px] tracking-wider">
                    Itinerary Request Summary:
                  </span>
                  <p>
                    <strong>Destination:</strong> {destination} | <strong>From:</strong> {departureCity}
                  </p>
                  <p>
                    <strong>Party:</strong> {adults} Adults, {children} Children | <strong>Style:</strong> {travelStyle}
                  </p>
                  <p>
                    <strong>Accommodation:</strong> {accommodation}
                  </p>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-3.5 text-xs font-bold text-white transition-all hover:bg-primary-700 shadow-lg disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    <span>{submitting ? 'Submitting to CRM...' : 'Submit Trip Plan to Pune Desk'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
