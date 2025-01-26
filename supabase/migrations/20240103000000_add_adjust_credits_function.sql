CREATE OR REPLACE FUNCTION adjust_credits(
  p_plumber_id UUID,
  p_amount INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  UPDATE plumbers
  SET credits = credits + p_amount
  WHERE id = p_plumber_id
  RETURNING credits INTO v_new_balance;

  RETURN v_new_balance;
END;
$$;

