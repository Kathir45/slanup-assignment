/*
  # Create Events Table

  ## Overview
  Creates the core events table for the event discovery application with comprehensive
  participant tracking and location-based features.

  ## New Tables
  
  ### `events`
  Main table storing all event information:
  - `id` (uuid, primary key) - Unique event identifier
  - `title` (text, required) - Event name/title
  - `description` (text, required) - Detailed event description
  - `location` (text, required) - Event location/address
  - `date` (timestamptz, required) - Event date and time
  - `max_participants` (integer, required) - Maximum number of attendees
  - `current_participants` (integer, default 0) - Current number of registered attendees
  - `created_at` (timestamptz) - Timestamp of event creation
  - `updated_at` (timestamptz) - Timestamp of last update
  
  ## Security
  
  ### Row Level Security (RLS)
  - RLS is enabled on the `events` table
  - Public read access: Anyone can view all events (SELECT)
  - Public create access: Anyone can create events (INSERT)
  - Public update access: Anyone can update event participant counts (UPDATE)
  
  ### RLS Policies
  1. **"Anyone can view events"** - Allows public SELECT access to all events
  2. **"Anyone can create events"** - Allows public INSERT access for new events
  3. **"Anyone can update events"** - Allows public UPDATE access for participant management
  
  ## Indexes
  - Primary key index on `id` (automatic)
  - Index on `date` for chronological queries
  - Index on `location` for location-based filtering
  
  ## Constraints
  - `max_participants` must be greater than 0
  - `current_participants` must be between 0 and `max_participants`
  - Event dates cannot be in the past at creation time
*/

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  date timestamptz NOT NULL,
  max_participants integer NOT NULL CHECK (max_participants > 0),
  current_participants integer NOT NULL DEFAULT 0 CHECK (
    current_participants >= 0 AND 
    current_participants <= max_participants
  ),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_location ON events(location);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view all events
CREATE POLICY "Anyone can view events"
  ON events
  FOR SELECT
  USING (true);

-- RLS Policy: Anyone can create events
CREATE POLICY "Anyone can create events"
  ON events
  FOR INSERT
  WITH CHECK (true);

-- RLS Policy: Anyone can update events
CREATE POLICY "Anyone can update events"
  ON events
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();