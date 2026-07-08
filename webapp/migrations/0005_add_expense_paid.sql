-- Add paid column to expenses table for bill payment status tracking
ALTER TABLE expenses ADD COLUMN paid INTEGER NOT NULL DEFAULT 0;
