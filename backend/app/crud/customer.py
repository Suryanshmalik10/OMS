import asyncpg
from uuid import UUID


async def create_customer(conn: asyncpg.Connection, customer_name: str, customer_code: str, state_id: UUID):
    row = await conn.fetchrow(
        """
        INSERT INTO customer (customer_name, customer_code, state_id)
        VALUES ($1, $2, $3)
        RETURNING customer_id, customer_name, customer_code, state_id, created_at, updated_at
        """,
        customer_name, customer_code, state_id,
    )
    return dict(row)


async def get_all_customers(conn: asyncpg.Connection):
    rows = await conn.fetch(
        "SELECT customer_id, customer_name, customer_code, state_id, created_at, updated_at FROM customer ORDER BY customer_name"
    )
    return [dict(row) for row in rows]


async def get_customer_by_id(conn: asyncpg.Connection, customer_id: UUID):
    row = await conn.fetchrow(
        "SELECT customer_id, customer_name, customer_code, state_id, created_at, updated_at FROM customer WHERE customer_id = $1",
        customer_id,
    )
    return dict(row) if row else None


async def update_customer(conn: asyncpg.Connection, customer_id: UUID, customer_name, customer_code, state_id):
    row = await conn.fetchrow(
        """
        UPDATE customer
        SET customer_name = COALESCE($2, customer_name),
            customer_code = COALESCE($3, customer_code),
            state_id      = COALESCE($4, state_id)
        WHERE customer_id = $1
        RETURNING customer_id, customer_name, customer_code, state_id, created_at, updated_at
        """,
        customer_id, customer_name, customer_code, state_id,
    )
    return dict(row) if row else None


async def delete_customer(conn: asyncpg.Connection, customer_id: UUID):
    result = await conn.execute("DELETE FROM customer WHERE customer_id = $1", customer_id)
    return result == "DELETE 1"