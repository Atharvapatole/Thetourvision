import React from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata = {
  title: 'Cancellation & Refund Policy | The Tour Vision Pune',
  description: 'Cancellation terms, timelines, and refund schedule for The Tour Vision, Pune.',
};

export default function CancellationPolicyPage() {
  return (
    <div className="bg-[#fcfaf7] min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto rounded-3xl border border-gray-200 bg-white p-8 sm:p-12 shadow-sm space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed font-light">
        <div className="border-b border-gray-100 pb-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-800 mb-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span>OPERATIONAL POLICY</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-brand-navy">
            Cancellation & Refund Policy
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            The Tour Vision • Pune, Maharashtra, India
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-brand-navy">
            1. Standard Cancellation Fee Schedule
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-gray-100 text-gray-700 font-bold">
                <tr>
                  <th className="py-2.5 px-4 border-b">Notice Received Prior to Departure</th>
                  <th className="py-2.5 px-4 border-b">Cancellation Charge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                <tr>
                  <td className="py-2.5 px-4">30 days or more</td>
                  <td className="py-2.5 px-4 font-semibold text-brand-navy">Non-refundable administrative fee (₹3,000 / person)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4">29 to 15 days</td>
                  <td className="py-2.5 px-4 font-semibold text-brand-navy">25% of total package cost</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4">14 to 7 days</td>
                  <td className="py-2.5 px-4 font-semibold text-brand-navy">50% of total package cost</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4">Fewer than 7 days / No-Show</td>
                  <td className="py-2.5 px-4 font-semibold text-red-700">100% of total package cost</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-brand-navy">
            2. Non-Refundable Components
          </h2>
          <p>
            Certain travel items are non-refundable immediately upon issuance, including confirmed airline flight tickets (governed by individual airline cancellation fare rules), Gulmarg Gondola Phase 2 entry passes, non-refundable luxury palace bookings during peak Diwali/New Year windows, and consular visa processing fees.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-brand-navy">
            3. Processing of Approved Refunds
          </h2>
          <p>
            Approved refunds will be processed via original bank transfer (NEFT / RTGS) within 7 to 10 business days following written cancellation verification from our Pune accounts department.
          </p>
        </section>
      </div>
    </div>
  );
}
