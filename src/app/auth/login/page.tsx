'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Compass, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        throw error;
      }

      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fcfaf7] min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-8">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group mb-3">
            <span className="font-serif text-2xl font-bold tracking-wider text-brand-navy">
              THE TOUR VISION
            </span>
            <span className="block text-[10px] uppercase tracking-[0.25em] text-amber-700 font-semibold -mt-1">
              Bespoke Journeys • Pune
            </span>
          </Link>
          <h2 className="font-serif text-2xl font-bold text-gray-900">
            Customer Portal Sign In
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Access your custom itineraries, proposals, vouchers, and trip status.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 rounded-xl bg-red-50 p-3.5 text-xs text-red-600 border border-red-200 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Email Address
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

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-700 block">
                Password
              </label>
              <Link
                href="/auth/reset-password"
                className="text-[11px] font-medium text-primary-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-xs font-medium text-gray-800 placeholder-gray-400 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-navy py-3 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-md disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to My Account'}</span>
            <ArrowRight className="h-4 w-4 text-amber-400" />
          </button>
        </form>

        <div className="mt-8 border-t border-gray-100 pt-6 text-center text-xs text-gray-500">
          Do not have an account yet?{' '}
          <Link
            href="/auth/signup"
            className="font-semibold text-primary-700 hover:underline"
          >
            Create customer account
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/admin/login"
            className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
          >
            Looking for Staff & Admin Login? Click here →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[85vh] flex items-center justify-center text-xs text-gray-500">Loading authentication...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
