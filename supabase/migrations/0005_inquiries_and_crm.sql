-- ==============================================================================
-- 0005: Inquiries and CRM Pipeline
-- ==============================================================================

-- Inquiry status enum
CREATE TYPE public.inquiry_status AS ENUM (
    'new',
    'contacted',
    'qualified',
    'quotation_sent',
    'confirmed',
    'lost'
);

-- Lead source enum
CREATE TYPE public.lead_source AS ENUM (
    'website',
    'trip_planner',
    'ai_concierge',
    'whatsapp',
    'referral',
    'phone',
    'direct'
);

-- Sequence for inquiry numbers
CREATE SEQUENCE IF NOT EXISTS public.inquiry_number_seq START WITH 1001;

-- Inquiries / Leads Table
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_number TEXT NOT NULL UNIQUE DEFAULT ('INQ-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(nextval('public.inquiry_number_seq')::TEXT, 4, '0')),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    departure_city TEXT NOT NULL DEFAULT 'Pune',
    destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
    destination_name TEXT,
    package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
    travel_dates TEXT,
    start_date DATE,
    end_date DATE,
    adults INT NOT NULL DEFAULT 2 CHECK (adults >= 1),
    children INT NOT NULL DEFAULT 0 CHECK (children >= 0),
    budget NUMERIC(12, 2) DEFAULT 0 CHECK (budget >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    travel_style TEXT,
    accommodation_preference TEXT,
    preferences JSONB DEFAULT '{}'::jsonb,
    lead_source public.lead_source NOT NULL DEFAULT 'website',
    status public.inquiry_status NOT NULL DEFAULT 'new',
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    follow_up_date TIMESTAMPTZ,
    internal_notes TEXT,
    is_demo BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_inquiries_updated_at
    BEFORE UPDATE ON public.inquiries
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Inquiry CRM Internal Notes
CREATE TABLE IF NOT EXISTS public.inquiry_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id UUID NOT NULL REFERENCES public.inquiries(id) ON DELETE CASCADE,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT,
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inquiry Status History for CRM audit trail
CREATE TABLE IF NOT EXISTS public.inquiry_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id UUID NOT NULL REFERENCES public.inquiries(id) ON DELETE CASCADE,
    old_status public.inquiry_status,
    new_status public.inquiry_status NOT NULL,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to record status transitions automatically
CREATE OR REPLACE FUNCTION public.log_inquiry_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO public.inquiry_status_history (
            inquiry_id,
            old_status,
            new_status,
            changed_by,
            notes
        )
        VALUES (
            NEW.id,
            OLD.status,
            NEW.status,
            auth.uid(),
            'Status updated via system'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_inquiry_status_changed
    AFTER UPDATE ON public.inquiries
    FOR EACH ROW
    EXECUTE FUNCTION public.log_inquiry_status_change();
