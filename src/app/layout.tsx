import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DemoBadge from '@/components/shared/DemoBadge';
import WhatsAppButton from '@/components/shared/WhatsAppButton';
import FloatingAIChat from '@/components/shared/FloatingAIChat';
import { SITE_CONFIG } from '@/lib/constants';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} — Curated Luxury Travel & Bespoke Holidays | Pune`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    'The Tour Vision Pune',
    'Luxury travel agency Pune',
    'Customized holiday packages Pune',
    'Switzerland tours from Pune',
    'Kashmir honeymoon packages',
    'Rajasthan heritage palace tours',
    'Bali luxury villa holidays',
    'International tour operators Pune',
  ],
  authors: [{ name: 'Automate Stack' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: `${SITE_CONFIG.name} — Curated Luxury Travel & Bespoke Holidays`,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased text-gray-900 bg-[#fdfbf7]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <DemoBadge />
        <WhatsAppButton variant="floating" />
        <FloatingAIChat />
      </body>
    </html>
  );
}
