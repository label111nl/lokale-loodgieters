CREATE OR REPLACE FUNCTION expire_credits(
  p_plumber_id UUID,
  p_amount INTEGER,
  p_transaction_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- Deduct expired credits
  UPDATE plumbers
  SET credits = credits - p_amount
  WHERE id = p_plumber_id;

  -- Mark the transaction as expired
  UPDATE credit_transactions
  SET type = 'expired'
  WHERE id = p_transaction_id;

  -- Record the expiration transaction
  INSERT INTO credit_transactions (plumber_id, amount, type, description)
  VALUES (p_plumber_id, p_amount, 'expiration', 'Credits expired after 90 days');
END;
$$;

