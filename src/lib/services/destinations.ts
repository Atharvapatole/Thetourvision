import { DEMO_DESTINATIONS, DEMO_PACKAGES } from '@/lib/constants';

export interface SearchResultDestination {
  id: string;
  name: string;
  slug: string;
  country: string;
  region: string;
  is_domestic: boolean;
  tagline?: string;
  overview?: string;
  hero_image: string;
  highlights?: string[];
  package_count: number;
  packages: any[];
}

export interface SearchResultPackage {
  id: string;
  destination_id: string;
  title: string;
  slug: string;
  summary: string;
  price_inr: number;
  discounted_price_inr?: number;
  days: number;
  nights: number;
  cover_image: string;
  destination_name?: string;
  destination_slug?: string;
}

export interface SearchResponse {
  query: string;
  destinations: SearchResultDestination[];
  matched_packages: SearchResultPackage[];
  total: number;
  source: 'database' | 'fallback';
}

/**
 * Searches destinations and packages via the dedicated search endpoint.
 */
export async function searchDestinationsAndPackages(
  query: string,
  limit: number = 8,
  signal?: AbortSignal
): Promise<SearchResponse> {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      query: '',
      destinations: [],
      matched_packages: [],
      total: 0,
      source: 'database',
    };
  }

  try {
    const res = await fetch(
      `/api/destinations/search?q=${encodeURIComponent(trimmed)}&limit=${limit}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal,
      }
    );

    if (res.ok) {
      const data: SearchResponse = await res.json();
      return data;
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw err;
    }
    console.warn('Network search request failed, using client fallback:', err);
  }

  // Client-side fallback if fetch failed
  const qLower = trimmed.toLowerCase();
  const matchedDests = DEMO_DESTINATIONS.filter(
    (d) =>
      d.name.toLowerCase().includes(qLower) ||
      d.slug.toLowerCase().includes(qLower) ||
      d.country.toLowerCase().includes(qLower) ||
      d.region.toLowerCase().includes(qLower) ||
      (d.tagline && d.tagline.toLowerCase().includes(qLower))
  ).map((d) => {
    const pkgs = DEMO_PACKAGES.filter((p) => p.destination_id === d.id);
    return {
      ...d,
      package_count: pkgs.length,
      packages: pkgs,
    };
  });

  const matchedPkgs = DEMO_PACKAGES.filter(
    (p) =>
      p.title.toLowerCase().includes(qLower) ||
      p.summary.toLowerCase().includes(qLower) ||
      p.destination_name.toLowerCase().includes(qLower)
  );

  return {
    query: trimmed,
    destinations: matchedDests,
    matched_packages: matchedPkgs,
    total: matchedDests.length,
    source: 'fallback',
  };
}
