from fastapi import APIRouter, Depends, HTTPException
import asyncpg
from uuid import UUID

from app.db import get_db
from app.schemas.server import ServerCreate, ServerUpdate, ServerOut
from app.crud import server as server_crud

router = APIRouter(prefix="/servers", tags=["Servers"])


@router.post("/", response_model=ServerOut, status_code=201)
async def create_server(payload: ServerCreate, conn: asyncpg.Connection = Depends(get_db)):
    try:
        return await server_crud.create_server(
            conn, payload.variant_id, payload.server_type.value, payload.dc_dr.value,
            payload.year_code, payload.month_code, payload.service_name.value,
            payload.serial_no, payload.vm_name,
        )
    except asyncpg.ForeignKeyViolationError:
        raise HTTPException(status_code=400, detail="variant_id does not exist")
    except asyncpg.UniqueViolationError:
        raise HTTPException(status_code=409, detail="vm_name already exists")


@router.get("/", response_model=list[ServerOut])
async def list_servers(conn: asyncpg.Connection = Depends(get_db)):
    return await server_crud.get_all_servers(conn)


@router.get("/{server_id}", response_model=ServerOut)
async def get_server(server_id: UUID, conn: asyncpg.Connection = Depends(get_db)):
    server = await server_crud.get_server_by_id(conn, server_id)
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    return server


@router.put("/{server_id}", response_model=ServerOut)
async def update_server(server_id: UUID, payload: ServerUpdate, conn: asyncpg.Connection = Depends(get_db)):
    server = await server_crud.update_server(
        conn, server_id,
        payload.server_type.value if payload.server_type else None,
        payload.dc_dr.value if payload.dc_dr else None,
        payload.year_code, payload.month_code,
        payload.service_name.value if payload.service_name else None,
        payload.serial_no, payload.vm_name, payload.variant_id,
    )
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    return server


@router.delete("/{server_id}", status_code=204)
async def delete_server(server_id: UUID, conn: asyncpg.Connection = Depends(get_db)):
    deleted = await server_crud.delete_server(conn, server_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Server not found")