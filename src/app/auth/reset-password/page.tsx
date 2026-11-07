'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setErrorMsg('');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/account/profile`,
      });

      if (error) throw error;
      setMessage('Password reset link dispatched! Please check your email inbox.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error sending password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fcfaf7] min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-8">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Sign In</span>
        </Link>

        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-1">
          Reset Your Password
        </h2>
        <p className="text-xs text-gray-500 mb-6">
          Enter your registered email address to receive password recovery instructions.
        </p>

        {message && (
          <div className="mb-4 rounded-xl bg-emerald-50 p-3.5 text-xs text-emerald-800 border border-emerald-200 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 rounded-xl bg-red-50 p-3.5 text-xs text-red-600 border border-red-200 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Registered Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@example.com"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-xs font-medium text-gray-800 placeholder-gray-400 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-navy py-3 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-md disabled:opacity-50"
          >
            <span>{loading ? 'Sending Recovery Link...' : 'Send Recovery Instructions'}</span>
            <ArrowRight className="h-4 w-4 text-amber-400" />
          </button>
        </form>
      </div>
    </div>
  );
}
