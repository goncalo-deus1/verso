-- Migration: ensure saved_zones table exists with correct RLS policies
-- Run via: Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS public.saved_zones (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  zone_slug  TEXT        NOT NULL,
  zone_kind  TEXT        NOT NULL,
  zone_name  TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, zone_slug)
);

ALTER TABLE public.saved_zones ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (idempotent re-run)
DROP POLICY IF EXISTS "Users can select own saved zones"  ON public.saved_zones;
DROP POLICY IF EXISTS "Users can insert own saved zones"  ON public.saved_zones;
DROP POLICY IF EXISTS "Users can delete own saved zones"  ON public.saved_zones;

CREATE POLICY "Users can select own saved zones"
  ON public.saved_zones FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved zones"
  ON public.saved_zones FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved zones"
  ON public.saved_zones FOR DELETE
  USING (auth.uid() = user_id);
