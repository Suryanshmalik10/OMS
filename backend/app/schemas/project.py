from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime


class ProjectBase(BaseModel):
    project_name: str
    project_code: str
    customer_id: UUID


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    project_name: str | None = None
    project_code: str | None = None
    customer_id: UUID | None = None


class ProjectOut(ProjectBase):
    project_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)