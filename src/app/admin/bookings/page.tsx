'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, Search, Filter, Calendar, MapPin, 
  IndianRupee, Check, AlertCircle, Clock 
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { BookingStatus, PaymentStatus } from '@/types/database';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setBookings(data);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (
    bookingId: string,
    field: 'booking_status' | 'payment_status',
    newVal: string
  ) => {
    setUpdating(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('bookings')
        .update({ [field]: newVal })
        .eq('id', bookingId);

      if (!error) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, [field]: newVal } : b))
        );
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const filtered = bookings.filter((b) => {
    const s = search.toLowerCase();
    return (
      b.booking_reference?.toLowerCase().includes(s) ||
      b.customer_name?.toLowerCase().includes(s) ||
      b.customer_email?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-brand-navy">
          Booking & Traveler Operations
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Track confirmed departures, passenger rosters, and real payment states.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by booking ref, traveler name..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-xs font-medium text-gray-800 placeholder-gray-400 focus:border-amber-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Ref #</th>
                <th className="py-3 px-4 font-semibold">Traveler</th>
                <th className="py-3 px-4 font-semibold">Travel Window</th>
                <th className="py-3 px-4 font-semibold">Total Amount</th>
                <th className="py-3 px-4 font-semibold">Booking State</th>
                <th className="py-3 px-4 font-semibold">Payment State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filtered.length > 0 ? (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary-700">
                      {b.booking_reference}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-gray-900 block">{b.customer_name}</span>
                      <span className="text-[10px] text-gray-400">{b.customer_phone}</span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {formatDate(b.start_date)} – {formatDate(b.end_date)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-brand-navy">
                      {formatCurrency(b.total_amount, b.currency)}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        disabled={updating}
                        value={b.booking_status}
                        onChange={(e) => handleUpdateStatus(b.id, 'booking_status', e.target.value)}
                        className="rounded-lg border border-gray-300 p-1 text-[11px] font-semibold text-gray-800 focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        disabled={updating}
                        value={b.payment_status}
                        onChange={(e) => handleUpdateStatus(b.id, 'payment_status', e.target.value)}
                        className="rounded-lg border border-gray-300 p-1 text-[11px] font-semibold text-gray-800 focus:outline-none"
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="pending">Pending</option>
                        <option value="partially_paid">Partially Paid</option>
                        <option value="paid">Paid</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-gray-400">
                    No confirmed bookings logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
