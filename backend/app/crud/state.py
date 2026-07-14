import asyncpg
from uuid import UUID


async def create_state(conn: asyncpg.Connection, state_name: str, state_code: str, region_id: UUID):
    row = await conn.fetchrow(
        """
        INSERT INTO state (state_name, state_code, region_id)
        VALUES ($1, $2, $3)
        RETURNING state_id, state_name, state_code, region_id, created_at, updated_at
        """,
        state_name, state_code, region_id,
    )
    return dict(row)


async def get_all_states(conn: asyncpg.Connection):
    rows = await conn.fetch(
        "SELECT state_id, state_name, state_code, region_id, created_at, updated_at FROM state ORDER BY state_name"
    )
    return [dict(row) for row in rows]


async def get_state_by_id(conn: asyncpg.Connection, state_id: UUID):
    row = await conn.fetchrow(
        "SELECT state_id, state_name, state_code, region_id, created_at, updated_at FROM state WHERE state_id = $1",
        state_id,
    )
    return dict(row) if row else None


async def update_state(conn: asyncpg.Connection, state_id: UUID, state_name, state_code, region_id):
    row = await conn.fetchrow(
        """
        UPDATE state
        SET state_name = COALESCE($2, state_name),
            state_code = COALESCE($3, state_code),
            region_id  = COALESCE($4, region_id)
        WHERE state_id = $1
        RETURNING state_id, state_name, state_code, region_id, created_at, updated_at
        """,
        state_id, state_name, state_code, region_id,
    )
    return dict(row) if row else None


async def delete_state(conn: asyncpg.Connection, state_id: UUID):
    result = await conn.execute("DELETE FROM state WHERE state_id = $1", state_id)
    return result == "DELETE 1"