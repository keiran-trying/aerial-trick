-- ⚡ AUTOMATIC DAILY TRICK TRIGGER
-- This will automatically select a new Daily Trick when the app checks for today's trick
-- No cron job needed! Works whenever users visit the app.

-- Create a function that automatically creates today's daily trick if it doesn't exist
CREATE OR REPLACE FUNCTION ensure_daily_trick()
RETURNS trigger AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_tutorial_id UUID;
BEGIN
  -- Check if there's already a daily trick for today
  IF NOT EXISTS (
    SELECT 1 FROM daily_trick WHERE date = v_today
  ) THEN
    -- Get a random tutorial
    SELECT id INTO v_tutorial_id
    FROM tutorials
    ORDER BY RANDOM()
    LIMIT 1;

    -- Insert the new daily trick
    IF v_tutorial_id IS NOT NULL THEN
      INSERT INTO daily_trick (tutorial_id, date)
      VALUES (v_tutorial_id, v_today);
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Alternative: Create a callable function
CREATE OR REPLACE FUNCTION get_or_create_daily_trick()
RETURNS TABLE (
  id UUID,
  tutorial_id UUID,
  date DATE,
  created_at TIMESTAMPTZ
) AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_tutorial_id UUID;
  v_daily_trick RECORD;
BEGIN
  -- Check if there's already a daily trick for today
  SELECT * INTO v_daily_trick
  FROM daily_trick
  WHERE daily_trick.date = v_today;

  -- If not found, create one
  IF NOT FOUND THEN
    -- Get a random tutorial
    SELECT tutorials.id INTO v_tutorial_id
    FROM tutorials
    ORDER BY RANDOM()
    LIMIT 1;

    -- Insert the new daily trick
    IF v_tutorial_id IS NOT NULL THEN
      INSERT INTO daily_trick (tutorial_id, date)
      VALUES (v_tutorial_id, v_today)
      RETURNING * INTO v_daily_trick;
    END IF;
  END IF;

  -- Return the daily trick
  RETURN QUERY 
  SELECT 
    v_daily_trick.id,
    v_daily_trick.tutorial_id,
    v_daily_trick.date,
    v_daily_trick.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_or_create_daily_trick() TO authenticated;
GRANT EXECUTE ON FUNCTION get_or_create_daily_trick() TO anon;

