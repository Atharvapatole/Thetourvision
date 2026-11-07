# Security Architecture & Protocols

**The Tour Vision Platform** adheres to a defense-in-depth security model to safeguard traveler data, agency pricing structures, quotation documents, and administrative functions.

---

## 1. Authentication & Session Architecture

- **Supabase Auth with `@supabase/ssr`**:
  - Secure session management utilizing HTTP-only, `SameSite=Lax`, encrypted cookies.
  - No client-side storage of raw access tokens or sensitive user credentials in `localStorage` or `sessionStorage`.
  - Automated session refresh handled via Next.js Middleware.

- **Role-Based Access Control (RBAC)**:
  - Three distinct user tiers: `admin`, `staff`, `customer`.
  - Roles are enforced server-side through a dedicated `user_roles` table backed by PostgreSQL functions (`auth.uid()`).
  - **No Client Privilege Escalation**: Role fields are never accepted from client-side inputs or signup forms. The user profile creation trigger (`handle_new_user`) strictly defaults every new user to `customer`. Promotion to `staff` or `admin` requires an explicit, audited database function (`promote_user_to_admin`) or an active administrator.

---

## 2. Row Level Security (RLS) Matrix

Row Level Security is enabled on **all 20+ application tables**. The database rejects direct queries unless explicitly permitted by policy:

| Table | Anonymous / Public | Customer | Staff / Admin |
|---|---|---|---|
| `destinations` | SELECT (if `is_published = true`) | SELECT (if `is_published = true`) | ALL (CRUD) |
| `packages` | SELECT (if `is_published = true`) | SELECT (if `is_published = true`) | ALL (CRUD) |
| `inquiries` | INSERT (with validation) | SELECT / INSERT (own inquiries) | ALL (CRUD) |
| `bookings` | None | SELECT (own bookings) | ALL (CRUD) |
| `quotations` | None | SELECT (own quotations) | ALL (CRUD) |
| `customer_documents`| None | SELECT (own documents) | ALL (CRUD) |
| `reviews` | SELECT (if `is_published = true`) | INSERT (own reviews) | ALL (CRUD) |
| `blog_posts` | SELECT (if `is_published = true`) | SELECT (if `is_published = true`) | ALL (CRUD) |
| `coupons` | SELECT (active only) | SELECT (active only) | ALL (CRUD) |
| `audit_logs` | None | None | SELECT (Admin only) |

---

## 3. Storage Security & Bucket Policies

Storage is partitioned into public and private buckets:
1. `travel-images`:
   - **Public**: Yes (Read-only for public visitors).
   - **Upload/Delete**: Authenticated Staff and Admins only.
2. `travel-documents`:
   - **Public**: No.
   - **Read**: The traveler who owns the document or an authenticated admin.
   - **Upload/Delete**: Admins and authorized staff.
3. `quotation-files`:
   - **Public**: No.
   - **Read**: Authenticated client matching the quotation's email/user ID or admin.
   - **Upload/Delete**: Admin only.

---

## 4. Server-Side Protection & API Isolation

- **Service Role Key Isolation**:
  - The `SUPABASE_SERVICE_ROLE_KEY` is exclusively accessed within Server Actions or internal Route Handlers (`src/lib/supabase/admin.ts`).
  - It is **never** prefixed with `NEXT_PUBLIC_` and never bundled into client-side JS bundles.
- **Input Validation**:
  - Every form submission and API payload is validated against strict **Zod** schemas before reaching the database.
- **Rate Limiting & Spam Prevention**:
  - Public lead inquiry endpoints enforce honeypot checks and server-side rate limits to prevent automated form flooding.
- **AI Safety & Graceful Fallbacks**:
  - The AI travel assistant runs behind a server-side route handler with rate limits and response parsing. The system prompt explicitly forbids claiming verified availability, instant booking confirmation, or fabricated pricing.
