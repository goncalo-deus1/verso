-- Migration: add user_quiz table
-- One row per authenticated user. New quiz overwrites previous via UPSERT.
-- Run via: Supabase Dashboard → SQL Editor, or `supabase db push`.

CREATE TABLE IF NOT EXISTS public.user_quiz (
  user_id    UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  answers    JSONB       NOT NULL,
  result     JSONB       NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on every UPDATE
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER user_quiz_updated_at
  BEFORE UPDATE ON public.user_quiz
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Row Level Security
ALTER TABLE public.user_quiz ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own quiz"
  ON public.user_quiz FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz"
  ON public.user_quiz FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quiz"
  ON public.user_quiz FOR UPDATE
  USING (auth.uid() = user_id);
