-- First, drop any existing view/table named team_members_public
DROP VIEW IF EXISTS public.team_members_public CASCADE;
DROP TABLE IF EXISTS public.team_members_public CASCADE;

-- Create a security definer function that returns only public team member data
-- Using quoted identifiers for reserved keywords like "position"
CREATE OR REPLACE FUNCTION public.get_public_team_members()
RETURNS TABLE (
  id uuid,
  member_name text,
  member_position text,
  bio text,
  image_url text,
  display_order integer,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id,
    name,
    "position",
    bio,
    image_url,
    display_order,
    created_at,
    updated_at
  FROM public.team_members
  ORDER BY display_order ASC;
$$;