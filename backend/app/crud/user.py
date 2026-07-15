import asyncpg
from uuid import UUID


async def create_user(conn: asyncpg.Connection, username: str, email: str, password_hash: str, role: str):
    row = await conn.fetchrow(
        """
        INSERT INTO app_user (username, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING user_id, username, email, role, is_active, created_at, updated_at
        """,
        username, email, password_hash, role,
    )
    return dict(row)


async def get_user_by_username(conn: asyncpg.Connection, username: str):
    row = await conn.fetchrow(
        "SELECT user_id, username, email, password_hash, role, is_active, created_at, updated_at FROM app_user WHERE username = $1",
        username,
    )
    return dict(row) if row else None


async def get_user_by_id(conn: asyncpg.Connection, user_id: UUID):
    row = await conn.fetchrow(
        "SELECT user_id, username, email, role, is_active, created_at, updated_at FROM app_user WHERE user_id = $1",
        user_id,
    )
    return dict(row) if row else None