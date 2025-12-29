-- Add CCTV_ENGINEER to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'cctv_engineer';