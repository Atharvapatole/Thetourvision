'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, MessageCircle, Phone, 
  Mail, Calendar, MapPin, Check, Clock, 
  ArrowRight, Download, Edit3, Trash2, Plus 
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { InquiryStatus } from '@/types/database';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [newNote, setNewNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      let query = supabase.from('inquiries').select('*').order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as InquiryStatus);
      }

      const { data, error } = await query;
      if (!error && data) {
        setInquiries(data);
      }
    } catch (err) {
      console.error('Error loading inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const handleStatusChange = async (inquiryId: string, newStatus: InquiryStatus) => {
    setUpdatingStatus(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('inquiries')
        .update({ status: newStatus })
        .eq('id', inquiryId);

      if (!error) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === inquiryId ? { ...item, status: newStatus } : item))
        );
        if (selectedInquiry && selectedInquiry.id === inquiryId) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Error updating inquiry status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (inquiryId: string) => {
    if (!newNote.trim()) return;
    try {
      const supabase = createClient();
      await supabase.from('inquiry_notes').insert({
        inquiry_id: inquiryId,
        note: newNote.trim(),
        author_name: 'Pune Operations Staff',
      });
      // Append locally to internal_notes
      const updatedNotes = selectedInquiry.internal_notes
        ? `${selectedInquiry.internal_notes}\n[${new Date().toLocaleDateString('en-IN')}] ${newNote}`
        : `[${new Date().toLocaleDateString('en-IN')}] ${newNote}`;

      await supabase.from('inquiries').update({ internal_notes: updatedNotes }).eq('id', inquiryId);

      setSelectedInquiry({ ...selectedInquiry, internal_notes: updatedNotes });
      setInquiries((prev) =>
        prev.map((item) => (item.id === inquiryId ? { ...item, internal_notes: updatedNotes } : item))
      );
      setNewNote('');
    } catch (err) {
      console.error('Error saving note:', err);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const s = search.toLowerCase();
    return (
      inq.customer_name?.toLowerCase().includes(s) ||
      inq.email?.toLowerCase().includes(s) ||
      inq.phone?.includes(s) ||
      inq.inquiry_number?.toLowerCase().includes(s) ||
      inq.destination_name?.toLowerCase().includes(s)
    );
  });

  const exportToCSV = () => {
    const headers = ['Inquiry Number,Customer Name,Email,Phone,Destination,Travel Dates,Adults,Children,Budget,Status,Created At\n'];
    const rows = filteredInquiries.map((i) =>
      `"${i.inquiry_number}","${i.customer_name}","${i.email}","${i.phone}","${i.destination_name || ''}","${i.travel_dates || ''}",${i.adults},${i.children},${i.budget},"${i.status}","${i.created_at}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TheTourVision_Leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-navy">
            CRM & Lead Pipeline
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Track prospective travelers from initial website inquiry to confirmed booking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, or Ref #..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-xs font-medium text-gray-800 placeholder-gray-400 focus:border-amber-500 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 self-start md:self-center">
          {[
            { id: 'all', label: 'All Leads' },
            { id: 'new', label: 'New' },
            { id: 'contacted', label: 'Contacted' },
            { id: 'qualified', label: 'Qualified' },
            { id: 'quotation_sent', label: 'Quotation Sent' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'lost', label: 'Lost' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                statusFilter === st.id
                  ? 'bg-brand-navy text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Leads Table & Detail Slide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads Table */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Ref #</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Destination</th>
                  <th className="py-3 px-4 font-semibold">Budget</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredInquiries.length > 0 ? (
                  filteredInquiries.map((inq) => (
                    <tr
                      key={inq.id}
                      onClick={() => setSelectedInquiry(inq)}
                      className={`cursor-pointer transition-colors ${
                        selectedInquiry?.id === inq.id
                          ? 'bg-amber-50/70'
                          : 'hover:bg-gray-50/70'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-primary-700">
                        {inq.inquiry_number}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-gray-900 block">{inq.customer_name}</span>
                        <span className="text-[10px] text-gray-400">{inq.phone}</span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-gray-800">
                        {inq.destination_name || 'Bespoke Vacation'}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-900">
                        {inq.budget > 0 ? formatCurrency(inq.budget) : 'Custom'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                            inq.status === 'new'
                              ? 'bg-blue-100 text-blue-800'
                              : inq.status === 'qualified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inq.status === 'quotation_sent'
                              ? 'bg-amber-100 text-amber-800'
                              : inq.status === 'confirmed'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {inq.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hello ${inq.customer_name}, this is The Tour Vision team in Pune regarding your travel inquiry #${inq.inquiry_number}.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-emerald-500 shadow-2xs"
                        >
                          <MessageCircle className="h-3 w-3" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-xs text-gray-400">
                      No matching leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Lead Details Drawer */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {selectedInquiry ? (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary-700">
                    {selectedInquiry.inquiry_number}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {formatDate(selectedInquiry.created_at)}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-brand-navy mt-1">
                  {selectedInquiry.customer_name}
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedInquiry.email} • {selectedInquiry.phone}
                </p>
              </div>

              {/* Status Selector */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Pipeline Status
                </label>
                <select
                  disabled={updatingStatus}
                  value={selectedInquiry.status}
                  onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value as InquiryStatus)}
                  className="w-full rounded-xl border border-gray-300 p-2 text-xs font-semibold text-brand-navy focus:border-amber-500 focus:outline-none"
                >
                  <option value="new">New Inquiry</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified Lead</option>
                  <option value="quotation_sent">Quotation Sent</option>
                  <option value="confirmed">Confirmed Booking</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              {/* Travel Specs */}
              <div className="rounded-xl bg-gray-50 p-3.5 space-y-1.5 text-xs text-gray-700">
                <p>
                  <strong>Destination:</strong> {selectedInquiry.destination_name || 'Bespoke'}
                </p>
                <p>
                  <strong>Departure City:</strong> {selectedInquiry.departure_city}
                </p>
                <p>
                  <strong>Travelers:</strong> {selectedInquiry.adults} Adults, {selectedInquiry.children} Children
                </p>
                <p>
                  <strong>Dates:</strong> {selectedInquiry.travel_dates || 'Flexible'}
                </p>
                <p>
                  <strong>Budget:</strong> {formatCurrency(selectedInquiry.budget)}
                </p>
              </div>

              {/* Internal Staff Notes */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Internal Team Notes
                </label>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700 max-h-36 overflow-y-auto whitespace-pre-line leading-relaxed mb-2 font-mono">
                  {selectedInquiry.internal_notes || 'No internal remarks yet.'}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add follow-up remark..."
                    className="flex-1 rounded-xl border border-gray-300 px-3 py-1.5 text-xs focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleAddNote(selectedInquiry.id)}
                    className="rounded-xl bg-brand-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border-t border-gray-100 pt-4 flex gap-2">
                <a
                  href={`/admin/quotations/new?inquiryId=${selectedInquiry.id}`}
                  className="flex-1 text-center rounded-xl bg-primary-600 py-2.5 text-xs font-bold text-white hover:bg-primary-700 shadow-sm"
                >
                  Generate Proposal PDF
                </a>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-xs text-gray-400">
              Select any inquiry from the table to view complete details, add CRM notes, and update status.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
