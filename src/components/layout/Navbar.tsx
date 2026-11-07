'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, X, Phone, Compass, User, Shield, 
  Sparkles, Calendar, ChevronDown 
} from 'lucide-react';
import { SITE_CONFIG, NAV_LINKS } from '@/lib/constants';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Pune Agency Contact Bar */}
      <div className="bg-brand-navy border-b border-white/10 px-4 py-1.5 text-xs text-gray-300 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Compass className="h-3.5 w-3.5" />
              <span>Pune, Maharashtra, India</span>
            </span>
            <span className="hidden md:inline text-gray-400">|</span>
            <span className="hidden md:inline">Luxury Travel Curators & Bespoke Holidays</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${SITE_CONFIG.phone}`}
              className="flex items-center gap-1 hover:text-amber-300 transition-colors"
            >
              <Phone className="h-3 w-3 text-amber-400" />
              <span>{SITE_CONFIG.phone}</span>
            </a>
            <span className="text-gray-500">|</span>
            <Link
              href="/admin/login"
              className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
              title="Staff & Management Login"
            >
              <Shield className="h-3 w-3 text-gray-400" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3 text-gray-900 border-b border-gray-100'
            : 'bg-white py-4 text-gray-900 border-b border-gray-200'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-8">
          {/* Brand Logo */}
          <Link href="/" className="flex flex-col group">
            <span className="font-serif text-2xl font-bold tracking-wider text-brand-navy group-hover:text-primary-700 transition-colors">
              THE TOUR VISION
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-amber-700 font-semibold -mt-1">
              Bespoke Journeys • Pune
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {NAV_LINKS.slice(0, 6).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-primary-600 ${
                  isActive(link.href)
                    ? 'text-primary-600 font-semibold border-b-2 border-primary-600 pb-0.5'
                    : 'text-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/about"
              className={`transition-colors hover:text-primary-600 ${
                isActive('/about') ? 'text-primary-600 font-semibold' : 'text-gray-700'
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`transition-colors hover:text-primary-600 ${
                isActive('/contact') ? 'text-primary-600 font-semibold' : 'text-gray-700'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/account"
              className="flex items-center gap-1.5 rounded-full border border-gray-300 px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-all"
            >
              <User className="h-3.5 w-3.5 text-gray-600" />
              <span>My Account</span>
            </Link>
            <Link
              href="/trip-planner"
              className="flex items-center gap-1.5 rounded-full bg-brand-navy px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-all shadow-sm"
            >
              <Calendar className="h-3.5 w-3.5 text-amber-400" />
              <span>Plan My Trip</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-6 shadow-xl">
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`py-2 text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-primary-600 font-semibold pl-2 border-l-4 border-primary-600'
                      : 'text-gray-800 hover:text-primary-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                <Link
                  href="/account"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 py-2.5 text-sm font-semibold text-gray-700"
                >
                  <User className="h-4 w-4" />
                  <span>Customer Portal</span>
                </Link>
                <Link
                  href="/trip-planner"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-brand-navy py-2.5 text-sm font-semibold text-white"
                >
                  <Calendar className="h-4 w-4 text-amber-400" />
                  <span>Start Smart Trip Planner</span>
                </Link>
                <Link
                  href="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 py-2 text-xs font-medium text-gray-600"
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span>Admin & Staff Portal</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
