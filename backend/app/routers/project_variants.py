from fastapi import APIRouter, Depends, HTTPException
import asyncpg
from uuid import UUID

from app.db import get_db
from app.schemas.project_variant import ProjectVariantCreate, ProjectVariantUpdate, ProjectVariantOut
from app.crud import project_variant as variant_crud

router = APIRouter(prefix="/project-variants", tags=["Project Variants"])


@router.post("/", response_model=ProjectVariantOut, status_code=201)
async def create_variant(payload: ProjectVariantCreate, conn: asyncpg.Connection = Depends(get_db)):
    try:
        return await variant_crud.create_variant(
            conn, payload.project_id, payload.variant_name, payload.case_type.value, payload.is_live, payload.go_live_date
        )
    except asyncpg.ForeignKeyViolationError:
        raise HTTPException(status_code=400, detail="project_id does not exist")


@router.get("/", response_model=list[ProjectVariantOut])
async def list_variants(conn: asyncpg.Connection = Depends(get_db)):
    return await variant_crud.get_all_variants(conn)


@router.get("/{variant_id}", response_model=ProjectVariantOut)
async def get_variant(variant_id: UUID, conn: asyncpg.Connection = Depends(get_db)):
    variant = await variant_crud.get_variant_by_id(conn, variant_id)
    if not variant:
        raise HTTPException(status_code=404, detail="Project variant not found")
    return variant


@router.put("/{variant_id}", response_model=ProjectVariantOut)
async def update_variant(variant_id: UUID, payload: ProjectVariantUpdate, conn: asyncpg.Connection = Depends(get_db)):
    case_type_val = payload.case_type.value if payload.case_type else None
    variant = await variant_crud.update_variant(
        conn, variant_id, payload.variant_name, case_type_val, payload.is_live, payload.go_live_date, payload.project_id
    )
    if not variant:
        raise HTTPException(status_code=404, detail="Project variant not found")
    return variant


@router.delete("/{variant_id}", status_code=204)
async def delete_variant(variant_id: UUID, conn: asyncpg.Connection = Depends(get_db)):
    deleted = await variant_crud.delete_variant(conn, variant_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Project variant not found")