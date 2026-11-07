import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata = {
  title: 'Privacy Policy | The Tour Vision Pune',
  description: 'Privacy policy and data governance practices of The Tour Vision, Pune, Maharashtra.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#fcfaf7] min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto rounded-3xl border border-gray-200 bg-white p-8 sm:p-12 shadow-sm space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed font-light">
        <div className="border-b border-gray-100 pb-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 mb-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>DATA GOVERNANCE</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-brand-navy">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Last Updated: 2026 • The Tour Vision, Pune, Maharashtra, India
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-brand-navy">
            1. Information Collection & Usage
          </h2>
          <p>
            The Tour Vision collects customer information necessary for tailoring vacation packages, securing hotel reservations, issuing vouchers, arranging private chauffeur vehicles, and delivering customer service. This includes name, phone number, email address, passenger roster, and dietary requirements.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-brand-navy">
            2. Row Level Security & Document Confidentiality
          </h2>
          <p>
            All traveler records and private identity documents (such as passports, flight e-tickets, and booking confirmation vouchers) are stored within private Supabase Storage buckets guarded by PostgreSQL Row Level Security (RLS). They are never publicly accessible and can only be inspected by the authenticated customer and authorized agency staff.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-brand-navy">
            3. Third-Party Disclosures
          </h2>
          <p>
            We share traveler information strictly with verified hospitality providers (hotels, airlines, and licensed local transport partners) solely for fulfilling confirmed travel bookings. We do not sell, rent, or monetize your contact information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-brand-navy">
            4. Contacting Our Data Officer
          </h2>
          <p>
            For inquiries regarding your stored personal records or to request profile updates, please reach out to:
            <br />
            <strong>The Tour Vision Concierge</strong>
            <br />
            {SITE_CONFIG.location}
            <br />
            Email: {SITE_CONFIG.email}
          </p>
        </section>
      </div>
    </div>
  );
}
