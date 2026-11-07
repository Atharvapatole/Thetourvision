'use client';

import React, { useState } from 'react';
import { Star, CheckCircle, XCircle, Trash2, Plus } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'Dr. Rajesh & Sunita Kulkarni',
      city: 'Kothrud, Pune',
      destination: 'Kashmir Paradise Odyssey',
      rating: 5,
      comment: 'Our anniversary trip to Kashmir was simply magical. The team at The Tour Vision took care of every tiny detail.',
      is_published: true,
      is_featured: true,
    },
    {
      id: 2,
      name: 'Sameer & Priya Deshmukh',
      city: 'Baner, Pune',
      destination: 'Swiss Alpine Dreams',
      rating: 5,
      comment: 'We booked the 8-day Switzerland tour for our family. The Swiss Travel Pass recommendations were invaluable.',
      is_published: true,
      is_featured: true,
    },
    {
      id: 3,
      name: 'Vikramaditya Shinde',
      city: 'Viman Nagar, Pune',
      destination: 'Royal Rajasthan Heritage',
      rating: 5,
      comment: 'Staying at heritage properties in Udaipur and Jaipur felt truly royal. Unmatched service!',
      is_published: true,
      is_featured: true,
    },
  ]);

  const togglePublish = (id: number) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, is_published: !r.is_published } : r)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-brand-navy">
          Review Moderation & Testimonials
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Approve, feature, or manage customer reviews visible on the public website.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Traveler</th>
                <th className="py-3 px-4 font-semibold">Destination</th>
                <th className="py-3 px-4 font-semibold">Rating</th>
                <th className="py-3 px-4 font-semibold">Comment</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-gray-900 block">{r.name}</span>
                    <span className="text-[10px] text-gray-400">{r.city}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-gray-800">
                    {r.destination}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex text-amber-400">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs text-gray-600 line-clamp-2">
                    {r.comment}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                        r.is_published
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {r.is_published ? 'Published' : 'Hidden'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => togglePublish(r.id)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                        r.is_published
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      }`}
                    >
                      {r.is_published ? 'Hide' : 'Approve'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
