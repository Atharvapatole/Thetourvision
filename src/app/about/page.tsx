import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Compass, ShieldCheck, Heart, Award, 
  MapPin, CheckCircle, ArrowRight, Sparkles 
} from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata = {
  title: 'About Us | The Tour Vision Pune',
  description: 'Learn about The Tour Vision, Pune’s luxury travel agency curating bespoke journeys across India and the globe.',
};

export default function AboutPage() {
  return (
    <div className="bg-[#fcfaf7] min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Editorial Story Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 border border-amber-300/60 px-3.5 py-1 text-xs font-semibold text-amber-900 mb-4">
            <Compass className="h-3.5 w-3.5" />
            <span>OUR HERITAGE & PHILOSOPHY</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-navy leading-tight">
            Crafting Milestones, Not Just Vacations
          </h1>
          <p className="mt-4 text-base text-gray-600 font-light leading-relaxed">
            Headquartered in the cultural heart of Pune, Maharashtra, <strong>The Tour Vision</strong> was conceived with a single guiding ambition: to elevate Indian leisure travel into an art form of unmatched elegance, authenticity, and peace of mind.
          </p>
        </div>

        {/* Narrative Section with Imagery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-sm text-gray-700 leading-relaxed font-light">
            <h2 className="font-serif text-3xl font-bold text-brand-navy leading-snug">
              Bespoke Luxury for Discerning Travelers
            </h2>
            <p>
              In an era dominated by automated ticket algorithms and crowded tour buses, The Tour Vision reclaims the romance of classic travel. Every itinerary begins with an intimate conversation with our Pune destination specialists—discovering whether your heart desires the whispering pines of Pahalgam, the golden ramparts of Udaipur, the glacier heights of Jungfraujoch, or a private beachfront pool villa in Bali.
            </p>
            <p>
              We hand-verify our partner properties, negotiate preferred privileges for our guests, and furnish private air-conditioned fleets with seasoned chauffeurs who take pride in their craft.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4 text-xs font-semibold text-brand-navy">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Pune Concierge Desk</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Verified 4 & 5-Star Stays</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Transparent Itemized Billing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>24x7 Emergency Assistance</span>
              </div>
            </div>
          </div>

          <div className="relative h-96 w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
            <Image
              src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80"
              alt="Luxury Heritage Palace Travel"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Agency Developer & Engineering Standards Callout */}
        <div className="rounded-3xl bg-brand-navy text-white p-8 sm:p-12 shadow-xl border border-amber-400/20">
          <div className="max-w-3xl">
            <span className="text-amber-400 font-bold uppercase tracking-wider text-xs flex items-center gap-1.5">
              <Award className="h-4 w-4" />
              <span>Technology & Platform Architecture</span>
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold mt-2">
              Engineered by Automate Stack
            </h3>
            <p className="mt-3 text-sm text-gray-300 leading-relaxed font-light">
              This digital operations platform was custom-engineered by <strong>Automate Stack</strong> as a personalized showcase of next-generation travel technology. Incorporating Supabase PostgreSQL, cryptographic Row Level Security, transactional PDF compilation, and serverless AI orchestration, it proves how sophisticated software streamlines high-touch agency operations.
            </p>
            <div className="mt-6 flex items-center gap-4 text-xs text-amber-200">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Supabase PostgreSQL Backend</span>
              </span>
              <span>•</span>
              <span>Next.js 15 App Router</span>
              <span>•</span>
              <span>Vercel Optimized</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
