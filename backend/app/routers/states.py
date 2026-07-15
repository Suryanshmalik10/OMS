from fastapi import APIRouter, Depends, HTTPException
import asyncpg
from uuid import UUID

from app.db import get_db
from app.deps import get_current_user, require_admin
from app.schemas.state import StateCreate, StateUpdate, StateOut
from app.crud import state as state_crud

router = APIRouter(prefix="/states", tags=["States"])


@router.post("/", response_model=StateOut, status_code=201)
async def create_state(payload: StateCreate, conn: asyncpg.Connection = Depends(get_db), _: dict = Depends(require_admin)):
    try:
        return await state_crud.create_state(conn, payload.state_name, payload.state_code, payload.region_id)
    except asyncpg.ForeignKeyViolationError:
        raise HTTPException(status_code=400, detail="region_id does not exist")


@router.get("/", response_model=list[StateOut])
async def list_states(conn: asyncpg.Connection = Depends(get_db), _: dict = Depends(get_current_user)):
    return await state_crud.get_all_states(conn)


@router.get("/{state_id}", response_model=StateOut)
async def get_state(state_id: UUID, conn: asyncpg.Connection = Depends(get_db), _: dict = Depends(get_current_user)):
    state = await state_crud.get_state_by_id(conn, state_id)
    if not state:
        raise HTTPException(status_code=404, detail="State not found")
    return state


@router.put("/{state_id}", response_model=StateOut)
async def update_state(state_id: UUID, payload: StateUpdate, conn: asyncpg.Connection = Depends(get_db), _: dict = Depends(require_admin)):
    state = await state_crud.update_state(conn, state_id, payload.state_name, payload.state_code, payload.region_id)
    if not state:
        raise HTTPException(status_code=404, detail="State not found")
    return state


@router.delete("/{state_id}", status_code=204)
async def delete_state(state_id: UUID, conn: asyncpg.Connection = Depends(get_db), _: dict = Depends(require_admin)):
    deleted = await state_crud.delete_state(conn, state_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="State not found")