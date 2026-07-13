CREATE TYPE server_type_enum AS ENUM ('PRODUCTION', 'DEVELOPMENT', 'STAGING', 'TESTING');
CREATE TYPE dc_dr_enum AS ENUM ('DC', 'DR');
CREATE TYPE service_name_enum AS ENUM ('DATABASE', 'WEB', 'LOG', 'BACKUP', 'APPLICATION', 'FTP', 'OTHER');
CREATE TABLE IF NOT EXISTS server (
    server_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id      UUID NOT NULL REFERENCES project_variant(variant_id) ON DELETE RESTRICT,
    server_type     server_type_enum NOT NULL,
    dc_dr           dc_dr_enum NOT NULL,
    year_code       CHAR(2) NOT NULL,
    month_code      CHAR(2) NOT NULL,
    service_name    service_name_enum  NOT NULL,
    serial_no       CHAR(3) NOT NULL,
    vm_name         VARCHAR(30) NOT NULL UNIQUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_server_variant_id ON server(variant_id);
CREATE INDEX IF NOT EXISTS idx_server_vm_name ON server(vm_name);

COMMENT ON TABLE server IS 'A single VM/server tied to a project variant, with a system-generated unique naming code';