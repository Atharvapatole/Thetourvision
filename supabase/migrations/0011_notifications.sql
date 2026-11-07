-- ==============================================================================
-- 0011: In-App Notifications
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    notification_type TEXT DEFAULT 'system', -- 'inquiry', 'quotation', 'booking', 'voucher', 'system'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
