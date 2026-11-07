'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Lock, Mail, ArrowRight, AlertTriangle, Key, Info } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(
    errorParam === 'unauthorized'
      ? 'Access Denied: Your account is authenticated but lacks Administrator or Staff privileges.'
      : ''
  );

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();

    try {
      const supabase = createClient();

      // 1. Authenticate with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('invalid login credentials')) {
          throw new Error(
            'Invalid credentials or unconfirmed account. If you created this user, ensure you executed supabase/bootstrap_admin.sql in the Supabase SQL Editor to confirm the email and grant Admin access.'
          );
        }
        if (msg.includes('email not confirmed')) {
          throw new Error(
            'Account email not confirmed. Run supabase/bootstrap_admin.sql in Supabase SQL Editor to automatically confirm and activate this administrator account.'
          );
        }
        throw error;
      }

      if (!data.user) {
        throw new Error('Authentication failed. No user session returned.');
      }

      // 2. Client-side sanity check (Server-side middleware strictly re-verifies!)
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .in('role', ['admin', 'staff'])
        .limit(1);

      if (roleError || !roleData || roleData.length === 0) {
        // Sign out right away if not staff or admin
        await supabase.auth.signOut();
        throw new Error(
          'Unauthorized: You are registered as a customer, not an administrator. Please execute supabase/bootstrap_admin.sql in your Supabase SQL editor to assign the Admin role.'
        );
      }

      // 3. Authorized! Redirect to Admin Dashboard
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-navy min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-8">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mx-auto mb-3 shadow-inner">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">
            Administrative Command Center
          </h2>
          <p className="text-xs text-amber-200/80 mt-1">
            The Tour Vision • Operations, CRM & Management Portal
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 rounded-xl bg-red-950/70 p-4 text-xs text-red-200 border border-red-800 flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMsg}</div>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yourdomain.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder-gray-500 focus:border-amber-400 focus:bg-white/10 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">
              Security Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder-gray-500 focus:border-amber-400 focus:bg-white/10 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 text-xs font-bold text-white hover:bg-primary-500 transition-colors shadow-lg shadow-amber-600/20 disabled:opacity-50 mt-4 cursor-pointer"
          >
            <span>{loading ? 'Verifying RBAC Permissions...' : 'Authenticate & Open Dashboard'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Security Notice & Clear Bootstrap Steps */}
        <div className="mt-8 border-t border-white/10 pt-6 text-[11px] text-gray-300 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-semibold">
            <Key className="h-3.5 w-3.5" />
            <span>Admin First-Time Setup Procedure</span>
          </div>
          <p className="leading-relaxed text-gray-400">
            For security, newly registered accounts default to Customer role. To grant Administrator privileges:
          </p>
          <ol className="list-decimal pl-4 space-y-1.5 text-gray-300">
            <li>
              Register your account at{' '}
              <Link href="/auth/signup" className="text-amber-400 underline hover:text-amber-300">
                /auth/signup
              </Link>.
            </li>
            <li>
              In Supabase Dashboard → <strong>Authentication</strong> → <strong>Users</strong>, copy your user <strong>UID</strong>.
            </li>
            <li>
              Open <code className="text-amber-300 font-mono">supabase/bootstrap_admin.sql</code>, replace <code className="text-amber-300 font-mono">REPLACE_WITH_YOUR_USER_UID</code> with your copied UID, and run it in the Supabase SQL Editor.
            </li>
            <li>
              Return to this page and log in with your email and password.
            </li>
          </ol>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="bg-brand-navy min-h-[90vh] flex items-center justify-center text-xs text-gray-400">Loading security portal...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
