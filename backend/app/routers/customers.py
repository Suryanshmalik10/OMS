from fastapi import APIRouter, Depends, HTTPException
import asyncpg
from uuid import UUID

from app.db import get_db
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerOut
from app.crud import customer as customer_crud

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.post("/", response_model=CustomerOut, status_code=201)
async def create_customer(payload: CustomerCreate, conn: asyncpg.Connection = Depends(get_db)):
    try:
        return await customer_crud.create_customer(conn, payload.customer_name, payload.customer_code, payload.state_id)
    except asyncpg.ForeignKeyViolationError:
        raise HTTPException(status_code=400, detail="state_id does not exist")
    except asyncpg.UniqueViolationError:
        raise HTTPException(status_code=409, detail="customer_code already exists for this state")


@router.get("/", response_model=list[CustomerOut])
async def list_customers(conn: asyncpg.Connection = Depends(get_db)):
    return await customer_crud.get_all_customers(conn)


@router.get("/{customer_id}", response_model=CustomerOut)
async def get_customer(customer_id: UUID, conn: asyncpg.Connection = Depends(get_db)):
    customer = await customer_crud.get_customer_by_id(conn, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@router.put("/{customer_id}", response_model=CustomerOut)
async def update_customer(customer_id: UUID, payload: CustomerUpdate, conn: asyncpg.Connection = Depends(get_db)):
    customer = await customer_crud.update_customer(conn, customer_id, payload.customer_name, payload.customer_code, payload.state_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@router.delete("/{customer_id}", status_code=204)
async def delete_customer(customer_id: UUID, conn: asyncpg.Connection = Depends(get_db)):
    deleted = await customer_crud.delete_customer(conn, customer_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Customer not found")