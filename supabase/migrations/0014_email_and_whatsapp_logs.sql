-- ==============================================================================
-- 0014: Email and WhatsApp Communication Logs
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_email TEXT NOT NULL,
    template_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'sent', -- 'sent', 'delivered', 'failed', 'mock'
    provider_id TEXT,
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.whatsapp_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_phone TEXT NOT NULL,
    message_type TEXT NOT NULL DEFAULT 'click_to_chat', -- 'click_to_chat', 'cloud_api_template', 'cloud_api_message'
    template_name TEXT,
    status TEXT NOT NULL DEFAULT 'sent',
    payload JSONB DEFAULT '{}'::jsonb,
    provider_message_id TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
