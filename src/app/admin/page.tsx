'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, CheckCircle2, TrendingUp, IndianRupee, 
  Package, MapPin, RefreshCw, FileText, ArrowUpRight, 
  Calendar, Clock, ShieldCheck 
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>({
    totalInquiries: 0,
    newInquiries: 0,
    qualifiedLeads: 0,
    quotationsSent: 0,
    confirmedBookings: 0,
    totalBookingValue: 0,
    paidRevenue: 0,
    conversionRate: 0,
    recentInquiries: [],
    recentBookings: [],
    destinationStats: [],
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const supabase = createClient();

      // 1. Inquiries Queries
      const { data: allInquiries } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      // 2. Bookings Queries
      const { data: allBookings } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      // 3. Quotations Queries
      const { data: allQuotations } = await supabase
        .from('quotations')
        .select('*');

      const inquiriesList = allInquiries || [];
      const bookingsList = allBookings || [];
      const quotationsList = allQuotations || [];

      const totalInquiries = inquiriesList.length;
      const newInquiries = inquiriesList.filter((i) => i.status === 'new').length;
      const qualifiedLeads = inquiriesList.filter((i) => i.status === 'qualified').length;
      const quotationsSent = quotationsList.filter((q) => q.status === 'sent').length;

      const confirmedBookings = bookingsList.filter((b) => b.booking_status === 'confirmed').length;
      const totalBookingValue = bookingsList.reduce((acc, b) => acc + Number(b.total_amount || 0), 0);
      const paidRevenue = bookingsList.reduce((acc, b) => acc + Number(b.paid_amount || 0), 0);

      const conversionRate = totalInquiries > 0
        ? Math.round((confirmedBookings / totalInquiries) * 100)
        : 0;

      // Group inquiries by destination
      const destMap: { [key: string]: number } = {};
      inquiriesList.forEach((inq) => {
        const dest = inq.destination_name || 'Bespoke / Custom';
        destMap[dest] = (destMap[dest] || 0) + 1;
      });
      const destinationStats = Object.entries(destMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setMetrics({
        totalInquiries,
        newInquiries,
        qualifiedLeads,
        quotationsSent,
        confirmedBookings,
        totalBookingValue,
        paidRevenue,
        conversionRate,
        recentInquiries: inquiriesList.slice(0, 5),
        recentBookings: bookingsList.slice(0, 5),
        destinationStats,
      });
    } catch (error) {
      console.error('Error loading admin dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-navy">
            Operations & Performance Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time business telemetry generated directly from Supabase PostgreSQL tables.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Records</span>
          </button>
          <Link
            href="/admin/quotations/new"
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-xs font-bold text-white hover:bg-primary-700 transition-colors shadow-sm"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Create Quotation</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Total Leads & Inquiries</span>
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-brand-navy">{metrics.totalInquiries}</span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {metrics.newInquiries} New
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Captured across Web, Planner & WhatsApp</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Recorded Booking Value</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <IndianRupee className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-brand-navy">
              {formatCurrency(metrics.totalBookingValue)}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            Verified Paid: <strong className="text-emerald-700">{formatCurrency(metrics.paidRevenue)}</strong>
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Confirmed Bookings</span>
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-brand-navy">{metrics.confirmedBookings}</span>
            <span className="text-xs text-gray-500">trips</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Active travel operations</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Conversion Rate</span>
            <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-brand-navy">{metrics.conversionRate}%</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Inquiries converted to confirmed travel</p>
        </div>
      </div>

      {/* Two Column Layout: Recent Leads & Popular Destinations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Inquiries (2 Columns) */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-brand-navy">
                Recent CRM Inquiries
              </h3>
              <p className="text-xs text-gray-500">Latest voyagers inquiring for bespoke travel</p>
            </div>
            <Link
              href="/admin/inquiries"
              className="text-xs font-bold text-primary-700 hover:underline flex items-center gap-1"
            >
              <span>Manage CRM Pipeline</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {metrics.recentInquiries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 font-semibold">Ref #</th>
                    <th className="py-2.5 font-semibold">Voyager</th>
                    <th className="py-2.5 font-semibold">Destination</th>
                    <th className="py-2.5 font-semibold">Status</th>
                    <th className="py-2.5 font-semibold text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-gray-700">
                  {metrics.recentInquiries.map((inq: any) => (
                    <tr key={inq.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 font-mono font-bold text-primary-700">
                        {inq.inquiry_number}
                      </td>
                      <td className="py-3">
                        <span className="font-semibold text-gray-900 block">{inq.customer_name}</span>
                        <span className="text-[10px] text-gray-400">{inq.phone}</span>
                      </td>
                      <td className="py-3 font-medium text-gray-800">
                        {inq.destination_name || 'Bespoke'}
                      </td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                            inq.status === 'new'
                              ? 'bg-blue-100 text-blue-800'
                              : inq.status === 'qualified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inq.status === 'quotation_sent'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {inq.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 text-right text-gray-400">
                        {formatDate(inq.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-gray-400">
              No inquiries registered yet. Run seed data or submit via public portal.
            </div>
          )}
        </div>

        {/* Popular Destinations Breakdown */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-brand-navy mb-1">
            Top Requested Destinations
          </h3>
          <p className="text-xs text-gray-500 mb-6">Inquiry distribution by destination</p>

          {metrics.destinationStats.length > 0 ? (
            <div className="space-y-4">
              {metrics.destinationStats.map((item: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                    <span>{item.name}</span>
                    <span className="text-primary-700 font-bold">{item.count} leads</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-primary-600 rounded-full"
                      style={{
                        width: `${Math.min(100, (item.count / (metrics.totalInquiries || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-gray-400">
              Awaiting destination inquiries.
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-gray-100">
            <Link
              href="/admin/destinations"
              className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              <MapPin className="h-3.5 w-3.5 text-primary-600" />
              <span>Manage Destination Catalog</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
