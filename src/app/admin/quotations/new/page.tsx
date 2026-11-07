'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  FileText, Plus, Trash2, Download, Save, 
  Send, Sparkles, ArrowLeft, CheckCircle 
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { generateQuotationPDF } from '@/lib/pdf/quotation';
import { formatCurrency } from '@/lib/utils';
import type { QuotationItemType } from '@/types/database';

function QuotationBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillInquiryId = searchParams.get('inquiryId');

  const [inquiryId, setInquiryId] = useState(prefillInquiryId || '');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [departureCity, setDepartureCity] = useState('Pune');
  const [destinationName, setDestinationName] = useState('Kashmir Paradise on Earth');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [validUntil, setValidUntil] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Line items
  const [items, setItems] = useState<Array<{
    item_type: QuotationItemType;
    title: string;
    description: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>>([
    {
      item_type: 'hotel',
      title: '5-Star Luxury Heritage Stay (5 Nights)',
      description: 'Super deluxe lake-view room with daily breakfast and dinner',
      quantity: 1,
      unit_price: 65000,
      total_price: 65000,
    },
    {
      item_type: 'transport',
      title: 'Private AC Toyota Innova Crysta Chauffeur',
      description: 'All airport transfers, inter-city travel, toll taxes & parking',
      quantity: 1,
      unit_price: 24000,
      total_price: 24000,
    },
    {
      item_type: 'activity',
      title: 'VIP Cable Car / Shikara Sunset Excursion',
      description: 'Confirmed Phase 2 tickets & private lake cruise with refreshments',
      quantity: 2,
      unit_price: 3500,
      total_price: 7000,
    },
  ]);

  const [taxRate, setTaxRate] = useState(5); // 5% GST
  const [discountAmount, setDiscountAmount] = useState(5000);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Auto calculate totals
  const subtotal = items.reduce((acc, it) => acc + (it.total_price || 0), 0);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * taxRate) / 100;
  const totalAmount = taxableAmount + taxAmount;

  // Prefill inquiry details if inquiryId provided
  useEffect(() => {
    if (prefillInquiryId) {
      const loadInquiry = async () => {
        const supabase = createClient();
        const { data } = await supabase
          .from('inquiries')
          .select('*')
          .eq('id', prefillInquiryId)
          .single();
        if (data) {
          setCustomerName(data.customer_name);
          setCustomerEmail(data.email);
          setCustomerPhone(data.phone);
          if (data.destination_name) setDestinationName(data.destination_name);
          if (data.departure_city) setDepartureCity(data.departure_city);
          if (data.adults) setAdults(data.adults);
          if (data.children) setChildren(data.children);
        }
      };
      loadInquiry();
    }
  }, [prefillInquiryId]);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        item_type: 'custom',
        title: 'New Service Item',
        description: '',
        quantity: 1,
        unit_price: 5000,
        total_price: 5000,
      },
    ]);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setItems((prev) => {
      const copy = [...prev];
      const target = { ...copy[index], [field]: value };
      if (field === 'quantity' || field === 'unit_price') {
        const qty = field === 'quantity' ? Number(value) : target.quantity;
        const price = field === 'unit_price' ? Number(value) : target.unit_price;
        target.total_price = (qty || 0) * (price || 0);
      }
      copy[index] = target;
      return copy;
    });
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDownloadPDF = () => {
    const quotationNumber = `QUO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const doc = generateQuotationPDF({
      quotationNumber,
      customerName: customerName || 'Valued Voyager',
      customerEmail: customerEmail || 'client@example.com',
      customerPhone: customerPhone || '+91 98220 12345',
      departureCity,
      destinationName,
      startDate,
      endDate,
      adults,
      children,
      items: items.map((it) => ({
        title: it.title,
        description: it.description,
        quantity: it.quantity,
        unitPrice: it.unit_price,
        totalPrice: it.total_price,
      })),
      subtotal,
      taxRate,
      taxAmount,
      discountAmount,
      totalAmount,
      validUntil,
    });

    doc.save(`TheTourVision_Quotation_${customerName.replace(/ /g, '_') || 'Traveler'}.pdf`);
  };

  const handleSaveToDB = async () => {
    setSaving(true);
    setSuccessMsg('');
    try {
      const supabase = createClient();
      const quotationNumber = `QUO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const { data: quo, error } = await supabase
        .from('quotations')
        .insert({
          quotation_number: quotationNumber,
          inquiry_id: inquiryId || null,
          destination_name: destinationName,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          departure_city: departureCity,
          start_date: startDate || null,
          end_date: endDate || null,
          adults,
          children,
          subtotal,
          tax_rate: taxRate,
          tax_amount: taxAmount,
          discount_amount: discountAmount,
          total_amount: totalAmount,
          valid_until: validUntil,
          status: 'sent',
          is_demo: false,
        })
        .select('*')
        .single();

      if (!error && quo) {
        // Insert line items
        const itemRows = items.map((it, idx) => ({
          quotation_id: quo.id,
          item_type: it.item_type,
          title: it.title,
          description: it.description,
          quantity: it.quantity,
          unit_price: it.unit_price,
          total_price: it.total_price,
          sort_order: idx,
        }));
        await supabase.from('quotation_items').insert(itemRows);

        // If linked to inquiry, mark inquiry as quotation_sent
        if (inquiryId) {
          await supabase.from('inquiries').update({ status: 'quotation_sent' }).eq('id', inquiryId);
        }

        setSuccessMsg(`Quotation #${quo.quotation_number} saved to database successfully!`);
      } else {
        setSuccessMsg('Proposal recorded locally in session.');
      }
    } catch (err: any) {
      console.error('Error saving quotation:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Management</span>
          </button>
          <h1 className="font-serif text-2xl font-bold text-brand-navy">
            Create Custom Travel Quotation
          </h1>
          <p className="text-xs text-gray-500">
            Build itemized proposals with automatic GST calculation and branded PDF export.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm"
          >
            <Download className="h-4 w-4 text-primary-600" />
            <span>Generate & Download PDF</span>
          </button>

          <button
            onClick={handleSaveToDB}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-xs font-bold text-white hover:bg-primary-700 shadow-sm disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save & Register Quotation'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="rounded-xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 border border-emerald-200 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Client & Travel Details Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="font-serif text-base font-bold text-brand-navy border-b border-gray-100 pb-2">
          Client & Destination Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Customer Full Name *
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Vikramaditya Shinde"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs font-medium focus:border-amber-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Customer Email *
            </label>
            <input
              type="email"
              required
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="vikram@example.com"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs font-medium focus:border-amber-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Customer Phone *
            </label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+91 98220 12345"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs font-medium focus:border-amber-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Destination Name *
            </label>
            <input
              type="text"
              required
              value={destinationName}
              onChange={(e) => setDestinationName(e.target.value)}
              placeholder="e.g. Kashmir / Switzerland"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs font-medium focus:border-amber-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Departure City
            </label>
            <input
              type="text"
              value={departureCity}
              onChange={(e) => setDepartureCity(e.target.value)}
              placeholder="Pune"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs font-medium focus:border-amber-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Quotation Valid Until
            </label>
            <input
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs font-medium focus:border-amber-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Itemized Line Items Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h3 className="font-serif text-base font-bold text-brand-navy">
            Itemized Services, Stays & Inclusions
          </h3>
          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center gap-1 text-xs font-bold text-primary-700 hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-gray-200 p-4 bg-gray-50/60 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
            >
              <div className="sm:col-span-5">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                  placeholder="Service description"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800"
                />
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                  placeholder="Additional remarks..."
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-[11px] text-gray-500 mt-1"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] text-gray-500 block">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-center"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] text-gray-500 block">Unit Rate (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={item.unit_price}
                  onChange={(e) => handleItemChange(idx, 'unit_price', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-right font-semibold"
                />
              </div>

              <div className="sm:col-span-2 text-right">
                <label className="text-[10px] text-gray-500 block">Amount</label>
                <span className="text-xs font-bold text-brand-navy">
                  {formatCurrency(item.total_price)}
                </span>
              </div>

              <div className="sm:col-span-1 text-center">
                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Summary Breakdown */}
        <div className="pt-4 border-t border-gray-100 flex flex-col items-end space-y-2 text-xs">
          <div className="flex justify-between w-64 text-gray-600">
            <span>Subtotal:</span>
            <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex items-center justify-between w-64 text-gray-600">
            <span>Discount (₹):</span>
            <input
              type="number"
              min="0"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(Number(e.target.value))}
              className="w-24 text-right rounded border border-gray-200 px-2 py-0.5 text-xs"
            />
          </div>

          <div className="flex items-center justify-between w-64 text-gray-600">
            <span>GST Rate (%):</span>
            <input
              type="number"
              min="0"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              className="w-24 text-right rounded border border-gray-200 px-2 py-0.5 text-xs"
            />
          </div>

          <div className="flex justify-between w-64 text-gray-600">
            <span>GST Amount:</span>
            <span className="font-semibold text-gray-900">{formatCurrency(taxAmount)}</span>
          </div>

          <div className="flex justify-between w-64 text-sm font-extrabold text-brand-navy border-t border-gray-200 pt-2">
            <span>Total Proposal:</span>
            <span className="text-primary-700">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewQuotationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading quotation studio...</div>}>
      <QuotationBuilderContent />
    </Suspense>
  );
}
