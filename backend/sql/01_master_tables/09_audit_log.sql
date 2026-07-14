CREATE TYPE audit_action_enum AS ENUM('INSERT', 'UPDATE', 'DELETE');
CREATE TABLE IF NOT EXISTS audit_log(
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action audit_action_enum NOT NULL,
    changed_by UUID REFERENCES app_user(user_id) ON DELETE SET NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    old_data JSONB,
    new_data JSONB
);
CREATE INDEX IF NOT EXISTS idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_changed_by ON audit_log(changed_by);
COMMENT ON TABLE audit_log IS 'Tracks every INSERT/UPDATE/DELETE across tracked tables, populated by trigger';