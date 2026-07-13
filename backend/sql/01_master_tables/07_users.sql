CREATE TYPE user_role_enum AS ENUM ('ADMIN', 'USER');
CREATE TABLE IF NOT EXISTS app_user (
    user_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username        VARCHAR(50)  NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   TEXT NOT NULL,
    role            user_role_enum NOT NULL DEFAULT 'USER',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE app_user IS 'Login accounts for the system — Admin and User roles';