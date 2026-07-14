from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from enum import Enum


class ServerType(str, Enum):
    PRODUCTION = "PRODUCTION"
    DEVELOPMENT = "DEVELOPMENT"
    STAGING = "STAGING"
    TESTING = "TESTING"


class DcDr(str, Enum):
    DC = "DC"
    DR = "DR"


class ServiceName(str, Enum):
    DATABASE = "DATABASE"
    WEB = "WEB"
    LOG = "LOG"
    BACKUP = "BACKUP"
    APPLICATION = "APPLICATION"
    FTP = "FTP"
    OTHER = "OTHER"


class ServerBase(BaseModel):
    variant_id: UUID
    server_type: ServerType
    dc_dr: DcDr
    year_code: str
    month_code: str
    service_name: ServiceName
    serial_no: str
    vm_name: str


class ServerCreate(ServerBase):
    pass


class ServerUpdate(BaseModel):
    server_type: ServerType | None = None
    dc_dr: DcDr | None = None
    year_code: str | None = None
    month_code: str | None = None
    service_name: ServiceName | None = None
    serial_no: str | None = None
    vm_name: str | None = None
    variant_id: UUID | None = None


class ServerOut(ServerBase):
    server_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)