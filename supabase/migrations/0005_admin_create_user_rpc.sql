-- Remote Procedure Call to allow Admins to create new users
-- This function runs with SECURITY DEFINER to bypass RLS and allow inserting into auth schema
CREATE OR REPLACE FUNCTION create_zoo_user(
    email_param TEXT,
    password_param TEXT,
    first_name_param TEXT,
    last_name_param TEXT,
    department_id_param INT,
    role_param TEXT -- 'admin', 'manager', 'employee', 'vet' (derived from dept logic usually)
)
RETURNS UUID AS $$
DECLARE
    new_user_uid UUID := gen_random_uuid();
BEGIN
    -- 1. Create Auth User
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, 
        email_confirmed_at, recovery_sent_at, last_sign_in_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', new_user_uid, 'authenticated', 'authenticated', 
        email_param, crypt(password_param, gen_salt('bf')), 
        now(), now(), now(), 
        '{"provider":"email","providers":["email"]}', '{}', now(), now(),
        '', '', '', ''
    );

    -- 2. Create Identity
    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        new_user_uid, new_user_uid, 
        format('{"sub":"%s","email":"%s"}', new_user_uid, email_param)::jsonb, 
        'email', new_user_uid, 
        now(), now(), now()
    );

    -- 3. Create Employee Record Linked to User
    INSERT INTO employees (
        first_name, last_name, contact_info, dept_id, user_id, 
        pay_rate_cents, shift_timeframe -- Defaults/Placeholders
    ) VALUES (
        first_name_param, last_name_param, email_param, department_id_param, new_user_uid, 
        2000, '09:00-17:00' -- Default values, can be updated later
    );

    RETURN new_user_uid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
