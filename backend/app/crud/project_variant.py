import asyncpg
from uuid import UUID
from datetime import date


async def create_variant(conn: asyncpg.Connection, project_id: UUID, variant_name: str, case_type: str, is_live: bool, go_live_date: date | None):
    row = await conn.fetchrow(
        """
        INSERT INTO project_variant (project_id, variant_name, case_type, is_live, go_live_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING variant_id, project_id, variant_name, case_type, is_live, go_live_date, created_at, updated_at
        """,
        project_id, variant_name, case_type, is_live, go_live_date,
    )
    return dict(row)


async def get_all_variants(conn: asyncpg.Connection):
    rows = await conn.fetch(
        "SELECT variant_id, project_id, variant_name, case_type, is_live, go_live_date, created_at, updated_at FROM project_variant ORDER BY variant_name"
    )
    return [dict(row) for row in rows]


async def get_variant_by_id(conn: asyncpg.Connection, variant_id: UUID):
    row = await conn.fetchrow(
        "SELECT variant_id, project_id, variant_name, case_type, is_live, go_live_date, created_at, updated_at FROM project_variant WHERE variant_id = $1",
        variant_id,
    )
    return dict(row) if row else None


async def update_variant(conn: asyncpg.Connection, variant_id: UUID, variant_name, case_type, is_live, go_live_date, project_id):
    row = await conn.fetchrow(
        """
        UPDATE project_variant
        SET variant_name = COALESCE($2, variant_name),
            case_type    = COALESCE($3, case_type),
            is_live      = COALESCE($4, is_live),
            go_live_date = COALESCE($5, go_live_date),
            project_id   = COALESCE($6, project_id)
        WHERE variant_id = $1
        RETURNING variant_id, project_id, variant_name, case_type, is_live, go_live_date, created_at, updated_at
        """,
        variant_id, variant_name, case_type, is_live, go_live_date, project_id,
    )
    return dict(row) if row else None


async def delete_variant(conn: asyncpg.Connection, variant_id: UUID):
    result = await conn.execute("DELETE FROM project_variant WHERE variant_id = $1", variant_id)
    return result == "DELETE 1"