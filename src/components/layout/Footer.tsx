import React from 'react';
import Link from 'next/link';
import { 
  MapPin, Phone, Mail, Clock, ShieldCheck, 
  Heart, Sparkles, Send 
} from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-gray-300 border-t border-white/10">
      {/* Upper Newsletter & Consultation CTA */}
      <div className="border-b border-white/10 bg-black/20 py-10 px-4 sm:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-amber-400 font-semibold tracking-wider text-xs uppercase flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Exclusive Travel Dispatch</span>
            </span>
            <h3 className="text-2xl font-serif font-bold text-white mt-1">
              Receive Curated Seasonal Itineraries & Private Offers
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Curated by our Pune travel advisors for discerning Indian voyagers.
            </p>
          </div>
          <form className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 w-full sm:w-80"
              required
            />
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-500 whitespace-nowrap shadow-md"
            >
              <span>Subscribe</span>
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Pune HQ */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-wider text-white">
                THE TOUR VISION
              </span>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-amber-400 font-semibold mt-0.5">
                Bespoke Journeys • Pune
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-400 max-w-md">
              The Tour Vision is Pune’s premier travel boutique curating bespoke international getaways, royal Indian palace heritage trails, and honeymoon sanctuaries with white-glove concierge precision.
            </p>

            <div className="mt-6 space-y-2.5 text-xs text-gray-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                <span>{SITE_CONFIG.location}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                <span>{SITE_CONFIG.phone} / {SITE_CONFIG.emergencyHelpline} (24x7)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                <span>{SITE_CONFIG.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                <span>{SITE_CONFIG.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Featured Destinations */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-serif">
              Top Destinations
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/destinations/kashmir-paradise-on-earth" className="hover:text-amber-300 transition-colors">
                  Kashmir (Houseboats & Gulmarg)
                </Link>
              </li>
              <li>
                <Link href="/destinations/royal-rajasthan" className="hover:text-amber-300 transition-colors">
                  Rajasthan (Udaipur & Jaipur)
                </Link>
              </li>
              <li>
                <Link href="/destinations/kerala-gods-own-country" className="hover:text-amber-300 transition-colors">
                  Kerala (Alleppey Backwaters)
                </Link>
              </li>
              <li>
                <Link href="/destinations/switzerland-alps" className="hover:text-amber-300 transition-colors">
                  Switzerland & Swiss Alps
                </Link>
              </li>
              <li>
                <Link href="/destinations/bali-indonesia" className="hover:text-amber-300 transition-colors">
                  Bali (Forest Villas & Beaches)
                </Link>
              </li>
              <li>
                <Link href="/destinations/dubai-uae" className="hover:text-amber-300 transition-colors">
                  Dubai & Arabian Deserts
                </Link>
              </li>
            </ul>
          </div>

          {/* Travel Categories */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-serif">
              Curated Styles
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/packages?category=honeymoon-and-romance" className="hover:text-amber-300 transition-colors">
                  Honeymoon & Romance
                </Link>
              </li>
              <li>
                <Link href="/packages?category=luxury-escapes" className="hover:text-amber-300 transition-colors">
                  5-Star Luxury Escapes
                </Link>
              </li>
              <li>
                <Link href="/packages?category=family-vacations" className="hover:text-amber-300 transition-colors">
                  Family Holiday Packages
                </Link>
              </li>
              <li>
                <Link href="/trip-planner" className="hover:text-amber-300 transition-colors">
                  Smart Trip Planner
                </Link>
              </li>
              <li>
                <Link href="/ai-travel-assistant" className="hover:text-amber-300 transition-colors">
                  AI Travel Concierge
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-amber-300 transition-colors">
                  Travel Editorial & Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Portal & Security */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-serif">
              Voyager Services
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/account" className="hover:text-amber-300 transition-colors">
                  Customer Portal
                </Link>
              </li>
              <li>
                <Link href="/account/inquiries" className="hover:text-amber-300 transition-colors">
                  Track My Inquiries
                </Link>
              </li>
              <li>
                <Link href="/account/bookings" className="hover:text-amber-300 transition-colors">
                  Confirmed Bookings & Vouchers
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="hover:text-amber-300 transition-colors">
                  Customer Testimonials
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-amber-300 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/cancellation-policy" className="hover:text-amber-300 transition-colors">
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-amber-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-amber-300 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar & Credits */}
        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>
            © {new Date().getFullYear()} The Tour Vision, Pune, Maharashtra. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-gray-300">
            <span>Crafted & engineered by</span>
            <span className="font-semibold text-amber-400">Automate Stack</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Supabase RLS Protected</span>
            </span>
            <span>•</span>
            <span>INR Default Currency</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
