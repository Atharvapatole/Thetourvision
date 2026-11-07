-- ==============================================================================
-- THE TOUR VISION — SECURE ADMINISTRATOR BOOTSTRAP SCRIPT (UID-BASED)
-- ==============================================================================
-- Development Agency: Automate Stack
-- Project: The Tour Vision (Pune, Maharashtra, India)
-- Supabase Project Ref: vyvpaqwnbbdjjvwryqvw
--
-- HOW TO USE THIS SCRIPT:
-- 1. Ensure you have registered an account:
--    - Sign up at http://localhost:3000/auth/signup with your email and password.
--    - (Alternative: In Supabase Dashboard -> Authentication -> Users -> "Add user").
--
-- 2. Obtain your User UID:
--    - In the Supabase SQL Editor, you can run this query to find your UID:
--        SELECT id AS user_uid, email, created_at, email_confirmed_at FROM auth.users ORDER BY created_at DESC;
--    - Or in Supabase Dashboard -> Authentication -> Users, copy the "User UID".
--
-- 3. Paste your User UID on line 30 replacing 'PASTE_ACTUAL_USER_UID_HERE'.
--    Example: target_uid_input TEXT := '550e8400-e29b-41d4-a716-446655440000';
--
-- 4. Run this script in the Supabase SQL Editor.
--
-- 5. Log in at http://localhost:3000/admin/login with your credentials.
-- ==============================================================================

DO $$
DECLARE
    -- =========================================================================
    -- >>> STEP 1: PASTE YOUR USER UID BETWEEN THE SINGLE QUOTES BELOW <<<
    -- =========================================================================
    target_uid_input TEXT := 'PASTE_ACTUAL_USER_UID_HERE';
    
    target_uid UUID;
    user_record_email TEXT;
BEGIN
    -- 1. Validate that the placeholder was replaced
    IF target_uid_input = 'PASTE_ACTUAL_USER_UID_HERE' OR TRIM(target_uid_input) = '' THEN
        RAISE EXCEPTION 
            'CONFIGURATION REQUIRED: Please replace ''PASTE_ACTUAL_USER_UID_HERE'' with your actual user UID from Supabase Dashboard -> Authentication -> Users. Quick query to find your UID: SELECT id, email FROM auth.users;';
    END IF;

    -- 2. Validate standard UUID syntax (8-4-4-4-12 hex format)
    IF NOT (TRIM(target_uid_input) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$') THEN
        RAISE EXCEPTION 
            'INVALID UUID FORMAT: "%" is not a valid 36-character UUID. Expected format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx. Please copy the UID directly from Supabase Authentication -> Users.', target_uid_input;
    END IF;

    target_uid := TRIM(target_uid_input)::UUID;

    -- 3. Verify that the target user exists in auth.users
    SELECT email INTO user_record_email
    FROM auth.users
    WHERE id = target_uid;

    IF user_record_email IS NULL THEN
        RAISE EXCEPTION 
            'USER NOT FOUND IN auth.users: No account exists with UID "%". Please ensure you have registered at http://localhost:3000/auth/signup in this Supabase project (Project: vyvpaqwnbbdjjvwryqvw) before running this script.', target_uid;
    END IF;

    -- 4. Confirm the user email in auth.users so signInWithPassword works immediately
    -- Note: We only touch email_confirmed_at; we do NOT modify last_sign_in_at or deprecated columns
    UPDATE auth.users
    SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
    WHERE id = target_uid;

    -- 5. Ensure profile exists in public.profiles (schema defined in 0002_profiles_and_roles.sql)
    INSERT INTO public.profiles (id, email, full_name, bio, city, state, country)
    VALUES (
        target_uid,
        user_record_email,
        'System Administrator',
        'System Administrator - The Tour Vision Command Center',
        'Pune',
        'Maharashtra',
        'India'
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        bio = COALESCE(public.profiles.bio, 'System Administrator - The Tour Vision Command Center'),
        updated_at = NOW();

    -- 6. Assign the 'admin' role in public.user_roles (matches unique constraint: unique_user_role ON (user_id, role))
    INSERT INTO public.user_roles (user_id, role, granted_at)
    VALUES (target_uid, 'admin'::public.app_role, NOW())
    ON CONFLICT (user_id, role) DO UPDATE SET granted_at = NOW();

    -- 7. Prune redundant customer role for this admin account
    DELETE FROM public.user_roles
    WHERE user_id = target_uid AND role = 'customer'::public.app_role;

    -- 8. Safe audit log entry (non-blocking if audit_logs table is missing or restricted)
    IF to_regclass('public.audit_logs') IS NOT NULL THEN
        BEGIN
            INSERT INTO public.audit_logs (user_id, user_email, action, entity_type, entity_id, details)
            VALUES (
                target_uid,
                user_record_email,
                'BOOTSTRAP_ADMIN',
                'user_roles',
                target_uid::TEXT,
                jsonb_build_object(
                    'message', 'System administrator promoted via UID.',
                    'target_uid', target_uid,
                    'email', user_record_email,
                    'promoted_at', NOW()
                )
            );
        EXCEPTION WHEN OTHERS THEN
            -- Non-fatal: do not block admin promotion if audit logging encounters an issue
            NULL;
        END;
    END IF;

    RAISE NOTICE '======================================================================';
    RAISE NOTICE 'SUCCESS: User UID % (%) is now an active CONFIRMED ADMIN!', target_uid, user_record_email;
    RAISE NOTICE 'You can now log in at http://localhost:3000/admin/login';
    RAISE NOTICE '======================================================================';
END $$;

-- 9. Verification Query: Confirms the active administrator record
SELECT 
    u.id AS user_uid,
    u.email,
    u.email_confirmed_at,
    ur.role,
    ur.granted_at,
    p.full_name,
    p.bio
FROM auth.users u
JOIN public.user_roles ur ON ur.user_id = u.id
LEFT JOIN public.profiles p ON p.id = u.id
WHERE ur.role = 'admin';
