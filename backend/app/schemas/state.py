from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime


class StateBase(BaseModel):
    state_name: str
    state_code: str
    region_id: UUID


class StateCreate(StateBase):
    pass


class StateUpdate(BaseModel):
    state_name: str | None = None
    state_code: str | None = None
    region_id: UUID | None = None


class StateOut(StateBase):
    state_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)