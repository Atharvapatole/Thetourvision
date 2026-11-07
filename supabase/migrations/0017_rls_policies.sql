-- ==============================================================================
-- 0017: Comprehensive Row Level Security (RLS) Policies (Idempotent)
-- ==============================================================================

-- 1. Enable RLS on ALL tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiry_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiry_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- Profiles
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can read own profile or staff can read all" ON public.profiles;
CREATE POLICY "Users can read own profile or staff can read all"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_staff_or_admin() = true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- User Roles (Strictly admin managed; users can read own role)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can read own role or admins read all" ON public.user_roles;
CREATE POLICY "Users can read own role or admins read all"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin() = true);

DROP POLICY IF EXISTS "Only admins can insert, update, delete roles" ON public.user_roles;
CREATE POLICY "Only admins can insert, update, delete roles"
    ON public.user_roles FOR ALL
    USING (public.is_admin() = true)
    WITH CHECK (public.is_admin() = true);

-- ------------------------------------------------------------------------------
-- Destinations & Package Categories & Packages (Public Read for published)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public read published destinations or staff read all" ON public.destinations;
CREATE POLICY "Public read published destinations or staff read all"
    ON public.destinations FOR SELECT
    USING (is_published = true OR public.is_staff_or_admin() = true);

DROP POLICY IF EXISTS "Staff or Admin full access to destinations" ON public.destinations;
CREATE POLICY "Staff or Admin full access to destinations"
    ON public.destinations FOR ALL
    USING (public.is_staff_or_admin() = true)
    WITH CHECK (public.is_staff_or_admin() = true);

DROP POLICY IF EXISTS "Public read package categories" ON public.package_categories;
CREATE POLICY "Public read package categories"
    ON public.package_categories FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Staff or Admin manage package categories" ON public.package_categories;
CREATE POLICY "Staff or Admin manage package categories"
    ON public.package_categories FOR ALL
    USING (public.is_staff_or_admin() = true)
    WITH CHECK (public.is_staff_or_admin() = true);

DROP POLICY IF EXISTS "Public read published packages or staff read all" ON public.packages;
CREATE POLICY "Public read published packages or staff read all"
    ON public.packages FOR SELECT
    USING (is_published = true OR public.is_staff_or_admin() = true);

DROP POLICY IF EXISTS "Staff or Admin full access to packages" ON public.packages;
CREATE POLICY "Staff or Admin full access to packages"
    ON public.packages FOR ALL
    USING (public.is_staff_or_admin() = true)
    WITH CHECK (public.is_staff_or_admin() = true);

-- ------------------------------------------------------------------------------
-- Inquiries (Public/customer can insert; customer view own; staff manage all)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can create an inquiry" ON public.inquiries;
CREATE POLICY "Anyone can create an inquiry"
    ON public.inquiries FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Customers view own inquiries or staff view all" ON public.inquiries;
CREATE POLICY "Customers view own inquiries or staff view all"
    ON public.inquiries FOR SELECT
    USING (
        (auth.uid() IS NOT NULL AND user_id = auth.uid()) 
        OR public.is_staff_or_admin() = true
    );

DROP POLICY IF EXISTS "Staff or Admin manage inquiries" ON public.inquiries;
CREATE POLICY "Staff or Admin manage inquiries"
    ON public.inquiries FOR UPDATE
    USING (public.is_staff_or_admin() = true)
    WITH CHECK (public.is_staff_or_admin() = true);

DROP POLICY IF EXISTS "Only Admin can delete inquiries" ON public.inquiries;
CREATE POLICY "Only Admin can delete inquiries"
    ON public.inquiries FOR DELETE
    USING (public.is_admin() = true);

DROP POLICY IF EXISTS "Staff read inquiry notes" ON public.inquiry_notes;
CREATE POLICY "Staff read inquiry notes"
    ON public.inquiry_notes FOR SELECT
    USING (public.is_staff_or_admin() = true);

DROP POLICY IF EXISTS "Staff manage inquiry notes" ON public.inquiry_notes;
CREATE POLICY "Staff manage inquiry notes"
    ON public.inquiry_notes FOR ALL
    USING (public.is_staff_or_admin() = true)
    WITH CHECK (public.is_staff_or_admin() = true);

DROP POLICY IF EXISTS "Staff read inquiry status history" ON public.inquiry_status_history;
CREATE POLICY "Staff read inquiry status history"
    ON public.inquiry_status_history FOR SELECT
    USING (public.is_staff_or_admin() = true);

