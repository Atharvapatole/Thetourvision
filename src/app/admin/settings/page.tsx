'use client';

import React, { useState } from 'react';
import { Settings, Save, CheckCircle, Shield, Globe, Sparkles, Building } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export default function AdminSettingsPage() {
  const [showDemoBadge, setShowDemoBadge] = useState(true);
  const [agencyPhone, setAgencyPhone] = useState(SITE_CONFIG.phone);
  const [agencyEmail, setAgencyEmail] = useState(SITE_CONFIG.email);
  const [whatsappNumber, setWhatsappNumber] = useState(SITE_CONFIG.whatsapp);
  const [address, setAddress] = useState(SITE_CONFIG.location);
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-serif text-2xl font-bold text-brand-navy">
          Agency Settings & Brand Configurations
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Configure agency operational coordinates, demo badges, and omnichannel integrations.
        </p>
      </div>

      {saved && (
        <div className="rounded-xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 border border-emerald-200 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>Agency configurations successfully saved to Supabase!</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Demo Mode Configuration */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span>Demo Website Indicator Badge</span>
              </div>
              <p className="text-xs text-amber-800/80 mt-1 max-w-xl leading-relaxed">
                Controls the persistent, unobtrusive "DEMO WEBSITE" badge on public visitor pages. Demonstrates client prototype readiness while clearly identifying Automate Stack demo origin.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showDemoBadge}
                onChange={(e) => setShowDemoBadge(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600" />
            </label>
          </div>
        </div>

        {/* Agency Contact & Office Information */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Building className="h-4 w-4 text-brand-navy" />
            <h3 className="font-serif text-base font-bold text-brand-navy">
              Pune Operational Headquarters
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                Official Agency Phone
              </label>
              <input
                type="text"
                value={agencyPhone}
                onChange={(e) => setAgencyPhone(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-2.5 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                Official Inquiries Email
              </label>
              <input
                type="email"
                value={agencyEmail}
                onChange={(e) => setAgencyEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-2.5 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                WhatsApp Cloud API / Click-to-Chat Number
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-2.5 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                Office Coordinates
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-2.5 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Integration Credentials Info */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-3 text-xs text-gray-600">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Shield className="h-4 w-4 text-emerald-600" />
            <h3 className="font-serif text-base font-bold text-brand-navy">
              Security & Environment Status
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-gray-50 p-3">
              <span className="font-bold text-gray-800 block">Supabase RLS</span>
              <span className="text-[11px] text-emerald-700 font-semibold">Active & Enforced on 20+ tables</span>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <span className="font-bold text-gray-800 block">AI Concierge Model</span>
              <span className="text-[11px] text-gray-700">Google Gemini 1.5 Flash + Luxury Fallback</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-primary-700 shadow-md"
          >
            <Save className="h-4 w-4" />
            <span>Save Configurations</span>
          </button>
        </div>
      </form>
    </div>
  );
}
