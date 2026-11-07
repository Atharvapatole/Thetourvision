'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Package, Plus, Search, CheckCircle, XCircle, 
  Trash2, Edit, ExternalLink 
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { DEMO_PACKAGES } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<any[]>(DEMO_PACKAGES);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New package form state
  const [title, setTitle] = useState('');
  const [destinationName, setDestinationName] = useState('Kashmir');
  const [categoryName, setCategoryName] = useState('Luxury Escapes');
  const [days, setDays] = useState(6);
  const [nights, setNights] = useState(5);
  const [price, setPrice] = useState(38000);
  const [summary, setSummary] = useState('');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80'
  );

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('packages').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        setPackages(data);
      }
    } catch {
      // Fallback to DEMO_PACKAGES
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newPkg = {
      id: `p-${Date.now()}`,
      title,
      slug,
      destination_name: destinationName,
      category_name: categoryName,
      days,
      nights,
      price_inr: price,
      discounted_price_inr: Math.round(price * 0.9),
      summary,
      cover_image: coverImage,
      departure_city: 'Pune / Mumbai',
      accommodation_grade: '4-Star Superior / 5-Star Luxury',
      is_featured: true,
      is_published: true,
    };

    setPackages([newPkg, ...packages]);
    setShowAddModal(false);

    // Persist to Supabase if destinations exist
    try {
      const supabase = createClient();
      const { data: dest } = await supabase.from('destinations').select('id').limit(1).maybeSingle();
      if (dest) {
        await supabase.from('packages').insert({
          destination_id: dest.id,
          title,
          slug,
          summary,
          description: summary,
          days,
          nights,
          price_inr: price,
          discounted_price_inr: Math.round(price * 0.9),
          cover_image: coverImage,
          itinerary: [],
          is_featured: true,
          is_published: true,
        });
      }
    } catch {
      // Handled
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-navy">
            Package Catalog Management
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure vacation packages, day-wise itineraries, pricing tiers, and visibility.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-xs font-bold text-white hover:bg-primary-700 shadow-sm self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div className="relative h-48 w-full bg-gray-100">
              <Image
                src={pkg.cover_image}
                alt={pkg.title}
                fill
                className="object-cover"
              />
              <span className="absolute top-3 right-3 rounded-full bg-brand-navy/90 px-2.5 py-1 text-[11px] font-bold text-amber-300">
                {pkg.days}D / {pkg.nights}N
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-primary-700 uppercase tracking-wider block">
                  {pkg.destination_name}
                </span>
                <h3 className="font-serif text-base font-bold text-brand-navy mt-1">
                  {pkg.title}
                </h3>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                  {pkg.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-gray-400 block">Rate</span>
                  <span className="text-base font-bold text-brand-navy">
                    {formatCurrency(pkg.discounted_price_inr || pkg.price_inr)}
                  </span>
                </div>
                <a
                  href={`/packages/${pkg.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-brand-navy"
                >
                  <span>Preview</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Package Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="font-serif text-xl font-bold text-brand-navy mb-4">
              Add New Tour Package
            </h3>

            <form onSubmit={handleCreatePackage} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Package Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Royal Kashmir Snow Odyssey"
                  className="w-full rounded-xl border border-gray-200 p-2.5 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">
                    Destination *
                  </label>
                  <input
                    type="text"
                    required
                    value={destinationName}
                    onChange={(e) => setDestinationName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-2.5 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">
                    Category *
                  </label>
                  <select
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-2.5 focus:border-amber-500 focus:outline-none"
                  >
                    <option>Luxury Escapes</option>
                    <option>Honeymoon & Romance</option>
                    <option>Family Vacations</option>
                    <option>Adventure & Wildlife</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Days</label>
                  <input
                    type="number"
                    min="1"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-center"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Nights</label>
                  <input
                    type="number"
                    min="0"
                    value={nights}
                    onChange={(e) => setNights(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-center"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    min="1000"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-right font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Summary Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Evocative summary of the journey..."
                  className="w-full rounded-xl border border-gray-200 p-2.5 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-2.5 focus:border-amber-500 focus:outline-none text-[11px]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary-600 px-5 py-2 text-xs font-bold text-white hover:bg-primary-700"
                >
                  Create Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
