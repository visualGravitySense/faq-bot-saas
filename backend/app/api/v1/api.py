from fastapi import APIRouter
from app.api.v1.endpoints import auth, bots, analytics, users, telegram

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(bots.router, prefix="/bots", tags=["bots"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(telegram.router, prefix="/telegram", tags=["telegram"])
