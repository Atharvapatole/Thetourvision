import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Calendar, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const metadata = {
  title: 'Travel Journal & Destination Guides | The Tour Vision Pune',
  description: 'Editorial travel advice, packing tips, and destination inspiration curated for Indian voyagers by The Tour Vision.',
};

export default function BlogPage() {
  const articles = [
    {
      title: 'The Ultimate Guide to Planning a Swiss Alps Vacation from Pune',
      slug: 'ultimate-guide-swiss-alps-vacation-from-pune',
      excerpt: 'Discover the best flight connections from Mumbai and Pune, Swiss Travel Pass strategies, mountain excursions, and vegetarian dining tips for Swiss journeys.',
      coverImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
      category: 'Europe Travel Guide',
      readingTime: 6,
      date: '2026-03-15',
    },
    {
      title: 'Top 5 Royal Palaces to Experience in Rajasthan This Winter',
      slug: 'top-5-royal-palaces-rajasthan-winter',
      excerpt: 'From the shimmering waters of Lake Pichola in Udaipur to the golden fortress of Jaisalmer, immerse yourself in India’s most regal historical destinations.',
      coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      category: 'Heritage Travel',
      readingTime: 5,
      date: '2026-02-28',
    },
    {
      title: 'A Discerning Voyager’s Guide to Kashmir Houseboats & Gulmarg Gondola',
      slug: 'guide-kashmir-houseboats-and-gulmarg-gondola',
      excerpt: 'How to choose a verified cedar houseboat on Dal Lake, timing Gulmarg Phase 2 tickets, and experiencing authentic Kashmiri Wazwan dining in Srinagar.',
      coverImage: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80',
      category: 'Himalayan Escapes',
      readingTime: 5,
      date: '2026-01-20',
    },
  ];

  return (
    <div className="bg-[#fcfaf7] min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1 text-xs font-semibold text-amber-900 mb-3">
            <BookOpen className="h-3.5 w-3.5 text-amber-600" />
            <span>THE TOUR VISION JOURNAL</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brand-navy">
            Travel Editorial & Guides
          </h1>
          <p className="mt-3 text-sm text-gray-600 font-light">
            In-depth guides, curated recommendations, and insider travel tips penned by our Pune destination specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <Link
              key={art.slug}
              href={`/blog/${art.slug}`}
              className="group flex flex-col rounded-3xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
                <Image
                  src={art.coverImage}
                  alt={art.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 rounded-full bg-brand-navy/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-amber-300">
                  {art.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{art.readingTime} min read</span>
                    </span>
                    <span>•</span>
                    <span>{formatDate(art.date)}</span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-brand-navy group-hover:text-primary-700 transition-colors leading-snug">
                    {art.title}
                  </h3>
                  <p className="mt-2 text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-primary-700">
                  <span>Read Article</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
