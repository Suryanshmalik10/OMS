#!/usr/bin/env bash
set -e
export $(grep -v '^#' ../.env | xargs)

echo "Running schema in order..."

psql "$DATABASE_URL" -f 00_extensions.sql
for f in 01_master_tables/*.sql; do
    echo "-> $f"
    psql "$DATABASE_URL" -f "$f"
done
psql "$DATABASE_URL" -f 02_indexes.sql
psql "$DATABASE_URL" -f 03_triggers/01_audit_trigger.sql
psql "$DATABASE_URL" -f 05_updated_at_trigger.sql

echo "Schema applied successfully."