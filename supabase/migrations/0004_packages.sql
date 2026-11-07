-- ==============================================================================
-- 0004: Packages and Package Categories
-- ==============================================================================

-- Package Categories
CREATE TABLE IF NOT EXISTS public.package_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_name TEXT,
    image_url TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Pricing type enum
CREATE TYPE public.pricing_type AS ENUM ('per_person', 'per_couple', 'per_group');

-- Tour Packages
CREATE TABLE IF NOT EXISTS public.packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.package_categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    days INT NOT NULL CHECK (days > 0),
    nights INT NOT NULL CHECK (nights >= 0),
    price_inr NUMERIC(12, 2) NOT NULL CHECK (price_inr >= 0),
    discounted_price_inr NUMERIC(12, 2) CHECK (discounted_price_inr >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    pricing_type public.pricing_type NOT NULL DEFAULT 'per_person',
    cover_image TEXT NOT NULL,
    gallery TEXT[] DEFAULT ARRAY[]::TEXT[],
    itinerary JSONB NOT NULL DEFAULT '[]'::jsonb,
    accommodation_grade TEXT DEFAULT '4-Star Luxury',
    hotel_details TEXT,
    inclusions TEXT[] DEFAULT ARRAY[]::TEXT[],
    exclusions TEXT[] DEFAULT ARRAY[]::TEXT[],
    highlights TEXT[] DEFAULT ARRAY[]::TEXT[],
    min_travelers INT NOT NULL DEFAULT 1,
    max_travelers INT NOT NULL DEFAULT 20,
    departure_city TEXT DEFAULT 'Pune / Mumbai',
    seasonal_offer TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_packages_updated_at
    BEFORE UPDATE ON public.packages
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
