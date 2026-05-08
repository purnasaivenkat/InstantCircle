-- Profiles table to store user metadata
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Circles table
CREATE TABLE IF NOT EXISTS circles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vibe TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_count INT DEFAULT 1
);

ALTER TABLE circles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to circles" ON circles;
CREATE POLICY "Allow all access to circles" ON circles FOR ALL USING (true);

-- Private Chats table
CREATE TABLE IF NOT EXISTS private_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user1_id UUID REFERENCES profiles(id),
    user2_id UUID REFERENCES profiles(id),
    game_type TEXT, 
    game_state JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE private_chats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to private_chats" ON private_chats;
CREATE POLICY "Allow all access to private_chats" ON private_chats FOR ALL USING (true);

CREATE UNIQUE INDEX IF NOT EXISTS private_chats_users_unique_idx ON private_chats (LEAST(user1_id, user2_id), GREATEST(user1_id, user2_id));

-- Private Messages table
CREATE TABLE IF NOT EXISTS private_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID REFERENCES private_chats(id),
    sender_id UUID REFERENCES profiles(id),
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE private_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to private_messages" ON private_messages;
CREATE POLICY "Allow all access to private_messages" ON private_messages FOR ALL USING (true);

-- Regular Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    user_display_name TEXT,
    text TEXT NOT NULL,
    circle_id UUID REFERENCES circles(id),
    vibe TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to messages" ON messages;
CREATE POLICY "Allow all access to messages" ON messages FOR ALL USING (true);

-- Real-time settings
ALTER TABLE circles REPLICA IDENTITY FULL;
ALTER TABLE messages REPLICA IDENTITY FULL;
ALTER TABLE private_chats REPLICA IDENTITY FULL;
ALTER TABLE private_messages REPLICA IDENTITY FULL;

-- Ensure publication exists and contains tables
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'insforge_realtime') THEN
    ALTER PUBLICATION insforge_realtime ADD TABLE circles;
    ALTER PUBLICATION insforge_realtime ADD TABLE messages;
    ALTER PUBLICATION insforge_realtime ADD TABLE private_chats;
    ALTER PUBLICATION insforge_realtime ADD TABLE private_messages;
  ELSE
    CREATE PUBLICATION insforge_realtime FOR TABLE circles, messages, private_chats, private_messages;
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- Handle case where tables are already in publication
  NULL;
END $$;
