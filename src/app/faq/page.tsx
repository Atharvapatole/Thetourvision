import React from 'react';
import Link from 'next/link';
import { HelpCircle, Sparkles, ArrowRight } from 'lucide-react';
import WhatsAppButton from '@/components/shared/WhatsAppButton';

export const metadata = {
  title: 'Frequently Asked Questions | The Tour Vision Pune',
  description: 'Everything you need to know about booking bespoke travel with The Tour Vision in Pune.',
};

export default function FAQPage() {
  const faqs = [
    {
      q: 'How does The Tour Vision customize private travel packages?',
      a: 'We begin with a personal consultation—either at our Pune office, via video call, or over WhatsApp. We understand your party size, preferred pace, dietary preferences, and accommodation taste. We then build an itemized itinerary with vetted 4-star superior or 5-star palace hotels, dedicated private chauffeurs, and verified sightseeing vouchers.',
    },
    {
      q: 'Can flights and train connections from Pune and Mumbai be included?',
      a: 'Yes. We routinely arrange direct express highway transfers between Pune and Mumbai International Airport (BOM), as well as flights departing directly from Pune Airport (PNQ). International flight tickets and travel insurance can be bundled transparently into your quotation.',
    },
    {
      q: 'Are your listed prices per person or per couple?',
      a: 'Unless stated otherwise, our package prices are quoted on a per-person twin-sharing basis in Indian Rupees (INR). Final itemized quotations clearly disclose all GST taxes, accommodation breakdown, and private vehicle charges without hidden surcharges.',
    },
    {
      q: 'What is your booking confirmation and payment policy?',
      a: 'Upon reviewing and approving your custom proposal, a 30% to 50% advance deposit is required to confirm hotel reservations and lock private fleet schedules. Balance payments are payable 15 to 21 days before departure. Payment status is tracked with complete transparency in your Customer Portal.',
    },
    {
      q: 'What support do you provide while we are traveling?',
      a: 'All travelers receive access to our 24x7 Pune operations helpline and a direct dedicated WhatsApp concierge. If flights are rescheduled or weather alters mountain conditions (such as Gulmarg or Swiss cable cars), our operations team coordinates immediate adjustments on the ground.',
    },
    {
      q: 'Do you arrange pure-vegetarian, Jain, or special dietary meals?',
      a: 'Absolutely. We coordinate directly with our partner hotels and private houseboats in Kashmir, Switzerland, Bali, and Rajasthan to ensure customized culinary arrangements, including pure-vegetarian, Jain, and kid-friendly meals.',
    },
  ];

  return (
    <div className="bg-[#fcfaf7] min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1 text-xs font-semibold text-amber-900 mb-3">
            <HelpCircle className="h-3.5 w-3.5 text-amber-600" />
            <span>CLARITY & TRANSPARENCY</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brand-navy">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-sm text-gray-600 font-light">
            Answers to common questions about planning, payment, and travel with The Tour Vision Pune.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h3 className="font-serif text-base sm:text-lg font-bold text-brand-navy">
                {f.q}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
                {f.a}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-amber-200 bg-amber-50/60 p-8 text-center">
          <h3 className="font-serif text-xl font-bold text-brand-navy">
            Have a Specific Question for Our Pune Desk?
          </h3>
          <p className="text-xs text-gray-600 mt-1 max-w-md mx-auto">
            Our destination managers are available to clarify visa formalities, flight connections, and season timings.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <WhatsAppButton
              variant="inline"
              label="Ask Us on WhatsApp"
              className="py-2.5 px-4 text-xs"
            />
            <Link
              href="/contact"
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Contact Office
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
