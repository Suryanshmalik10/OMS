from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime


class RegionBase(BaseModel):
    region_name: str
    region_code: str


class RegionCreate(RegionBase):
    pass


class RegionUpdate(BaseModel):
    region_name: str | None = None
    region_code: str | None = None


class RegionOut(RegionBase):
    region_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)