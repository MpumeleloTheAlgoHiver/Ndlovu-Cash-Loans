-- Add credit-bureau-related personal details to the profiles table
-- so users only fill them in once on the Profile page.
-- Run this against your Supabase SQL Editor.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS surname        TEXT,
  ADD COLUMN IF NOT EXISTS first_name     TEXT,
  ADD COLUMN IF NOT EXISTS gender         TEXT,          -- 'M' or 'F'
  ADD COLUMN IF NOT EXISTS date_of_birth  DATE,
  ADD COLUMN IF NOT EXISTS street_address TEXT,
  ADD COLUMN IF NOT EXISTS postal_code    TEXT,          -- 4-digit SA postal code
  ADD COLUMN IF NOT EXISTS suburb_area    TEXT;

-- identity_number may already exist (used by TruID / admin search).
-- This is a no-op if it does, safe to re-run.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS identity_number TEXT;

COMMENT ON COLUMN public.profiles.surname        IS 'Surname for Experian credit check';
COMMENT ON COLUMN public.profiles.first_name     IS 'First name for Experian credit check';
COMMENT ON COLUMN public.profiles.gender         IS 'M or F — required by Experian';
COMMENT ON COLUMN public.profiles.date_of_birth  IS 'Date of birth for credit bureau lookup';
COMMENT ON COLUMN public.profiles.street_address IS 'Street address line 1';
COMMENT ON COLUMN public.profiles.postal_code    IS '4-digit SA postal code';
COMMENT ON COLUMN public.profiles.suburb_area    IS 'Suburb / area (address line 2)';
