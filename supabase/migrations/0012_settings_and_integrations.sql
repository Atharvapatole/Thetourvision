-- ==============================================================================
-- 0012: Site Settings and Integrations
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Insert standard baseline agency configurations
INSERT INTO public.site_settings (key, value, description)
VALUES 
(
    'general',
    jsonb_build_object(
        'business_name', 'The Tour Vision',
        'tagline', 'Curating Extraordinary Journeys & Bespoke Travel',
        'agency_developer', 'Automate Stack',
        'headquarters', 'Koregaon Park / FC Road, Pune, Maharashtra 411001, India',
        'contact_phone', '+91 98220 12345',
        'contact_email', 'concierge@thetourvision.com',
        'support_email', 'support@thetourvision.com',
        'whatsapp_number', '+91 98220 12345',
        'office_hours', 'Monday – Saturday: 09:30 AM – 07:30 PM IST',
        'emergency_helpline', '+91 98220 99999',
        'show_demo_badge', true
    ),
    'General business contacts and demo badge flag'
),
(
    'social',
    jsonb_build_object(
        'instagram', 'https://instagram.com/thetourvision',
        'facebook', 'https://facebook.com/thetourvision',
        'linkedin', 'https://linkedin.com/company/thetourvision',
        'youtube', 'https://youtube.com/@thetourvision'
    ),
    'Social media presence profiles'
),
(
    'ai_concierge',
    jsonb_build_object(
        'provider', 'gemini',
        'system_prompt_addon', 'You are the elite AI travel concierge for The Tour Vision, an upscale agency based in Pune, Maharashtra. Offer refined, realistic itineraries and guide users toward submitting inquiry forms or contacting via WhatsApp.',
        'rate_limit_per_minute', 20,
        'enabled', true
    ),
    'AI Concierge configurations'
)
ON CONFLICT (key) DO NOTHING;