-- ------------------------------------------------------------------------------
-- Bookings (Customers see own; staff manage all)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Customers view own bookings or staff view all" ON public.bookings;
CREATE POLICY "Customers view own bookings or staff view all"
    ON public.bookings FOR SELECT
    USING (
        (auth.uid() IS NOT NULL AND customer_id = auth.uid())
        OR public.is_staff_or_admin() = true
    );

DROP POLICY IF EXISTS "Staff or Admin manage bookings" ON public.bookings;
CREATE POLICY "Staff or Admin manage bookings"
    ON public.bookings FOR ALL
    USING (public.is_staff_or_admin() = true)
    WITH CHECK (public.is_staff_or_admin() = true);

DROP POLICY IF EXISTS "Customers view own booking status history or staff view all" ON public.booking_status_history;
CREATE POLICY "Customers view own booking status history or staff view all"
    ON public.booking_status_history FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.bookings b 
            WHERE b.id = booking_status_history.booking_id 
            AND (b.customer_id = auth.uid() OR public.is_staff_or_admin() = true)
        )
    );

-- ------------------------------------------------------------------------------
-- Quotations & Line Items (Customers see own; staff manage all)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Customers view own quotations or staff view all" ON public.quotations;
CREATE POLICY "Customers view own quotations or staff view all"
    ON public.quotations FOR SELECT
    USING (
        (auth.uid() IS NOT NULL AND customer_id = auth.uid())
        OR public.is_staff_or_admin() = true
    );

DROP POLICY IF EXISTS "Staff manage quotations" ON public.quotations;
CREATE POLICY "Staff manage quotations"
    ON public.quotations FOR ALL
    USING (public.is_staff_or_admin() = true)
    WITH CHECK (public.is_staff_or_admin() = true);

DROP POLICY IF EXISTS "Read quotation items if can read quotation" ON public.quotation_items;
CREATE POLICY "Read quotation items if can read quotation"
    ON public.quotation_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.quotations q
            WHERE q.id = quotation_items.quotation_id
            AND (q.customer_id = auth.uid() OR public.is_staff_or_admin() = true)
        )
    );

DROP POLICY IF EXISTS "Staff manage quotation items" ON public.quotation_items;
CREATE POLICY "Staff manage quotation items"
    ON public.quotation_items FOR ALL
    USING (public.is_staff_or_admin() = true)
    WITH CHECK (public.is_staff_or_admin() = true);

-- ------------------------------------------------------------------------------
-- Reviews (Public read published; customers insert own; staff manage)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public read published reviews" ON public.reviews;
CREATE POLICY "Public read published reviews"
    ON public.reviews FOR SELECT
    USING (is_published = true OR public.is_staff_or_admin() = true);

DROP POLICY IF EXISTS "Authenticated users can submit a review" ON public.reviews;
CREATE POLICY "Authenticated users can submit a review"
    ON public.reviews FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Staff manage reviews" ON public.reviews;
CREATE POLICY "Staff manage reviews"
    ON public.reviews FOR ALL
    USING (public.is_staff_or_admin() = true)
    WITH CHECK (public.is_staff_or_admin() = true);

-- ------------------------------------------------------------------------------
-- Blog (Public read published; staff manage)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public read blog categories" ON public.blog_categories;
CREATE POLICY "Public read blog categories"
    ON public.blog_categories FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Staff manage blog categories" ON public.blog_categories;
CREATE POLICY "Staff manage blog categories"
    ON public.blog_categories FOR ALL
    USING (public.is_staff_or_admin() = true)
    WITH CHECK (public.is_staff_or_admin() = true);

DROP POLICY IF EXISTS "Public read published blog posts" ON public.blog_posts;
CREATE POLICY "Public read published blog posts"
    ON public.blog_posts FOR SELECT
    USING (is_published = true OR public.is_staff_or_admin() = true);

DROP POLICY IF EXISTS "Staff manage blog posts" ON public.blog_posts;
CREATE POLICY "Staff manage blog posts"
    ON public.blog_posts FOR ALL
    USING (public.is_staff_or_admin() = true)
    WITH CHECK (public.is_staff_or_admin() = true);

-- ------------------------------------------------------------------------------
-- Coupons and Referrals
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public read active coupons" ON public.coupons;
CREATE POLICY "Public read active coupons"
    ON public.coupons FOR SELECT
    USING (is_active = true OR public.is_staff_or_admin() = true);

