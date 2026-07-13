CREATE TABLE IF NOT EXISTS region (
    region_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region_name     VARCHAR(100) NOT NULL UNIQUE,
    region_code     VARCHAR(5)   NOT NULL UNIQUE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

COMMENT ON TABLE region IS 'Top-level geographic region (Northern, Southern, Western, Eastern, Central)';