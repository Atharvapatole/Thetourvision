import React from 'react';
import Link from 'next/link';
import { Star, ShieldCheck, Heart, Sparkles, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Customer Testimonials | The Tour Vision Pune',
  description: 'Read verified testimonials from travelers across Pune and Maharashtra who experienced bespoke holidays with The Tour Vision.',
};

export default function TestimonialsPage() {
  const testimonials = [
    {
      name: 'Dr. Rajesh & Sunita Kulkarni',
      location: 'Kothrud, Pune',
      destination: 'Kashmir Paradise Odyssey',
      date: 'October 2025',
      rating: 5,
      review:
        'Our anniversary trip to Kashmir was simply magical. The team at The Tour Vision took care of every tiny detail—from our warm greeting at Srinagar airport to the romantic sunset Shikara ride and first-class gondola tickets in Gulmarg. Highly recommend their Pune team!',
    },
    {
      name: 'Sameer & Priya Deshmukh',
      location: 'Baner, Pune',
      destination: 'Swiss Alpine Dreams',
      date: 'September 2025',
      rating: 5,
      review:
        'We booked the 8-day Switzerland tour for our family. The Swiss Travel Pass recommendations, hotel locations right beside railway stations, and the breathtaking Jungfraujoch journey made traveling completely stress-free with two young kids. Professional and trustworthy!',
    },
    {
      name: 'Vikramaditya Shinde',
      location: 'Viman Nagar, Pune',
      destination: 'Royal Rajasthan Heritage',
      date: 'December 2025',
      rating: 5,
      review:
        'Staying at heritage properties in Udaipur and Jaipur felt truly royal. Our driver was punctual and courteous, and the private boat ride on Lake Pichola during golden hour was unforgettable. Thank you, The Tour Vision!',
    },
    {
      name: 'Adv. Neha & Amit Patil',
      location: 'Model Colony, Pune',
      destination: 'Bali Private Pool Ocean Villa',
      date: 'August 2025',
      rating: 5,
      review:
        'Our honeymoon in Bali was everything we hoped for and more. The floating breakfast in Seminyak and the jungle swing in Ubud were highlights. Having a dedicated WhatsApp helpline gave us complete peace of mind throughout the journey.',
    },
  ];

  return (
    <div className="bg-[#fcfaf7] min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1 text-xs font-semibold text-amber-900 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>AUTHENTIC CLIENT EXPERIENCES</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brand-navy">
            Voyager Testimonials
          </h1>
          <p className="mt-3 text-sm text-gray-600 font-light">
            Real feedback from discerning travelers who experienced curated journeys with The Tour Vision Pune.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Verified Voyager
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                  "{t.review}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-sm font-bold text-brand-navy">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    {t.location} • <strong className="text-primary-700">{t.destination}</strong>
                  </p>
                </div>
                <span className="text-[10px] text-gray-400">{t.date}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-brand-navy text-white p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-xl">
          <h3 className="font-serif text-2xl font-bold">
            Ready to Begin Your Milestone Journey?
          </h3>
          <p className="text-xs text-gray-300 mt-2 max-w-md mx-auto">
            Let our Pune travel concierge craft a personalized vacation tailored to your pace and preferences.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/trip-planner"
              className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-xs font-bold text-white hover:bg-primary-700 transition-colors shadow-md"
            >
              <span>Launch Smart Trip Planner</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
