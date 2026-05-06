-- Create circles table to track active groups
CREATE TABLE IF NOT EXISTS circles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vibe TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_count INT DEFAULT 1
);

-- Enable RLS and permissions
ALTER TABLE circles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to circles" ON circles;
CREATE POLICY "Allow all access to circles" ON circles FOR ALL USING (true);

-- Enable Real-time for circles
ALTER TABLE circles REPLICA IDENTITY FULL;
-- We don't necessarily need to add it to publication if we don't subscribe to circles table changes on frontend, 
-- but we might want to if we show "X people active" live.
ALTER PUBLICATION insforge_realtime ADD TABLE circles;

-- Update messages table to include circle_id
ALTER TABLE messages ADD COLUMN IF NOT EXISTS circle_id UUID REFERENCES circles(id);
