from fastapi import FastAPI
from app.db import connect_db, disconnect_db
from app.routers import regions

app = FastAPI(title="RailTel OMS", version="0.1.0")

app.include_router(regions.router)


@app.on_event("startup")
async def on_startup():
    await connect_db()


@app.on_event("shutdown")
async def on_shutdown():
    await disconnect_db()


@app.get("/health")
async def health_check():
    return {"status": "ok"}
