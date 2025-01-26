CREATE OR REPLACE FUNCTION deduct_credits(
  p_plumber_id UUID,
  p_amount INTEGER,
  p_description TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_current_credits INTEGER;
  v_remaining_credits INTEGER;
BEGIN
  -- Get current credits and lock the row
  SELECT credits INTO v_current_credits
  FROM plumbers
  WHERE id = p_plumber_id
  FOR UPDATE;

  IF v_current_credits < p_amount THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;

  -- Deduct credits
  v_remaining_credits := v_current_credits - p_amount;

  -- Update plumber's credits
  UPDATE plumbers
  SET credits = v_remaining_credits
  WHERE id = p_plumber_id;

  -- Record the transaction
  INSERT INTO credit_transactions (plumber_id, amount, type, description)
  VALUES (p_plumber_id, p_amount, 'usage', p_description);

  RETURN v_remaining_credits;
END;
$$;

