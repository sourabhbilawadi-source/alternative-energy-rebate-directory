-- migration_add_slugs.sql
-- Migration to add slug and metadata columns to public.regions and public.rebates

-- 1. Add state_slug and country_slug columns to public.regions
ALTER TABLE public.regions ADD COLUMN IF NOT EXISTS state_slug TEXT;
ALTER TABLE public.regions ADD COLUMN IF NOT EXISTS country_slug TEXT;

-- 2. Add slug, description, eligibility, and official_url columns to public.rebates
ALTER TABLE public.rebates ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.rebates ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.rebates ADD COLUMN IF NOT EXISTS eligibility TEXT;
ALTER TABLE public.rebates ADD COLUMN IF NOT EXISTS official_url TEXT;

-- 3. Auto-populate country_slug and state_slug in public.regions
UPDATE public.regions
SET 
  country_slug = CASE WHEN country_code = 'gb' THEN 'uk' ELSE lower(country_code) END,
  state_slug = lower(regexp_replace(regexp_replace(state_province, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));

-- 4. Auto-populate slug and description in public.rebates
-- Description is constructed factually from existing columns.
-- Slugs are generated from authority_name + city to guarantee global uniqueness.
UPDATE public.rebates r
SET 
  slug = lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          r.authority_name || '-' || reg.city,
          '[^a-zA-Z0-9\s-]',
          '',
          'g'
        ),
        '\s+',
        '-',
        'g'
      ),
      '-+',
      '-',
      'g'
    )
  ),
  description = r.authority_name || ' offers ' || 
    (CASE 
      WHEN r.incentive_type = 'percentage' THEN r.incentive_value || '%'
      WHEN r.incentive_type = 'per_watt' THEN (CASE WHEN reg.country_code = 'de' THEN '€' WHEN reg.country_code = 'gb' THEN '£' ELSE '$' END) || r.incentive_value || '/W'
      WHEN r.incentive_type = 'fixed' THEN (CASE WHEN reg.country_code = 'de' THEN '€' WHEN reg.country_code = 'gb' THEN '£' ELSE '$' END) || r.incentive_value
      ELSE (CASE WHEN reg.country_code = 'de' THEN '€' WHEN reg.country_code = 'gb' THEN '£' ELSE '$' END) || r.incentive_value || ' ' || r.incentive_type
    END) || 
    (CASE 
      WHEN r.max_limit IS NOT NULL THEN ' (up to ' || (CASE WHEN reg.country_code = 'de' THEN '€' WHEN reg.country_code = 'gb' THEN '£' ELSE '$' END) || r.max_limit || ')' 
      ELSE '' 
    END) || 
    ' for ' || lower(r.technology_category) || ' in ' || reg.city || ', ' || reg.state_province || '.'
FROM public.regions reg
WHERE r.region_id = reg.id;

-- 5. Add UNIQUE constraint to public.rebates.slug to guarantee route safety
ALTER TABLE public.rebates ADD CONSTRAINT unique_rebate_slug UNIQUE (slug);
