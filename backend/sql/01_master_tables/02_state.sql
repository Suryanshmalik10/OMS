CREATE TABLE IF NOT EXISTS state (
    state_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_name      VARCHAR(100) NOT NULL UNIQUE,
    state_code      VARCHAR(5)   NOT NULL UNIQUE,
    region_id       UUID NOT NULL REFERENCES region(region_id) ON DELETE RESTRICT,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_state_region_id ON state(region_id);

COMMENT ON TABLE state IS 'Indian state/UT, belongs to exactly one region';