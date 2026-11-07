'use client';

import React, { useState } from 'react';
import { 
  MapPin, Phone, Mail, Clock, Send, 
  MessageCircle, CheckCircle, Sparkles 
} from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import WhatsAppButton from '@/components/shared/WhatsAppButton';

export default function ContactPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: fullName,
          email,
          phone,
          departure_city: 'Pune',
          destination_name: 'General Consultation',
          internal_notes: `Direct contact form inquiry: ${message}`,
          lead_source: 'website',
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#fcfaf7] min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1 text-xs font-semibold text-amber-900 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>PUNE CONCIERGE DESK</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brand-navy">
            Connect With Our Travel Advisors
          </h1>
          <p className="mt-3 text-sm text-gray-600 font-light">
            Visit our Pune office in person, schedule a virtual consultation, or chat directly via WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Office Details */}
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm space-y-6">
            <h2 className="font-serif text-2xl font-bold text-brand-navy border-b border-gray-100 pb-4">
              Pune Headquarters
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-brand-navy font-bold">Registered Office:</strong>
                  <span>{SITE_CONFIG.location}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-brand-navy font-bold">Phone Lines:</strong>
                  <span>{SITE_CONFIG.phone} / {SITE_CONFIG.emergencyHelpline} (24x7 Emergency)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-brand-navy font-bold">Email Desk:</strong>
                  <span>{SITE_CONFIG.email}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-brand-navy font-bold">Consultation Hours:</strong>
                  <span>{SITE_CONFIG.workingHours}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Instant WhatsApp Assistance
              </h4>
              <WhatsAppButton
                variant="inline"
                label="Direct WhatsApp with Pune Travel Desk"
                className="w-full py-3"
              />
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-brand-navy">
                  Message Dispatched!
                </h3>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Thank you for contacting The Tour Vision Pune. Our travel planners will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="font-serif text-xl font-bold text-brand-navy mb-4">
                  Send Us an Inquiry
                </h3>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Adv. Pradeep Joshi"
                    className="w-full rounded-xl border border-gray-200 p-3 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="pradeep@example.com"
                      className="w-full rounded-xl border border-gray-200 p-3 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98220 12345"
                      className="w-full rounded-xl border border-gray-200 p-3 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">
                    How Can We Assist You? *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your travel vision, tentative dates, or questions..."
                    className="w-full rounded-xl border border-gray-200 p-3 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 text-xs font-bold text-white hover:bg-primary-700 transition-colors shadow-md disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span>{submitting ? 'Transmitting...' : 'Send Message to Pune Office'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