DROP POLICY IF EXISTS "Staff manage coupons" ON public.coupons;
CREATE POLICY "Staff manage coupons"
    ON public.coupons FOR ALL
    USING (public.is_staff_or_admin() = true)
    WITH CHECK (public.is_staff_or_admin() = true);

DROP POLICY IF EXISTS "Users view own coupon redemptions" ON public.coupon_redemptions;
CREATE POLICY "Users view own coupon redemptions"
    ON public.coupon_redemptions FOR SELECT
    USING (auth.uid() = user_id OR public.is_staff_or_admin() = true);

DROP POLICY IF EXISTS "Users view own referrals" ON public.referrals;
CREATE POLICY "Users view own referrals"
    ON public.referrals FOR SELECT
    USING (auth.uid() = referrer_id OR public.is_staff_or_admin() = true);

DROP POLICY IF EXISTS "Staff manage referrals" ON public.referrals;
CREATE POLICY "Staff manage referrals"
    ON public.referrals FOR ALL
    USING (public.is_staff_or_admin() = true)
    WITH CHECK (public.is_staff_or_admin() = true);

-- ------------------------------------------------------------------------------
-- Itineraries and Documents
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Customers view own itineraries or staff view all" ON public.itineraries;
CREATE POLICY "Customers view own itineraries or staff view all"
    ON public.itineraries FOR SELECT
    USING (customer_id = auth.uid() OR public.is_staff_or_admin() = true);

DROP POLICY IF EXISTS "Staff manage itineraries" ON public.itineraries;
CREATE POLICY "Staff manage itineraries"
    ON public.itineraries FOR ALL
    USING (public.is_staff_or_admin() = true)
    WITH CHECK (public.is_staff_or_admin() = true);

DROP POLICY IF EXISTS "Customers view own documents or staff view all" ON public.customer_documents;
CREATE POLICY "Customers view own documents or staff view all"
    ON public.customer_documents FOR SELECT
    USING (customer_id = auth.uid() OR public.is_staff_or_admin() = true);

DROP POLICY IF EXISTS "Staff manage customer documents" ON public.customer_documents;
CREATE POLICY "Staff manage customer documents"
    ON public.customer_documents FOR ALL
    USING (public.is_staff_or_admin() = true)
    WITH CHECK (public.is_staff_or_admin() = true);

-- ------------------------------------------------------------------------------
-- Notifications
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users read own notifications" ON public.notifications;
CREATE POLICY "Users read own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own notifications (mark read)" ON public.notifications;
CREATE POLICY "Users update own notifications (mark read)"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- Site Settings (Public read; admin manage)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public read site settings" ON public.site_settings;
CREATE POLICY "Public read site settings"
    ON public.site_settings FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admin manage site settings" ON public.site_settings;
CREATE POLICY "Admin manage site settings"
    ON public.site_settings FOR ALL
    USING (public.is_admin() = true)
    WITH CHECK (public.is_admin() = true);

-- ------------------------------------------------------------------------------
-- AI Conversations
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users read own AI conversations" ON public.ai_conversations;
CREATE POLICY "Users read own AI conversations"
    ON public.ai_conversations FOR SELECT
    USING (
        (auth.uid() IS NOT NULL AND user_id = auth.uid())
        OR public.is_staff_or_admin() = true
    );

DROP POLICY IF EXISTS "Users create own AI conversations" ON public.ai_conversations;
CREATE POLICY "Users create own AI conversations"
    ON public.ai_conversations FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Users read/write messages in their conversation" ON public.ai_messages;
CREATE POLICY "Users read/write messages in their conversation"
    ON public.ai_messages FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.ai_conversations c
            WHERE c.id = ai_messages.conversation_id
            AND (c.user_id = auth.uid() OR c.user_id IS NULL OR public.is_staff_or_admin() = true)
        )
    );

-- ------------------------------------------------------------------------------
-- Logs & Audit
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Staff view email logs" ON public.email_logs;
CREATE POLICY "Staff view email logs"
    ON public.email_logs FOR SELECT
    USING (public.is_staff_or_admin() = true);

DROP POLICY IF EXISTS "Staff view whatsapp logs" ON public.whatsapp_logs;
CREATE POLICY "Staff view whatsapp logs"
    ON public.whatsapp_logs FOR SELECT
    USING (public.is_staff_or_admin() = true);

DROP POLICY IF EXISTS "Only admins view audit logs" ON public.audit_logs;
CREATE POLICY "Only admins view audit logs"
    ON public.audit_logs FOR SELECT
    USING (public.is_admin() = true);
