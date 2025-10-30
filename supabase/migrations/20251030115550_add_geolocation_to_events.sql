/*
  # Add Geolocation Support to Events

  ## Overview
  Adds latitude and longitude fields to events table to enable distance-based
  search and filtering functionality.

  ## Changes
  
  ### Modified Tables
  
  #### `events`
  New columns added:
  - `latitude` (numeric) - Latitude coordinate of event location (optional)
  - `longitude` (numeric) - Longitude coordinate of event location (optional)
  
  ## Indexes
  - Combined index on (latitude, longitude) for efficient geospatial queries
  
  ## Notes
  - Coordinates are optional to maintain backward compatibility
  - Valid latitude range: -90 to 90
  - Valid longitude range: -180 to 180
  - These fields enable distance calculation from user's location
*/

-- Add latitude and longitude columns to events table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE events ADD COLUMN latitude numeric(10, 8);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'longitude'
  ) THEN
    ALTER TABLE events ADD COLUMN longitude numeric(11, 8);
  END IF;
END $$;

-- Add constraints for valid coordinate ranges
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'valid_latitude'
  ) THEN
    ALTER TABLE events ADD CONSTRAINT valid_latitude 
      CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'valid_longitude'
  ) THEN
    ALTER TABLE events ADD CONSTRAINT valid_longitude 
      CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180));
  END IF;
END $$;

-- Create index for geospatial queries
CREATE INDEX IF NOT EXISTS idx_events_coordinates ON events(latitude, longitude);