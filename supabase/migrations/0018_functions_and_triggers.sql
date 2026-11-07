-- ==============================================================================
-- 0018: Advanced Business Functions and Analytical Routines
-- ==============================================================================

-- Admin Dashboard Real-Time Metrics Aggregator
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_metrics()
RETURNS JSONB AS $$
DECLARE
    v_total_inquiries BIGINT;
    v_new_inquiries BIGINT;
    v_qualified_leads BIGINT;
    v_quotations_sent BIGINT;
    v_confirmed_bookings BIGINT;
    v_total_booking_value NUMERIC(14, 2);
    v_paid_revenue NUMERIC(14, 2);
    v_conversion_rate NUMERIC(5, 2);
    v_popular_destinations JSONB;
    v_recent_inquiries JSONB;
    v_recent_bookings JSONB;
BEGIN
    -- Check permissions
    IF NOT public.is_staff_or_admin() THEN
        RAISE EXCEPTION 'Access Denied: Only staff or administrators can retrieve business metrics';
    END IF;

    -- Inquiries stats
    SELECT COUNT(*) INTO v_total_inquiries FROM public.inquiries;
    SELECT COUNT(*) INTO v_new_inquiries FROM public.inquiries WHERE status = 'new';
    SELECT COUNT(*) INTO v_qualified_leads FROM public.inquiries WHERE status = 'qualified';
    SELECT COUNT(*) INTO v_quotations_sent FROM public.quotations WHERE status = 'sent';

    -- Bookings stats
    SELECT COUNT(*) INTO v_confirmed_bookings FROM public.bookings WHERE booking_status = 'confirmed';
    SELECT COALESCE(SUM(total_amount), 0) INTO v_total_booking_value FROM public.bookings WHERE booking_status != 'cancelled';
    SELECT COALESCE(SUM(paid_amount), 0) INTO v_paid_revenue FROM public.bookings;

    -- Conversion rate (% of inquiries that became confirmed bookings)
    IF v_total_inquiries > 0 THEN
        v_conversion_rate := ROUND((v_confirmed_bookings::NUMERIC / v_total_inquiries::NUMERIC) * 100, 2);
    ELSE
        v_conversion_rate := 0.00;
    END IF;

    -- Popular destinations
    SELECT jsonb_agg(d_stats) INTO v_popular_destinations
    FROM (
        SELECT d.name, COUNT(i.id) AS inquiry_count
        FROM public.destinations d
        LEFT JOIN public.inquiries i ON i.destination_id = d.id
        GROUP BY d.id, d.name
        ORDER BY inquiry_count DESC
        LIMIT 5
    ) d_stats;

    -- Recent inquiries
    SELECT jsonb_agg(inq) INTO v_recent_inquiries
    FROM (
        SELECT id, inquiry_number, customer_name, email, phone, destination_name, status, created_at
        FROM public.inquiries
        ORDER BY created_at DESC
        LIMIT 5
    ) inq;

    -- Recent bookings
    SELECT jsonb_agg(bkg) INTO v_recent_bookings
    FROM (
        SELECT id, booking_reference, customer_name, total_amount, currency, booking_status, payment_status, created_at
        FROM public.bookings
        ORDER BY created_at DESC
        LIMIT 5
    ) bkg;

    RETURN jsonb_build_object(
        'total_inquiries', COALESCE(v_total_inquiries, 0),
        'new_inquiries', COALESCE(v_new_inquiries, 0),
        'qualified_leads', COALESCE(v_qualified_leads, 0),
        'quotations_sent', COALESCE(v_quotations_sent, 0),
        'confirmed_bookings', COALESCE(v_confirmed_bookings, 0),
        'total_booking_value', COALESCE(v_total_booking_value, 0),
        'paid_revenue', COALESCE(v_paid_revenue, 0),
        'conversion_rate', COALESCE(v_conversion_rate, 0),
        'popular_destinations', COALESCE(v_popular_destinations, '[]'::jsonb),
        'recent_inquiries', COALESCE(v_recent_inquiries, '[]'::jsonb),
        'recent_bookings', COALESCE(v_recent_bookings, '[]'::jsonb)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Procedure to promote a user to admin securely
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Insert or update user_role
    INSERT INTO public.user_roles (user_id, role, granted_at)
    VALUES (target_user_id, 'admin'::public.app_role, NOW())
    ON CONFLICT (user_id, role) DO NOTHING;

    -- Audit record
    INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, details)
    VALUES (
        auth.uid(),
        'PROMOTE_ADMIN',
        'user_roles',
        target_user_id::TEXT,
        jsonb_build_object('promoted_user_id', target_user_id)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
