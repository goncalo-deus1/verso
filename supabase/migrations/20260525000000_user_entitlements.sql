-- Migration: paid plan entitlements
-- One row per user plan grant. Stripe/checkout can write here later via service role.
-- For now, paid users can be activated manually in Supabase.

CREATE TABLE IF NOT EXISTS public.user_entitlements (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan       TEXT        NOT NULL CHECK (plan IN ('dossier', 'acompanhado')),
  status     TEXT        NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'past_due', 'cancelled', 'expired')),
  source     TEXT        NOT NULL DEFAULT 'manual',
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_entitlements_user_id_idx
  ON public.user_entitlements (user_id);

CREATE INDEX IF NOT EXISTS user_entitlements_active_idx
  ON public.user_entitlements (user_id, status, valid_until);

DROP TRIGGER IF EXISTS user_entitlements_updated_at ON public.user_entitlements;
CREATE TRIGGER user_entitlements_updated_at
  BEFORE UPDATE ON public.user_entitlements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.user_entitlements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own entitlements" ON public.user_entitlements;

CREATE POLICY "Users can read own entitlements"
  ON public.user_entitlements FOR SELECT
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_active_paid_plan()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_entitlements
    WHERE user_id = auth.uid()
      AND plan IN ('dossier', 'acompanhado')
      AND status IN ('active', 'trialing')
      AND (valid_until IS NULL OR valid_until > NOW())
  );
$$;

GRANT EXECUTE ON FUNCTION public.has_active_paid_plan() TO authenticated;
