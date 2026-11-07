import React from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata = {
  title: 'Terms of Service | The Tour Vision Pune',
  description: 'Booking terms and conditions for The Tour Vision, Pune, Maharashtra.',
};

export default function TermsPage() {
  return (
    <div className="bg-[#fcfaf7] min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto rounded-3xl border border-gray-200 bg-white p-8 sm:p-12 shadow-sm space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed font-light">
        <div className="border-b border-gray-100 pb-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 mb-2">
            <FileText className="h-4 w-4 text-amber-600" />
            <span>TERMS OF ENGAGEMENT</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-brand-navy">
            Terms of Service
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            The Tour Vision • Pune, Maharashtra, India
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-brand-navy">
            1. Scope of Representation & Booking Quotes
          </h2>
          <p>
            The Tour Vision acts as an authorized travel concierge curating private transportation, hotel accommodations, guide services, and excursion vouchers. All quotations issued represent estimates valid for 7 days from issue date. Room categories, flight seat allocations, and private vehicle availability are confirmed strictly upon receipt of advance deposit.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-brand-navy">
            2. Currency & Pricing Integrity
          </h2>
          <p>
            All standard billing is calculated in Indian Rupees (INR) with applicable Goods and Services Tax (5% GST for tour operators) clearly delineated on client proposals. No retroactive fuel surcharges will be applied after final voucher issuance.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-brand-navy">
            3. Traveler Responsibilities
          </h2>
          <p>
            Travelers are responsible for maintaining valid passports (minimum 6 months validity for international departures), obtaining required consular visas, and adhering to destination check-in protocols.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-brand-navy">
            4. Force Majeure & Weather
          </h2>
          <p>
            The Tour Vision shall not be liable for itinerary disruptions caused by adverse weather, alpine avalanche warnings, governmental border closures, or airline flight cancellations. In such events, our Pune operations desk will coordinate alternative accommodations and reschedule activities.
          </p>
        </section>
      </div>
    </div>
  );
}
