'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

interface WhatsAppButtonProps {
  phone?: string;
  prefilledText?: string;
  className?: string;
  variant?: 'floating' | 'inline' | 'button';
  label?: string;
}

export default function WhatsAppButton({
  phone = SITE_CONFIG.whatsapp,
  prefilledText = 'Hello The Tour Vision team, I would like to inquire about planning a customized vacation package.',
  className = '',
  variant = 'floating',
  label = 'Chat with Pune Concierge',
}: WhatsAppButtonProps) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(prefilledText);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

  if (variant === 'floating') {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with The Tour Vision Pune Concierge"
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm font-semibold hidden md:inline">WhatsApp Concierge</span>
      </a>
    );
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-500 shadow-sm ${className}`}
    >
      <MessageCircle className="h-4 w-4" />
      <span>{label}</span>
    </a>
  );
}
