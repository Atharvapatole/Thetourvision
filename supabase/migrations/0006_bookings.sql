-- ==============================================================================
-- 0006: Bookings and Travelers
-- ==============================================================================

-- Booking status enum
CREATE TYPE public.booking_status AS ENUM (
    'pending',
    'confirmed',
    'in_progress',
    'completed',
    'cancelled'
);

-- Payment status enum
CREATE TYPE public.payment_status AS ENUM (
    'unpaid',
    'pending',
    'partially_paid',
    'paid',
    'refunded'
);

-- Sequence for booking references
CREATE SEQUENCE IF NOT EXISTS public.booking_reference_seq START WITH 5001;

-- Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference TEXT NOT NULL UNIQUE DEFAULT ('TTV-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(nextval('public.booking_reference_seq')::TEXT, 4, '0')),
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    inquiry_id UUID REFERENCES public.inquiries(id) ON DELETE SET NULL,
    package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
    destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    adults INT NOT NULL DEFAULT 1 CHECK (adults >= 1),
    children INT NOT NULL DEFAULT 0 CHECK (children >= 0),
    traveler_details JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    paid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (paid_amount >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    payment_status public.payment_status NOT NULL DEFAULT 'unpaid',
    booking_status public.booking_status NOT NULL DEFAULT 'pending',
    special_requests TEXT,
    admin_notes TEXT,
    is_demo BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Booking Status History
CREATE TABLE IF NOT EXISTS public.booking_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    old_booking_status public.booking_status,
    new_booking_status public.booking_status NOT NULL,
    old_payment_status public.payment_status,
    new_payment_status public.payment_status,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.log_booking_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.booking_status IS DISTINCT FROM NEW.booking_status OR OLD.payment_status IS DISTINCT FROM NEW.payment_status) THEN
        INSERT INTO public.booking_status_history (
            booking_id,
            old_booking_status,
            new_booking_status,
            old_payment_status,
            new_payment_status,
            changed_by,
            comment
        )
        VALUES (
            NEW.id,
            OLD.booking_status,
            NEW.booking_status,
            OLD.payment_status,
            NEW.payment_status,
            auth.uid(),
            'Status updated via system'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_booking_status_changed
    AFTER UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.log_booking_status_change();
