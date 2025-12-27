-- Drop the existing public SELECT policy
DROP POLICY IF EXISTS "Team members viewable by everyone" ON public.team_members;

-- Create a new policy that only allows admins to view full team member data
CREATE POLICY "Admins can view team members" 
ON public.team_members 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create a public view that excludes sensitive contact information
CREATE OR REPLACE VIEW public.team_members_public AS
SELECT 
  id,
  name,
  position,
  bio,
  image_url,
  display_order,
  created_at,
  updated_at
FROM public.team_members;

-- Grant SELECT on the view to anon and authenticated roles
GRANT SELECT ON public.team_members_public TO anon;
GRANT SELECT ON public.team_members_public TO authenticated;