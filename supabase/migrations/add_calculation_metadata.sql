-- Migration: Add calculation metadata fields to saved_calculations
-- This enables server-side verification and version tracking

ALTER TABLE saved_calculations
ADD COLUMN IF NOT EXISTS tax_year TEXT,
ADD COLUMN IF NOT EXISTS engine_version TEXT,
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS computed_at TIMESTAMPTZ;

-- Add index for tax_year queries
CREATE INDEX IF NOT EXISTS idx_saved_calculations_tax_year ON saved_calculations(tax_year);

-- Add index for verified status
CREATE INDEX IF NOT EXISTS idx_saved_calculations_verified ON saved_calculations(verified);

-- Update existing records to mark as unverified (they were computed client-side)
UPDATE saved_calculations
SET verified = false, computed_at = created_at
WHERE verified IS NULL;

