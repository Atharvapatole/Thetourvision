-- ==============================================================================
-- 0003: Destinations
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    country TEXT NOT NULL,
    region TEXT NOT NULL,
    is_domestic BOOLEAN NOT NULL DEFAULT true,
    tagline TEXT,
    overview TEXT NOT NULL,
    highlights TEXT[] DEFAULT ARRAY[]::TEXT[],
    best_season TEXT,
    climate_info TEXT,
    hero_image TEXT NOT NULL,
    gallery TEXT[] DEFAULT ARRAY[]::TEXT[],
    travel_tips TEXT[] DEFAULT ARRAY[]::TEXT[],
    coordinates JSONB DEFAULT '{"lat": 0, "lng": 0}'::jsonb,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_destinations_updated_at
    BEFORE UPDATE ON public.destinations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
