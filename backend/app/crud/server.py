import asyncpg
from uuid import UUID


async def create_server(conn: asyncpg.Connection, variant_id, server_type, dc_dr, year_code, month_code, service_name, serial_no, vm_name):
    row = await conn.fetchrow(
        """
        INSERT INTO server (variant_id, server_type, dc_dr, year_code, month_code, service_name, serial_no, vm_name)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING server_id, variant_id, server_type, dc_dr, year_code, month_code, service_name, serial_no, vm_name, created_at, updated_at
        """,
        variant_id, server_type, dc_dr, year_code, month_code, service_name, serial_no, vm_name,
    )
    return dict(row)


async def get_all_servers(conn: asyncpg.Connection):
    rows = await conn.fetch(
        "SELECT server_id, variant_id, server_type, dc_dr, year_code, month_code, service_name, serial_no, vm_name, created_at, updated_at FROM server ORDER BY vm_name"
    )
    return [dict(row) for row in rows]


async def get_server_by_id(conn: asyncpg.Connection, server_id: UUID):
    row = await conn.fetchrow(
        "SELECT server_id, variant_id, server_type, dc_dr, year_code, month_code, service_name, serial_no, vm_name, created_at, updated_at FROM server WHERE server_id = $1",
        server_id,
    )
    return dict(row) if row else None


async def update_server(conn: asyncpg.Connection, server_id: UUID, server_type, dc_dr, year_code, month_code, service_name, serial_no, vm_name, variant_id):
    row = await conn.fetchrow(
        """
        UPDATE server
        SET server_type  = COALESCE($2, server_type),
            dc_dr        = COALESCE($3, dc_dr),
            year_code    = COALESCE($4, year_code),
            month_code   = COALESCE($5, month_code),
            service_name = COALESCE($6, service_name),
            serial_no    = COALESCE($7, serial_no),
            vm_name      = COALESCE($8, vm_name),
            variant_id   = COALESCE($9, variant_id)
        WHERE server_id = $1
        RETURNING server_id, variant_id, server_type, dc_dr, year_code, month_code, service_name, serial_no, vm_name, created_at, updated_at
        """,
        server_id, server_type, dc_dr, year_code, month_code, service_name, serial_no, vm_name, variant_id,
    )
    return dict(row) if row else None


async def delete_server(conn: asyncpg.Connection, server_id: UUID):
    result = await conn.execute("DELETE FROM server WHERE server_id = $1", server_id)
    return result == "DELETE 1"