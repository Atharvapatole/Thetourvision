'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, FileText, CheckSquare, 
  Package, MapPin, Star, Settings, LogOut, 
  ExternalLink, Shield, Compass, Sparkles 
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // If on admin login page, don't show admin sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'CRM & Inquiries', href: '/admin/inquiries', icon: Users },
    { name: 'Quotation Builder', href: '/admin/quotations', icon: FileText },
    { name: 'Bookings & Orders', href: '/admin/bookings', icon: CheckSquare },
    { name: 'Package Catalog', href: '/admin/packages', icon: Package },
    { name: 'Destinations', href: '/admin/destinations', icon: MapPin },
    { name: 'Reviews & CMS', href: '/admin/reviews', icon: Star },
    { name: 'Agency Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-brand-navy text-white flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          {/* Logo / Header */}
          <div className="p-6 border-b border-white/10">
            <Link href="/admin" className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-wider text-white">
                THE TOUR VISION
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-amber-400 font-semibold mt-0.5">
                Admin Command • Pune
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-gray-300 hover:bg-white/5 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Public Website</span>
            </span>
            <span className="text-[10px] text-amber-400">Live</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar for Mobile & Header Actions */}
        <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Operations & Management Portal
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="hidden sm:inline text-gray-500">
              Agency: <strong>The Tour Vision (Pune)</strong>
            </span>
            <button
              onClick={handleSignOut}
              className="text-xs text-red-600 font-semibold md:hidden"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="p-6 sm:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}
