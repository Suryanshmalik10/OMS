CREATE TYPE case_type_enum AS ENUM ('NIC_MOU', 'NON_MOU');

CREATE TABLE IF NOT EXISTS project_variant (
    variant_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID NOT NULL REFERENCES project(project_id) ON DELETE RESTRICT,
    variant_name    VARCHAR(100) NOT NULL,
    case_type       case_type_enum NOT NULL DEFAULT 'NIC_MOU',
    is_live         BOOLEAN NOT NULL DEFAULT FALSE,
    go_live_date    DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_variant_project_id ON project_variant(project_id);
CREATE INDEX IF NOT EXISTS idx_project_variant_is_live ON project_variant(is_live);

COMMENT ON TABLE project_variant IS 'Specific software instance deployed for a project (e.g. eFile instance, Sparrow instance)';