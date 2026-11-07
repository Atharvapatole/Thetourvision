-- ==============================================================================
-- 0019: High-Performance Database Indexes & Constraints
-- ==============================================================================

-- Destinations
CREATE INDEX IF NOT EXISTS idx_destinations_slug ON public.destinations(slug);
CREATE INDEX IF NOT EXISTS idx_destinations_published_featured ON public.destinations(is_published, is_featured);
CREATE INDEX IF NOT EXISTS idx_destinations_domestic ON public.destinations(is_domestic, is_published);

-- Packages
CREATE INDEX IF NOT EXISTS idx_packages_slug ON public.packages(slug);
CREATE INDEX IF NOT EXISTS idx_packages_destination ON public.packages(destination_id);
CREATE INDEX IF NOT EXISTS idx_packages_category ON public.packages(category_id);
CREATE INDEX IF NOT EXISTS idx_packages_published_price ON public.packages(is_published, price_inr);
CREATE INDEX IF NOT EXISTS idx_packages_featured ON public.packages(is_featured, is_published);

-- Inquiries / CRM
CREATE INDEX IF NOT EXISTS idx_inquiries_number ON public.inquiries(inquiry_number);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_user_id ON public.inquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_assigned_to ON public.inquiries(assigned_to);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);

-- Bookings
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON public.bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);

-- Quotations
CREATE INDEX IF NOT EXISTS idx_quotations_number ON public.quotations(quotation_number);
CREATE INDEX IF NOT EXISTS idx_quotations_customer_id ON public.quotations(customer_id);
CREATE INDEX IF NOT EXISTS idx_quotations_inquiry_id ON public.quotations(inquiry_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON public.quotations(status);

-- Reviews & Blog
CREATE INDEX IF NOT EXISTS idx_reviews_published ON public.reviews(is_published, is_featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(is_published, published_at DESC);

-- User Roles & Notifications
CREATE INDEX IF NOT EXISTS idx_user_roles_lookup ON public.user_roles(user_id, role);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read);
