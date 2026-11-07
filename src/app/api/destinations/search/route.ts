import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DEMO_DESTINATIONS, DEMO_PACKAGES } from '@/lib/constants';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '8', 10), 1), 20);

    if (!q) {
      return NextResponse.json({
        query: '',
        destinations: [],
        matched_packages: [],
        total: 0,
      });
    }

    // Clean query: strip commas/special chars that could interfere with Supabase postgREST or filter
    const sanitized = q.replace(/[,%()]/g, ' ').trim();
    const pattern = `%${sanitized}%`;

    try {
      const supabase = await createClient();

      // 1. Query destinations matching name, slug, country, region
      const { data: dbDestinations, error: destError } = await supabase
        .from('destinations')
        .select(`
          id, name, slug, country, region, is_domestic, tagline, overview, hero_image, highlights, is_featured, is_published, sort_order,
          packages:packages(id, title, slug, summary, price_inr, discounted_price_inr, days, nights, cover_image, is_published)
        `)
        .eq('is_published', true)
        .or(`name.ilike.${pattern},slug.ilike.${pattern},country.ilike.${pattern},region.ilike.${pattern}`)
        .order('sort_order', { ascending: true })
        .limit(limit);

      // 2. Query direct packages matching title or summary
      const { data: dbPackages, error: pkgError } = await supabase
        .from('packages')
        .select(`
          id, destination_id, title, slug, summary, price_inr, discounted_price_inr, days, nights, cover_image, is_published,
          destination:destinations(id, name, slug, country, region, hero_image)
        `)
        .eq('is_published', true)
        .or(`title.ilike.${pattern},summary.ilike.${pattern}`)
        .limit(limit);

      if (!destError && dbDestinations) {
        const formattedDestinations = dbDestinations.map((d: any) => {
          const publishedPkgs = (d.packages || []).filter((p: any) => p.is_published !== false);
          return {
            id: d.id,
            name: d.name,
            slug: d.slug,
            country: d.country,
            region: d.region,
            is_domestic: d.is_domestic,
            tagline: d.tagline,
            overview: d.overview,
            hero_image: d.hero_image,
            highlights: d.highlights || [],
            package_count: publishedPkgs.length,
            packages: publishedPkgs,
          };
        });

        const formattedPackages = (dbPackages || []).map((p: any) => ({
          id: p.id,
          destination_id: p.destination_id,
          title: p.title,
          slug: p.slug,
          summary: p.summary,
          price_inr: p.price_inr,
          discounted_price_inr: p.discounted_price_inr,
          days: p.days,
          nights: p.nights,
          cover_image: p.cover_image,
          destination_name: p.destination?.name || '',
          destination_slug: p.destination?.slug || '',
        }));

        return NextResponse.json({
          query: q,
          destinations: formattedDestinations,
          matched_packages: formattedPackages,
          total: formattedDestinations.length,
          source: 'database',
        });
      }
    } catch (dbErr) {
      console.warn('Supabase destination search error, falling back to static constants:', dbErr);
    }

    // Fallback: match in-memory constants
    const queryLower = q.toLowerCase();
    const fallbackDestinations = DEMO_DESTINATIONS.filter((d) => {
      return (
        d.name.toLowerCase().includes(queryLower) ||
        d.slug.toLowerCase().includes(queryLower) ||
        d.country.toLowerCase().includes(queryLower) ||
        d.region.toLowerCase().includes(queryLower) ||
        d.tagline.toLowerCase().includes(queryLower)
      );
    }).map((d) => {
      const pkgs = DEMO_PACKAGES.filter((p) => p.destination_id === d.id);
      return {
        ...d,
        package_count: pkgs.length,
        packages: pkgs,
      };
    });

    const fallbackPackages = DEMO_PACKAGES.filter((p) => {
      return (
        p.title.toLowerCase().includes(queryLower) ||
        p.summary.toLowerCase().includes(queryLower) ||
        p.destination_name.toLowerCase().includes(queryLower)
      );
    });

    return NextResponse.json({
      query: q,
      destinations: fallbackDestinations,
      matched_packages: fallbackPackages,
      total: fallbackDestinations.length,
      source: 'fallback',
    });
  } catch (error: any) {
    console.error('Destination search route handler error:', error);
    return NextResponse.json(
      { error: 'Internal server error during search', details: error?.message },
      { status: 500 }
    );
  }
}
