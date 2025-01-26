CREATE OR REPLACE FUNCTION respond_to_lead(
  p_plumber_id UUID,
  p_lead_id UUID,
  p_credits_required INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_current_credits INTEGER;
  v_remaining_credits INTEGER;
BEGIN
  -- Controleer of de loodgieter genoeg credits heeft
  SELECT credits INTO v_current_credits
  FROM plumbers
  WHERE id = p_plumber_id
  FOR UPDATE;

  IF v_current_credits < p_credits_required THEN
    RAISE EXCEPTION 'Niet genoeg credits';
  END IF;

  -- Trek de credits af
  v_remaining_credits := v_current_credits - p_credits_required;

  -- Update de credits van de loodgieter
  UPDATE plumbers
  SET credits = v_remaining_credits
  WHERE id = p_plumber_id;

  -- Registreer de leadresponse
  INSERT INTO lead_responses (plumber_id, lead_id, credits_used)
  VALUES (p_plumber_id, p_lead_id, p_credits_required);

  -- Update de lead status
  UPDATE leads
  SET status = 'responded'
  WHERE id = p_lead_id;

  RETURN v_remaining_credits;
END;
$$;

