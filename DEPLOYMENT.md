# Vercel Production Deployment Guide

This guide details how to deploy **The Tour Vision** onto Vercel with complete environment variable wiring, custom domain configuration, and continuous deployment.

---

## 1. Prerequisites
- A GitHub repository with this codebase pushed.
- A [Vercel](https://vercel.com) account.
- A live [Supabase](https://supabase.com) project with migrations applied.

---

## 2. Deploy via Vercel Dashboard

1. Log into **Vercel** and click **Add New...** -> **Project**.
2. Select your GitHub repository (`THETOURVISION_WEBSITE` or your chosen repo name).
3. In **Configure Project**:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

4. Add the following **Environment Variables** in the Vercel project settings:

| Variable Name | Description | Environment |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production URL (e.g. `https://thetourvision.vercel.app`) | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Public Anon Key | All |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key (Server-side ONLY) | Production, Preview |
| `NEXT_PUBLIC_ENABLE_DEMO_BADGE` | Set to `"true"` or `"false"` | All |
| `RESEND_API_KEY` | Resend API key for transactional emails | Production |
| `EMAIL_FROM` | Sender identity (e.g. `The Tour Vision <concierge@thetourvision.com>`) | Production |
| `GEMINI_API_KEY` | Google Gemini API key for AI Concierge | Production |
| `AI_PROVIDER` | `"gemini"` | Production |
| `NEXT_PUBLIC_WHATSAPP_PHONE` | Agency WhatsApp number (e.g. `919876543210`) | All |

5. Click **Deploy**.

---

## 3. Post-Deployment Verification Checklist

1. **Verify Public Pages:**
   - Homepage loads with hero video/imagery, destination carousels, and package listings.
   - Test package detail pages (e.g. `/packages/royal-rajasthan-heritage-experience`).
   - Check destination detail pages (e.g. `/destinations/switzerland-alps`).

2. **Verify Lead Generation & Inquiries:**
   - Submit a test inquiry on any package or via `/trip-planner`.
   - Confirm the record is saved to the `inquiries` table in Supabase.

3. **Verify Customer Authentication:**
   - Test user registration at `/auth/signup`.
   - Confirm verification email or auto-confirmation in Supabase Auth.
   - Access customer dashboard at `/account`.

4. **Verify Admin Security:**
   - Attempt to access `/admin` with a regular customer account (should be redirected to unauthorized/login).
   - Log into `/admin/login` using your bootstrapped admin account.
   - Verify that metrics, lead pipeline, package creation, and quotation generator function properly.

5. **Verify PDF Generation:**
   - Go to `/admin/quotations/new`, build a sample quotation, and click **Generate & Download PDF**.
   - Verify the branded PDF with The Tour Vision Pune letterhead downloads cleanly.
