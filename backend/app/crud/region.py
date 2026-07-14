import asyncpg
from uuid import UUID


async def create_region(conn: asyncpg.Connection, region_name: str, region_code: str):
    row = await conn.fetchrow(
        """
        INSERT INTO region (region_name, region_code)
        VALUES ($1, $2)
        RETURNING region_id, region_name, region_code, created_at, updated_at
        """,
        region_name, region_code,
    )
    return dict(row)


async def get_all_regions(conn: asyncpg.Connection):
    rows = await conn.fetch(
        "SELECT region_id, region_name, region_code, created_at, updated_at FROM region ORDER BY region_name"
    )
    return [dict(row) for row in rows]


async def get_region_by_id(conn: asyncpg.Connection, region_id: UUID):
    row = await conn.fetchrow(
        "SELECT region_id, region_name, region_code, created_at, updated_at FROM region WHERE region_id = $1",
        region_id,
    )
    return dict(row) if row else None


async def update_region(conn: asyncpg.Connection, region_id: UUID, region_name: str | None, region_code: str | None):
    row = await conn.fetchrow(
        """
        UPDATE region
        SET region_name = COALESCE($2, region_name),
            region_code = COALESCE($3, region_code)
        WHERE region_id = $1
        RETURNING region_id, region_name, region_code, created_at, updated_at
        """,
        region_id, region_name, region_code,
    )
    return dict(row) if row else None


async def delete_region(conn: asyncpg.Connection, region_id: UUID):
    result = await conn.execute("DELETE FROM region WHERE region_id = $1", region_id)
    return result == "DELETE 1"