CREATE TABLE IF NOT EXISTS project (
    project_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name    VARCHAR(255) NOT NULL,
    project_code    VARCHAR(5)   NOT NULL,
    customer_id     UUID NOT NULL REFERENCES customer(customer_id) ON DELETE RESTRICT,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),

    CONSTRAINT uq_project_code_customer UNIQUE (project_code, customer_id)
);

CREATE INDEX IF NOT EXISTS idx_project_customer_id ON project(customer_id);

COMMENT ON TABLE project IS 'A project undertaken for a customer (one customer can have multiple projects)';