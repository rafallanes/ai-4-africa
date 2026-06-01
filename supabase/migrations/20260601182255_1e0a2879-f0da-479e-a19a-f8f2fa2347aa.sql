
-- Restrict public (anon) column access on tables containing PII via column-level GRANTs.
-- Authenticated users keep full table access (admins-only via RLS); anon can only read safe columns.

-- SCHOOLS: hide contact_name, contact_email from anon
REVOKE SELECT ON public.schools FROM anon;
GRANT SELECT (id, name, city, country, student_count, age_range, training_language,
              has_materials, preferred_dates, required_amount, validated, created_at, updated_at)
  ON public.schools TO anon;

-- AMBASSADORS: hide email, cv_url, linkedin from anon
REVOKE SELECT ON public.ambassadors FROM anon;
GRANT SELECT (id, name, country, expertise, motivation, languages, availability,
              validated, created_at, updated_at)
  ON public.ambassadors TO anon;

-- COMPANIES: hide contact_name, contact_email from anon
REVOKE SELECT ON public.companies FROM anon;
GRANT SELECT (id, name, logo_url, commitment, created_at, updated_at)
  ON public.companies TO anon;

-- Lock down SECURITY DEFINER has_role() so signed-in users cannot invoke it as an RPC.
-- Policies that reference it still work because policy evaluation runs server-side.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
