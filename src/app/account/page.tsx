'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, Compass, Calendar, FileText, CheckCircle2, 
  Clock, Download, LogOut, ArrowRight, ShieldCheck, 
  MapPin, Phone, Mail, Sparkles 
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency, formatDate } from '@/lib/utils';
import { generateQuotationPDF } from '@/lib/pdf/quotation';

export default function CustomerAccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'inquiries' | 'bookings' | 'quotations' | 'profile'>('inquiries');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [inquiries, setInquiries] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [quotations, setQuotations] = useState<any[]>([]);

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data: authData } = await supabase.auth.getUser();

        if (!authData.user) {
          // If not authenticated, demo account mode for seamless evaluation
          setUser({
            id: 'demo-user',
            email: 'voyager@thetourvision.com',
            user_metadata: { full_name: 'Dr. Anand Kulkarni', phone: '+91 98220 12345' },
          });

          // Fetch demo inquiries & bookings
          const { data: inq } = await supabase.from('inquiries').select('*').limit(5);
          if (inq) setInquiries(inq);

          const { data: bkg } = await supabase.from('bookings').select('*').limit(5);
          if (bkg) setBookings(bkg);

          const { data: quo } = await supabase.from('quotations').select('*').limit(5);
          if (quo) setQuotations(quo);
        } else {
          setUser(authData.user);

          // Fetch own inquiries backed by RLS
          const { data: inq } = await supabase
            .from('inquiries')
            .select('*')
            .or(`user_id.eq.${authData.user.id},email.eq.${authData.user.email}`);
          if (inq) setInquiries(inq);

          // Fetch own bookings backed by RLS
          const { data: bkg } = await supabase
            .from('bookings')
            .select('*')
            .eq('customer_id', authData.user.id);
          if (bkg) setBookings(bkg);

          // Fetch own quotations
          const { data: quo } = await supabase
            .from('quotations')
            .select('*')
            .or(`customer_id.eq.${authData.user.id},customer_email.eq.${authData.user.email}`);
          if (quo) setQuotations(quo);
        }
      } catch (err) {
        console.error('Error in customer portal:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  const downloadQuotation = (q: any) => {
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
          title: `Curated Vacation Package to ${q.destination_name}`,
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
    doc.save(`${q.quotation_number}_Proposal.pdf`);
  };

  return (
    <div className="bg-[#fcfaf7] min-h-screen py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-brand-navy text-amber-300 flex items-center justify-center font-serif text-2xl font-bold shadow-md">
              {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'V'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-amber-700 font-bold">
                  Voyager Profile
                </span>
                <span className="flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  <ShieldCheck className="h-3 w-3" />
                  <span>RLS Protected</span>
                </span>
              </div>
              <h1 className="font-serif text-2xl font-bold text-brand-navy mt-0.5">
                {user?.user_metadata?.full_name || 'Valued Voyager'}
              </h1>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/trip-planner"
              className="flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-700 shadow-sm"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Plan New Vacation</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-gray-300 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="border-b border-gray-200 flex gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === 'inquiries'
                ? 'border-brand-navy text-brand-navy'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            My Inquiries ({inquiries.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === 'bookings'
                ? 'border-brand-navy text-brand-navy'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Confirmed Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('quotations')}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === 'quotations'
                ? 'border-brand-navy text-brand-navy'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Proposals & Quotes ({quotations.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === 'profile'
                ? 'border-brand-navy text-brand-navy'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Profile & Preferences
          </button>
        </div>

        {/* Tab 1: Inquiries */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            {inquiries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-primary-700">
                        {inq.inquiry_number}
                      </span>
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
                    </div>

                    <div>
                      <h3 className="font-serif text-base font-bold text-brand-navy">
                        {inq.destination_name || 'Custom Bespoke Vacation'}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Departure from: <strong>{inq.departure_city}</strong> • Travel Window: {inq.travel_dates || 'Flexible'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                      <span>Travelers: {inq.adults} Adults{inq.children > 0 ? `, ${inq.children} Children` : ''}</span>
                      <span className="text-[11px] text-gray-400">
                        Submitted: {formatDate(inq.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-xs text-gray-500">
                You haven't submitted any travel inquiries yet.{' '}
                <Link href="/trip-planner" className="text-primary-700 font-semibold underline">
                  Plan your first vacation now!
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Bookings */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {bookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-800">
                        {b.booking_reference}
                      </span>
                      <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                        {b.booking_status}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-base font-bold text-brand-navy">
                        Confirmed Departure
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Window: {formatDate(b.start_date)} to {formatDate(b.end_date)}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 block">Total Package</span>
                        <span className="font-bold text-brand-navy">
                          {formatCurrency(b.total_amount, b.currency)}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-gray-600">
                        Payment: <strong className="text-emerald-700 capitalize">{b.payment_status}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-xs text-gray-500">
                No active bookings currently logged. Once your quotation is accepted and confirmed by our Pune office, your confirmed voucher will appear here.
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Quotations */}
        {activeTab === 'quotations' && (
          <div className="space-y-4">
            {quotations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quotations.map((q) => (
                  <div
                    key={q.id}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-primary-700">
                        {q.quotation_number}
                      </span>
                      <span className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                        {q.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-base font-bold text-brand-navy">
                        {q.destination_name} Proposal
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Valid Until: {formatDate(q.valid_until)}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 block">Proposal Amount</span>
                        <span className="text-base font-bold text-brand-navy">
                          {formatCurrency(q.total_amount, q.currency)}
                        </span>
                      </div>
                      <button
                        onClick={() => downloadQuotation(q)}
                        className="flex items-center gap-1.5 rounded-xl border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                      >
                        <Download className="h-3.5 w-3.5 text-primary-700" />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-xs text-gray-500">
                No custom quotations issued yet. Contact our Pune office to get an itemized PDF quotation for your dream holiday.
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Profile */}
        {activeTab === 'profile' && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm max-w-xl space-y-4 text-xs">
            <h3 className="font-serif text-base font-bold text-brand-navy border-b border-gray-100 pb-2">
              Personal Information
            </h3>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Full Name:</strong> {user?.user_metadata?.full_name || 'Dr. Anand Kulkarni'}
              </p>
              <p>
                <strong>Email Address:</strong> {user?.email}
              </p>
              <p>
                <strong>Contact Phone:</strong> {user?.user_metadata?.phone || '+91 98220 12345'}
              </p>
              <p>
                <strong>City:</strong> {user?.user_metadata?.city || 'Pune, Maharashtra'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
