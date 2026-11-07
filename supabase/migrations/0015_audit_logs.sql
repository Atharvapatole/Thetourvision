-- ==============================================================================
-- 0015: Security & Admin Audit Logs
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT,
    action TEXT NOT NULL, -- e.g. 'PROMOTE_ADMIN', 'DELETE_PACKAGE', 'UPDATE_SETTINGS', 'ACCEPT_BOOKING'
    entity_type TEXT NOT NULL, -- 'package', 'destination', 'booking', 'quotation', 'user'
    entity_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
