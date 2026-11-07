'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, Plus, Download, Search, CheckCircle, 
  Clock, XCircle, ArrowUpRight 
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency, formatDate } from '@/lib/utils';
import { generateQuotationPDF } from '@/lib/pdf/quotation';

export default function AdminQuotationsListPage() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('quotations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setQuotations(data);
      }
    } catch (err) {
      console.error('Error fetching quotations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const downloadQuotation = async (q: any) => {
    const doc = generateQuotationPDF({
      quotationNumber: q.quotation_number,
      customerName: q.customer_name,
      customerEmail: q.customer_email,
      customerPhone: q.customer_phone,
      departureCity: q.departure_city,
      destinationName: q.destination_name,
      startDate: q.start_date,
      endDate: q.end_date,
      adults: q.adults,
      children: q.children,
      items: [
        {
          title: `Comprehensive Curated Journey to ${q.destination_name}`,
          description: 'Accommodations, private chauffeur transfers, and guided sightseeing',
          quantity: 1,
          unitPrice: q.subtotal,
          totalPrice: q.subtotal,
        },
      ],
      subtotal: q.subtotal,
      taxRate: q.tax_rate,
      taxAmount: q.tax_amount,
      discountAmount: q.discount_amount,
      totalAmount: q.total_amount,
      validUntil: q.valid_until,
    });
    doc.save(`${q.quotation_number}_TheTourVision.pdf`);
  };

  const filtered = quotations.filter((q) => {
    const s = search.toLowerCase();
    return (
      q.quotation_number?.toLowerCase().includes(s) ||
      q.customer_name?.toLowerCase().includes(s) ||
      q.destination_name?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-navy">
            Quotation & Proposal Management
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Review sent proposals, accepted bids, and download official PDF records.
          </p>
        </div>

        <Link
          href="/admin/quotations/new"
          className="flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-xs font-bold text-white hover:bg-primary-700 shadow-sm self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Quotation</span>
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by quote #, client, or destination..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-xs font-medium text-gray-800 placeholder-gray-400 focus:border-amber-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Quote #</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Destination</th>
                <th className="py-3 px-4 font-semibold">Total Amount</th>
                <th className="py-3 px-4 font-semibold">Valid Until</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filtered.length > 0 ? (
                filtered.map((q) => (
                  <tr key={q.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary-700">
                      {q.quotation_number}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-gray-900 block">{q.customer_name}</span>
                      <span className="text-[10px] text-gray-400">{q.customer_phone}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-800">
                      {q.destination_name}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-brand-navy">
                      {formatCurrency(q.total_amount, q.currency)}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      {formatDate(q.valid_until)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          q.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : q.status === 'sent'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => downloadQuotation(q)}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                      >
                        <Download className="h-3 w-3 text-primary-600" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-gray-400">
                    No quotations generated yet. Click &quot;New Quotation&quot; above to craft one.
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
