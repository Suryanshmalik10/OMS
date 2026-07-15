from fastapi import APIRouter, Depends, HTTPException
import asyncpg
from uuid import UUID

from app.db import get_db
from app.deps import get_current_user, require_admin
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectOut
from app.crud import project as project_crud

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.post("/", response_model=ProjectOut, status_code=201)
async def create_project(payload: ProjectCreate, conn: asyncpg.Connection = Depends(get_db), _: dict = Depends(require_admin)):
    try:
        return await project_crud.create_project(conn, payload.project_name, payload.project_code, payload.customer_id)
    except asyncpg.ForeignKeyViolationError:
        raise HTTPException(status_code=400, detail="customer_id does not exist")
    except asyncpg.UniqueViolationError:
        raise HTTPException(status_code=409, detail="project_code already exists for this customer")


@router.get("/", response_model=list[ProjectOut])
async def list_projects(conn: asyncpg.Connection = Depends(get_db), _: dict = Depends(get_current_user)):
    return await project_crud.get_all_projects(conn)


@router.get("/{project_id}", response_model=ProjectOut)
async def get_project(project_id: UUID, conn: asyncpg.Connection = Depends(get_db), _: dict = Depends(get_current_user)):
    project = await project_crud.get_project_by_id(conn, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.put("/{project_id}", response_model=ProjectOut)
async def update_project(project_id: UUID, payload: ProjectUpdate, conn: asyncpg.Connection = Depends(get_db), _: dict = Depends(require_admin)):
    project = await project_crud.update_project(conn, project_id, payload.project_name, payload.project_code, payload.customer_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.delete("/{project_id}", status_code=204)
async def delete_project(project_id: UUID, conn: asyncpg.Connection = Depends(get_db), _: dict = Depends(require_admin)):
    deleted = await project_crud.delete_project(conn, project_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Project not found")