from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.core.security import get_current_user
from app.models.user import User
from sqlalchemy import select
from pydantic import BaseModel

router = APIRouter()

class AuthResponse(BaseModel):
    status: str
    user_id: str

@router.post("/verify", response_model=AuthResponse)
async def verify_user(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Verifies the Clerk token and ensures the user exists in the local DB.
    """
    clerk_id = current_user['id']
    email = current_user.get('email', '')

    # Check if user exists locally
    result = await db.execute(select(User).where(User.clerk_id == clerk_id))
    user = result.scalars().first()

    if not user:
        user = User(clerk_id=clerk_id, email=email)
        db.add(user)
        await db.commit()
    
    return {"status": "verified", "user_id": clerk_id}