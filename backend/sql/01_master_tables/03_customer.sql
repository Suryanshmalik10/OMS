CREATE TABLE IF NOT EXISTS customer (
    customer_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name   VARCHAR(255) NOT NULL,
    customer_code   VARCHAR(5)   NOT NULL,
    state_id        UUID NOT NULL REFERENCES state(state_id) ON DELETE RESTRICT,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),

    CONSTRAINT uq_customer_code_state UNIQUE (customer_code, state_id)
);

CREATE INDEX IF NOT EXISTS idx_customer_state_id ON customer(state_id);

COMMENT ON TABLE customer IS 'Government organization (e.g. High Court, University, State Govt dept)';