from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()

class UserProfile(BaseModel):
    id: int
    email: str
    full_name: str
    organization: Optional[str] = None
    subscription_plan: str = "starter"
    is_active: bool = True
    created_at: datetime
    last_login: Optional[datetime] = None

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    organization: Optional[str] = None

@router.get("/profile", response_model=UserProfile)
async def get_user_profile():
    """Get user profile information"""
    # Mock data - replace with real database query
    return UserProfile(
        id=1,
        email="admin@example.com",
        full_name="Admin User",
        organization="FAQ Bot SaaS",
        subscription_plan="professional",
        is_active=True,
        created_at=datetime.now(),
        last_login=datetime.now()
    )

@router.put("/profile", response_model=UserProfile)
async def update_user_profile(user_update: UserUpdate):
    """Update user profile"""
    # Mock implementation - replace with real database update
    return UserProfile(
        id=1,
        email="admin@example.com",
        full_name=user_update.full_name or "Admin User",
        organization=user_update.organization or "FAQ Bot SaaS",
        subscription_plan="professional",
        is_active=True,
        created_at=datetime.now(),
        last_login=datetime.now()
    )

@router.get("/subscription")
async def get_subscription_info():
    """Get user subscription information"""
    return {
        "plan": "professional",
        "status": "active",
        "billing_cycle": "monthly",
        "next_billing_date": "2024-01-01",
        "features": {
            "max_websites": 5,
            "max_queries_per_month": 10000,
            "channels": ["telegram", "whatsapp", "web"],
            "analytics": True,
            "api_access": True
        }
    }
