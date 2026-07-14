CREATE INDEX IF NOT EXISTS idx_variant_project_live
    ON project_variant(project_id, is_live);

CREATE INDEX IF NOT EXISTS idx_server_variant_type_dcdr
    ON server(variant_id, server_type, dc_dr);

CREATE INDEX IF NOT EXISTS idx_personnel_role_type
    ON personnel(role_type);

CREATE INDEX IF NOT EXISTS idx_customer_name_trgm
    ON customer USING gin (customer_name gin_trgm_ops);