from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
import asyncpg

from app.db import get_db
from app.schemas.user import UserCreate, UserOut, Token
from app.crud import user as user_crud
from app.core.security import hash_password, verify_password, create_access_token
from app.deps import require_admin

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=UserOut, status_code=201)
async def register(
    payload: UserCreate,
    conn: asyncpg.Connection = Depends(get_db),
    current_user: dict = Depends(require_admin),
):
    existing = await user_crud.get_user_by_username(conn, payload.username)
    if existing:
        raise HTTPException(status_code=409, detail="Username already taken")

    hashed = hash_password(payload.password)
    return await user_crud.create_user(conn, payload.username, payload.email, hashed, payload.role.value)


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    conn: asyncpg.Connection = Depends(get_db),
):
    user = await user_crud.get_user_by_username(conn, form_data.username)
    if not user or not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")

    token = create_access_token({"sub": str(user["user_id"]), "role": user["role"]})
    return Token(access_token=token)