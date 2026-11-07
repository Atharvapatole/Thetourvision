-- ==============================================================================
-- 0007: Quotations and Itemized Proposals
-- ==============================================================================

CREATE TYPE public.quotation_status AS ENUM (
    'draft',
    'sent',
    'accepted',
    'rejected',
    'expired'
);

CREATE TYPE public.quotation_item_type AS ENUM (
    'package',
    'hotel',
    'flight',
    'transport',
    'activity',
    'visa',
    'insurance',
    'custom'
);

CREATE SEQUENCE IF NOT EXISTS public.quotation_number_seq START WITH 3001;

CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_number TEXT NOT NULL UNIQUE DEFAULT ('QUO-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(nextval('public.quotation_number_seq')::TEXT, 4, '0')),
    inquiry_id UUID REFERENCES public.inquiries(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
    destination_name TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    departure_city TEXT NOT NULL DEFAULT 'Pune',
    start_date DATE,
    end_date DATE,
    adults INT NOT NULL DEFAULT 2,
    children INT NOT NULL DEFAULT 0,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
    tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 5.00, -- 5% GST standard for tour operators
    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    inclusions TEXT[] DEFAULT ARRAY[]::TEXT[],
    exclusions TEXT[] DEFAULT ARRAY[]::TEXT[],
    terms_and_conditions TEXT DEFAULT 'Quotation valid for 7 days from issue date. Subject to availability at the time of booking. Advance deposit required to lock hotel reservations.',
    valid_until DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '7 days'),
    status public.quotation_status NOT NULL DEFAULT 'draft',
    pdf_url TEXT,
    notes TEXT,
    is_demo BOOLEAN NOT NULL DEFAULT false,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_quotations_updated_at
    BEFORE UPDATE ON public.quotations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Quotation Line Items
CREATE TABLE IF NOT EXISTS public.quotation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_id UUID NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
    item_type public.quotation_item_type NOT NULL DEFAULT 'custom',
    title TEXT NOT NULL,
    description TEXT,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(12, 2) NOT NULL CHECK (total_price >= 0),
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
