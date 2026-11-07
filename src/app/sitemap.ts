import { MetadataRoute } from 'next';
import { DEMO_DESTINATIONS, DEMO_PACKAGES } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thetourvision.vercel.app';

  const staticPages = [
    '',
    '/destinations',
    '/packages',
    '/trip-planner',
    '/ai-travel-assistant',
    '/gallery',
    '/testimonials',
    '/blog',
    '/about',
    '/contact',
    '/faq',
    '/privacy-policy',
    '/terms',
    '/cancellation-policy',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const destinationPages = DEMO_DESTINATIONS.map((d) => ({
    url: `${siteUrl}/destinations/${d.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const packagePages = DEMO_PACKAGES.map((p) => ({
    url: `${siteUrl}/packages/${p.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticPages, ...destinationPages, ...packagePages];
}
