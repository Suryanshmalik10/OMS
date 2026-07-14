import asyncpg
from uuid import UUID


async def create_project(conn: asyncpg.Connection, project_name: str, project_code: str, customer_id: UUID):
    row = await conn.fetchrow(
        """
        INSERT INTO project (project_name, project_code, customer_id)
        VALUES ($1, $2, $3)
        RETURNING project_id, project_name, project_code, customer_id, created_at, updated_at
        """,
        project_name, project_code, customer_id,
    )
    return dict(row)


async def get_all_projects(conn: asyncpg.Connection):
    rows = await conn.fetch(
        "SELECT project_id, project_name, project_code, customer_id, created_at, updated_at FROM project ORDER BY project_name"
    )
    return [dict(row) for row in rows]


async def get_project_by_id(conn: asyncpg.Connection, project_id: UUID):
    row = await conn.fetchrow(
        "SELECT project_id, project_name, project_code, customer_id, created_at, updated_at FROM project WHERE project_id = $1",
        project_id,
    )
    return dict(row) if row else None


async def update_project(conn: asyncpg.Connection, project_id: UUID, project_name, project_code, customer_id):
    row = await conn.fetchrow(
        """
        UPDATE project
        SET project_name = COALESCE($2, project_name),
            project_code = COALESCE($3, project_code),
            customer_id  = COALESCE($4, customer_id)
        WHERE project_id = $1
        RETURNING project_id, project_name, project_code, customer_id, created_at, updated_at
        """,
        project_id, project_name, project_code, customer_id,
    )
    return dict(row) if row else None


async def delete_project(conn: asyncpg.Connection, project_id: UUID):
    result = await conn.execute("DELETE FROM project WHERE project_id = $1", project_id)
    return result == "DELETE 1"