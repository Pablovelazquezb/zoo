-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User ID for the new admin
DO $$
DECLARE
  new_user_id UUID := gen_random_uuid();
BEGIN
  -- 1. Insert into auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    'admin@zoo.com',
    crypt('admin', gen_salt('bf')), -- Password: 'admin'
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  -- 2. Insert into auth.identities (Required for Supabase Auth)
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    new_user_id,
    format('{"sub":"%s","email":"admin@zoo.com"}', new_user_id)::jsonb,
    'email',
    new_user_id, -- provider_id (for email provider, usually same as user_id in new GoTrue versions, or the email itself. Let's try user_id first as it is unique)
    now(),
    now(),
    now()
  );

  -- 3. Update Employee (Reference to seed data: John Hammond is employee_id 4)
  UPDATE employees 
  SET user_id = new_user_id 
  WHERE employee_id = 4; -- John Hammond (Manager)
  
END $$;
