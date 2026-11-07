# Supabase Database Setup & Configuration Guide

This document provides complete instructions to initialize, configure, and secure the Supabase backend for **The Tour Vision**.

---

## 1. Create a Supabase Project

1. Log into your [Supabase Dashboard](https://app.supabase.com).
2. Click **New Project**.
3. Set:
   - **Name:** `The Tour Vision`
   - **Database Password:** Generate and securely save a strong password.
   - **Region:** Select `ap-south-1` (Mumbai, India) or your closest region for lowest latency to Pune, India.
4. Wait for database provisioning to complete (typically 1–2 minutes).

---

## 2. Obtain API Credentials

From your Supabase project dashboard:
1. Navigate to **Project Settings** (gear icon) -> **API**.
2. Copy the following:
   - **Project URL** -> `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API Keys** -> `anon` / `public` -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Project API Keys** -> `service_role` -> `SUPABASE_SERVICE_ROLE_KEY` (Keep secret! Used ONLY by server-side APIs).

Update these values in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

---

## 3. Apply SQL Migrations

You can apply the SQL migrations in order via either the **Supabase CLI** or the **Supabase Web SQL Editor**.

### Method A: Supabase Web SQL Editor (Fastest for initial setup)
Navigate to the **SQL Editor** in your Supabase dashboard and run the files in `supabase/migrations/` in numerical order:

1. `0001_extensions_and_helpers.sql` — Extensions (`uuid-ossp`, `pgcrypto`) & utility timestamps
2. `0002_profiles_and_roles.sql` — User profiles, roles, and authorization triggers
3. `0003_destinations.sql` — Destination catalogs, countries, regional taxonomy
4. `0004_packages.sql` — Travel packages, categories, day-by-day itineraries, pricing
5. `0005_inquiries_and_crm.sql` — Leads, inquiries, follow-ups, internal CRM notes
6. `0006_bookings.sql` — Confirmed bookings, traveler rosters, payment state logs
7. `0007_quotations.sql` — Custom quotation builder, itemized pricing lines
8. `0008_reviews_and_blog.sql` — Customer testimonials and travel editorial articles
9. `0009_coupons_and_referrals.sql` — Promo codes, referral tracking
10. `0010_itineraries_and_documents.sql` — Tailored customer itineraries and private document records
11. `0011_notifications.sql` — In-app alerts for customers and administrators
12. `0012_settings_and_integrations.sql` — Global agency contact, demo badge setting
13. `0013_ai_conversations.sql` — AI concierge conversation sessions and messages
14. `0014_email_and_whatsapp_logs.sql` — Delivery records for transactional notifications
15. `0015_audit_logs.sql` — Administrative actions and security audit log
16. `0016_storage_buckets.sql` — Storage buckets (`travel-images`, `travel-documents`, `quotation-files`)
17. `0017_rls_policies.sql` — Complete Row Level Security policies for all tables
18. `0018_functions_and_triggers.sql` — Metrics calculation routines and integrity triggers
19. `0019_indexes_and_constraints.sql` — High-performance indexes for search and filtering

### Method B: Supabase CLI
```bash
supabase login
supabase link --project-ref your-project-id
supabase db push
```

---

## 4. Run Seed Data

In the Supabase SQL Editor, execute the contents of:
- `supabase/seed.sql`

This seeds:
- Luxury domestic destinations (Kashmir, Kerala, Rajasthan, Goa, Andaman)
- Exotic international destinations (Switzerland & Alps, Bali, Dubai, Maldives, Japan)
- Curated vacation packages with realistic day-by-day itineraries
- Realistic sample CRM inquiries, bookings, and customer testimonials (all clearly marked with `is_demo: true`)

---

## 5. Bootstrap the First Administrator

To prevent unauthorized privilege escalation, administrators cannot be registered directly as admins from public forms. To bootstrap your first admin:

1. **Register the Account:**
   - Go to `http://localhost:3000/auth/signup` and register with your email and secure password.
   - *(Alternative)*: In Supabase Dashboard -> **Authentication** -> **Users** -> click **Add User** -> **Create User** with your email and password.

2. **Retrieve the User UID:**
   - In Supabase Dashboard -> **Authentication** -> **Users**, locate your user row.
   - Copy the **User UID** (a 36-character UUID like `a1b2c3d4-e5f6-7890-abcd-ef1234567890`).

3. **Execute the Bootstrap Script:**
   - Open `supabase/bootstrap_admin.sql`.
   - Replace `'REPLACE_WITH_YOUR_USER_UID'` with your copied User UID.
   - Open the Supabase Dashboard -> **SQL Editor**, paste the script, and run it.
   - The script validates the UID in `auth.users`, confirms the email address, creates the administrative profile, assigns the `admin` role in `public.user_roles`, and logs the action in `public.audit_logs`.

4. **Log into Admin Command Center:**
   - Visit `http://localhost:3000/admin/login` and log in with your registered email and password.
   - You will be immediately redirected to the `/admin` dashboard.

---

## 6. Configure Supabase Auth Redirects

In the Supabase Dashboard -> **Authentication** -> **URL Configuration**:
- **Site URL:**
  - Local: `http://localhost:3000`
  - Production: `https://your-domain.vercel.app`
- **Redirect URLs:**
  - `http://localhost:3000/auth/callback`
  - `https://your-domain.vercel.app/auth/callback`
  - `http://localhost:3000/account`
  - `https://your-domain.vercel.app/account`

---

## 7. Verify Storage Buckets

Navigate to **Storage** in the Supabase Dashboard. You should see 3 buckets:
- `travel-images` (Public: Yes) — Destination galleries, package covers, blog thumbnails.
- `travel-documents` (Public: No) — Customer passports, flight e-tickets, hotel confirmation vouchers.
- `quotation-files` (Public: No) — Generated client quotation PDF documents.

These are configured automatically via `supabase/migrations/0016_storage_buckets.sql`.
