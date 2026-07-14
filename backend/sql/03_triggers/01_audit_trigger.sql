CREATE OR REPLACE FUNCTION fn_audit_trigger()
RETURNS TRIGGER AS $$
DECLARE
    v_record_id UUID;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        v_record_id := (OLD.*::jsonb ->> (TG_ARGV[0]))::UUID;
        INSERT INTO audit_log(table_name, record_id, action, old_data, new_data)
        VALUES (TG_TABLE_NAME, v_record_id, 'DELETE', to_jsonb(OLD), NULL);
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        v_record_id := (NEW.*::jsonb ->> (TG_ARGV[0]))::UUID;
        INSERT INTO audit_log(table_name, record_id, action, old_data, new_data)
        VALUES (TG_TABLE_NAME, v_record_id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        v_record_id := (NEW.*::jsonb ->> (TG_ARGV[0]))::UUID;
        INSERT INTO audit_log(table_name, record_id, action, old_data, new_data)
        VALUES (TG_TABLE_NAME, v_record_id, 'INSERT', NULL, to_jsonb(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_audit_customer
    AFTER INSERT OR UPDATE OR DELETE ON customer
    FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger('customer_id');
CREATE TRIGGER trg_audit_project
    AFTER INSERT OR UPDATE OR DELETE ON project
    FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger('project_id');
CREATE TRIGGER trg_audit_project_variant
    AFTER INSERT OR UPDATE OR DELETE ON project_variant
    FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger('variant_id');
CREATE TRIGGER trg_audit_server
    AFTER INSERT OR UPDATE OR DELETE ON server
    FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger('server_id');
CREATE TRIGGER trg_audit_personnel
    AFTER INSERT OR UPDATE OR DELETE ON personnel
    FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger('personnel_id');