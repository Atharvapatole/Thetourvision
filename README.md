# The Tour Vision — Luxury Travel Agency & Operations Platform

> **Business:** The Tour Vision (Pune, Maharashtra, India)  
> **Built by:** Automate Stack  
> **Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Supabase (PostgreSQL, Auth, Storage), Resend, WhatsApp Cloud API, Google Gemini AI.

---

## Overview

**The Tour Vision** is a complete, production-grade enterprise travel agency platform designed for high-end international and domestic travel curation. It blends an editorial luxury travel discovery portal for prospective voyagers with a business management system featuring CRM lead tracking, interactive quotation generation with PDF exports, live booking workflows, a self-service customer portal, and an AI-powered concierge.

---

## Key Highlights

- **Luxury Customer Discovery:** High-resolution destination portfolios, customizable tour packages with day-wise itineraries, multi-parameter trip planner, and interactive AI travel assistant.
- **Enterprise CRM & Lead Management:** Complete pipeline from inquiry to qualified lead, quotation dispatch, and confirmed booking with internal notes and team assignment.
- **Automated Quotation Engine & PDF Generation:** Interactive quotation builder computing itemized hotel stays, transport, tours, taxes, and discounts with instant branded PDF output.
- **Self-Service Customer Portal:** Secure customer portal (`/account`) where travelers inspect inquiries, approved itineraries, invoices, and vouchers backed by Supabase Row Level Security (RLS).
- **Administrative Command Center:** Live dashboard analytics derived from PostgreSQL records, package & destination CMS, review moderation, and site configuration.
- **Omnichannel Communication:** Pre-integrated with Resend for transactional email notifications and WhatsApp Cloud API for lead notifications.
- **Configurable Demo Mode:** Persistent, unobtrusive demo badge that can be toggled through the admin settings.

---

## Quick Start Guide

### 1. Prerequisites
- Node.js 18.x or 20.x+
- A free or pro [Supabase](https://supabase.com) account
- (Optional) [Resend](https://resend.com) API Key for transactional emails
- (Optional) [Google AI Studio](https://aistudio.google.com/) API Key for Gemini Travel Concierge

### 2. Environment Setup
Clone the repository and copy the example environment file:
```bash
cp .env.example .env.local
```
Fill in your Supabase project URL, Anon Key, and Service Role Key (from your Supabase dashboard).

### 3. Database Migrations
Follow the detailed step-by-step instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to apply the 19 migration scripts located in `supabase/migrations/` and run `supabase/seed.sql`.

### 4. Install Dependencies & Run Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the public website.

### 5. Accessing the Admin Command Center
1. Sign up a user in Supabase Auth or through the `/auth/signup` page.
2. Execute the script in `supabase/bootstrap_admin.sql` in the Supabase SQL editor using that user's UUID.
3. Log in at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

---

## Documentation Index

- [PROJECT_PLAN.md](./PROJECT_PLAN.md) — Comprehensive technical architecture, entity diagrams & phases.
- [PROJECT_STATUS.md](./PROJECT_STATUS.md) — Active phase tracking and implementation checklist.
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) — Complete guide for database setup, migrations, buckets & bootstrap.
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Vercel production deployment and environment configuration.
- [SECURITY.md](./SECURITY.md) — Row Level Security (RLS), role verification, credential isolation & security protocols.

---

## License & Attribution

Designed and developed by **Automate Stack** for **The Tour Vision**, Pune, Maharashtra, India.
All rights reserved.
