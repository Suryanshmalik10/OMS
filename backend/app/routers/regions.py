from fastapi import APIRouter, Depends, HTTPException
import asyncpg
from uuid import UUID

from app.db import get_db
from app.schemas.region import RegionCreate, RegionUpdate, RegionOut
from app.crud import region as region_crud

router = APIRouter(prefix="/regions", tags=["Regions"])


@router.post("/", response_model=RegionOut, status_code=201)
async def create_region(payload: RegionCreate, conn: asyncpg.Connection = Depends(get_db)):
    return await region_crud.create_region(conn, payload.region_name, payload.region_code)


@router.get("/", response_model=list[RegionOut])
async def list_regions(conn: asyncpg.Connection = Depends(get_db)):
    return await region_crud.get_all_regions(conn)


@router.get("/{region_id}", response_model=RegionOut)
async def get_region(region_id: UUID, conn: asyncpg.Connection = Depends(get_db)):
    region = await region_crud.get_region_by_id(conn, region_id)
    if not region:
        raise HTTPException(status_code=404, detail="Region not found")
    return region


@router.put("/{region_id}", response_model=RegionOut)
async def update_region(region_id: UUID, payload: RegionUpdate, conn: asyncpg.Connection = Depends(get_db)):
    region = await region_crud.update_region(conn, region_id, payload.region_name, payload.region_code)
    if not region:
        raise HTTPException(status_code=404, detail="Region not found")
    return region


@router.delete("/{region_id}", status_code=204)
async def delete_region(region_id: UUID, conn: asyncpg.Connection = Depends(get_db)):
    deleted = await region_crud.delete_region(conn, region_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Region not found")