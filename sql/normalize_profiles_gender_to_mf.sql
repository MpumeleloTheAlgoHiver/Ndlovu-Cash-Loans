-- Normalize existing gender values to M/F and enforce M/F constraint on profiles.gender

UPDATE public.profiles
SET gender = CASE
  WHEN gender ILIKE 'male' THEN 'M'
  WHEN gender ILIKE 'm' THEN 'M'
  WHEN gender ILIKE 'female' THEN 'F'
  WHEN gender ILIKE 'f' THEN 'F'
  ELSE gender
END
WHERE gender IS NOT NULL;

ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_gender_check;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_gender_check
CHECK (gender IS NULL OR gender IN ('M', 'F'));