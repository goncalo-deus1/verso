-- Migration: start_conversation RPC for the chat feature.
--
-- Idempotent. Adds only the missing RPC; tables, policies, indexes, trigger
-- and realtime publication already exist on the live DB (confirmed via
-- pg_catalog introspection on 2026-05-19).
--
-- Why SECURITY DEFINER:
--   1. The seller_id must be derived from properties.owner_id server-side —
--      never trusted from the client. SECURITY DEFINER lets the function
--      read properties even if RLS on that table becomes stricter later.
--   2. The function performs its own validation (auth.uid() != null,
--      property exists, buyer != seller), so bypassing RLS is intentional.
-- search_path is locked to public, pg_temp to prevent hijacking via mutable
-- search_path attacks (best-practice for SECURITY DEFINER functions).

CREATE OR REPLACE FUNCTION public.start_conversation(p_property_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_buyer_id  uuid := auth.uid();
  v_seller_id uuid;
  v_conv_id   uuid;
BEGIN
  IF v_buyer_id IS NULL THEN
    RAISE EXCEPTION 'authentication required'
      USING ERRCODE = '42501', HINT = 'Sign in before contacting the seller.';
  END IF;

  SELECT owner_id
    INTO v_seller_id
  FROM public.properties
  WHERE id = p_property_id;

  IF v_seller_id IS NULL THEN
    RAISE EXCEPTION 'property not found: %', p_property_id
      USING ERRCODE = 'P0002';
  END IF;

  IF v_seller_id = v_buyer_id THEN
    RAISE EXCEPTION 'cannot contact own listing'
      USING ERRCODE = '22023',
            HINT = 'The authenticated user owns this property.';
  END IF;

  -- ON CONFLICT garante idempotência: se já existe conversa (property_id,
  -- buyer_id) devolve o id existente em vez de falhar com unique_violation.
  -- O DO UPDATE é um no-op funcional (atribui buyer_id ao mesmo buyer_id)
  -- usado apenas para activar a cláusula RETURNING no caminho de conflito.
  INSERT INTO public.conversations (property_id, buyer_id, seller_id)
  VALUES (p_property_id, v_buyer_id, v_seller_id)
  ON CONFLICT (property_id, buyer_id)
    DO UPDATE SET buyer_id = EXCLUDED.buyer_id
  RETURNING id INTO v_conv_id;

  RETURN v_conv_id;
END;
$$;

-- Lock down execution. CREATE FUNCTION grants EXECUTE to PUBLIC implicitly;
-- with SECURITY DEFINER that means any role (incl. anon) could run this
-- and escalate to the function owner's privileges. REVOKE first, then GRANT
-- only to authenticated so the RPC is callable from the client (anon-key
-- sessions with a valid auth.uid()) but not from anonymous traffic.
REVOKE EXECUTE ON FUNCTION public.start_conversation(uuid) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.start_conversation(uuid) TO authenticated;

COMMENT ON FUNCTION public.start_conversation(uuid) IS
  'Returns the conversation id between auth.uid() (buyer) and the property''s '
  'owner_id (seller). Creates the conversation if it does not exist. '
  'SECURITY DEFINER: validates auth + ownership internally.';
