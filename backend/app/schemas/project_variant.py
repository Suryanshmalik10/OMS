from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime, date
from enum import Enum


class CaseType(str, Enum):
    NIC_MOU = "NIC_MOU"
    NON_MOU = "NON_MOU"


class ProjectVariantBase(BaseModel):
    project_id: UUID
    variant_name: str
    case_type: CaseType = CaseType.NIC_MOU
    is_live: bool = False
    go_live_date: date | None = None


class ProjectVariantCreate(ProjectVariantBase):
    pass


class ProjectVariantUpdate(BaseModel):
    variant_name: str | None = None
    case_type: CaseType | None = None
    is_live: bool | None = None
    go_live_date: date | None = None
    project_id: UUID | None = None


class ProjectVariantOut(ProjectVariantBase):
    variant_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)