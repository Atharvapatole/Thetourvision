# The Tour Vision — Supabase Architecture & Migrations

This directory contains the database schema, security definitions, storage rules, triggers, and seed scripts for **The Tour Vision**.

## Migration Order
1. `0001_extensions_and_helpers.sql` — PostgreSQL extensions and helper triggers.
2. `0002_profiles_and_roles.sql` — User profiles, roles, and authorization functions.
3. `0003_destinations.sql` — Destination records, countries, regions, and SEO metadata.
4. `0004_packages.sql` — Travel packages, categories, itineraries, pricing.
5. `0005_inquiries_and_crm.sql` — CRM lead management, inquiries, follow-ups, notes.
6. `0006_bookings.sql` — Confirmed bookings, travelers roster, payment states.
7. `0007_quotations.sql` — Quotation generator, itemized breakdown, validity.
8. `0008_reviews_and_blog.sql` — Customer testimonials and travel editorial magazine.
9. `0009_coupons_and_referrals.sql` — Promotional discounts and referral codes.
10. `0010_itineraries_and_documents.sql` — Custom itineraries and private travel docs.
11. `0011_notifications.sql` — In-app notification center.
12. `0012_settings_and_integrations.sql` — Agency contact, demo badge switch.
13. `0013_ai_conversations.sql` — AI concierge conversation logs.
14. `0014_email_and_whatsapp_logs.sql` — Transactional email and WhatsApp logs.
15. `0015_audit_logs.sql` — Security and management audit records.
16. `0016_storage_buckets.sql` — Storage buckets and storage security policies.
17. `0017_rls_policies.sql` — Comprehensive Row Level Security policies.
18. `0018_functions_and_triggers.sql` — Auto-numbering, metrics calculation.
19. `0019_indexes_and_constraints.sql` — B-tree and text search indexes.

## Scripts
- `bootstrap_admin.sql` — Instructions & SQL procedure to promote an authenticated user to Admin.
- `seed.sql` — Realistic luxury destinations, packages, reviews, and demo CRM records.
