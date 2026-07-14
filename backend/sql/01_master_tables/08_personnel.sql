CREATE TYPE personnel_role_enum AS ENUM ('PMT_PRIMARY', 'SYSTEM_ADMIN_PRIMARY', 'MODULE_LEAD');
CREATE TABLE IF NOT EXISTS personnel (
    personnel_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES project_variant(variant_id) ON DELETE RESTRICT,
    full_name VARCHAR(150) NOT NULL,
    role_type personnel_role_enum NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_personnel_variant_id ON personnel(variant_id);
COMMENT ON TABLE personnel IS 'PMT / System Admin / Module Lead assigned to a project variant — reference fields for now, per open question #3';