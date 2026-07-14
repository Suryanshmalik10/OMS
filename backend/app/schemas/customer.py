from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime


class CustomerBase(BaseModel):
    customer_name: str
    customer_code: str
    state_id: UUID


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    customer_name: str | None = None
    customer_code: str | None = None
    state_id: UUID | None = None


class CustomerOut(CustomerBase):
    customer_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)