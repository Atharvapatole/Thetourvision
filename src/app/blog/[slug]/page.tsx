import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, Share2, Sparkles } from 'lucide-react';
import WhatsAppButton from '@/components/shared/WhatsAppButton';

export default async function BlogPostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <div className="bg-[#fcfaf7] min-h-screen py-16 px-4 sm:px-8">
      <article className="max-w-3xl mx-auto space-y-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Travel Journal</span>
        </Link>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary-700 block mb-2">
            Editorial Guide • The Tour Vision Pune
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brand-navy leading-tight">
            The Ultimate Guide to Planning a Swiss Alps Vacation from Pune
          </h1>
          <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 pb-6 border-b border-gray-200">
            <span>By <strong>The Tour Vision Editorial Desk</strong></span>
            <span>•</span>
            <span>6 min read</span>
            <span>•</span>
            <span>Updated Seasonal Edition</span>
          </div>
        </div>

        <div className="relative h-[400px] w-full rounded-3xl overflow-hidden shadow-lg">
          <Image
            src="https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80"
            alt="Swiss Alps Travel Guide"
            fill
            className="object-cover"
          />
        </div>

        <div className="prose prose-amber max-w-none text-sm text-gray-700 leading-relaxed space-y-5 font-light">
          <p>
            Planning a journey to Switzerland from Pune has evolved dramatically over recent years. Discerning travelers from Koregaon Park, Baner, and Kothrud routinely seek European journeys that balance high-altitude alpine thrills with relaxed luxury and dietary comfort.
          </p>

          <h2 className="font-serif text-2xl font-bold text-brand-navy pt-4">
            1. Optimal Route Planning: Ex-Pune vs. Ex-Mumbai
          </h2>
          <p>
            While connecting domestic flights operate out of Pune Airport (PNQ) via Delhi or Bengaluru, the most seamless luxury option remains our chauffeured express transfer along the Mumbai-Pune Expressway to Mumbai Chhatrapati Shivaji Maharaj International Airport (BOM), where daily non-stop flights to Zurich (ZRH) depart via Swiss International Air Lines and Lufthansa.
          </p>

          <h2 className="font-serif text-2xl font-bold text-brand-navy pt-4">
            2. The Swiss Travel Pass Advantage
          </h2>
          <p>
            Unlike rental cars which can be stressful on alpine passes and restricted in car-free villages like Zermatt and Wengen, the Swiss Travel Pass provides unlimited first-class and second-class travel on panoramic express trains, public post-buses, and crystal-clear lake steamers across Lake Lucerne and Lake Brienz.
          </p>

          <h2 className="font-serif text-2xl font-bold text-brand-navy pt-4">
            3. Mount Titlis vs. Jungfraujoch: Which Mountain to Choose?
          </h2>
          <p>
            For travelers seeking perpetual snow activities and the world-first revolving Rotair gondola, Mount Titlis from Engelberg is unbeatable. For those desiring the historic grandeur of Europe’s highest railway station (11,333 feet) gazing upon the Aletsch Glacier, Jungfraujoch remains an unforgettable milestone.
          </p>

          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 text-xs text-amber-950 mt-8 space-y-2">
            <h4 className="font-bold text-amber-900 text-sm">
              Plan Your Swiss Vacation with Our Pune Concierge
            </h4>
            <p>
              The Tour Vision provides customized 7-to-12 day Swiss itineraries inclusive of 4-star superior hotels, Swiss Travel Passes, mountain excursion tickets, and Schengen visa documentation assistance.
            </p>
            <div className="pt-3">
              <WhatsAppButton
                variant="inline"
                label="WhatsApp Our Swiss Travel Specialist"
                prefilledText="Hello The Tour Vision Pune, I read your Swiss Alps guide and would like to inquire about customized vacation packages."
              />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
