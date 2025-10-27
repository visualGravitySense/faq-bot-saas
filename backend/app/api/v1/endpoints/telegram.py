from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any
from app.services.telegram_service import telegram_service
from app.api.v1.endpoints.auth import get_current_user, User

router = APIRouter()

class TelegramBotConfig(BaseModel):
    bot_id: int
    bot_name: str
    bot_token: str = None
    webhook_url: str = None
    is_active: bool = True

class TelegramStats(BaseModel):
    active_bots: int
    total_queries: int
    active_users: int
    bots: List[int]

@router.post("/register")
async def register_telegram_bot(
    config: TelegramBotConfig,
    current_user: User = Depends(get_current_user)
):
    """Register a FAQ bot for Telegram integration"""
    try:
        await telegram_service.register_faq_bot(
            bot_id=config.bot_id,
            bot_name=config.bot_name,
            bot_token=config.bot_token
        )
        return {"message": "Telegram bot registered successfully", "bot_id": config.bot_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to register bot: {str(e)}")

@router.delete("/{bot_id}")
async def unregister_telegram_bot(
    bot_id: int,
    current_user: User = Depends(get_current_user)
):
    """Unregister a FAQ bot from Telegram"""
    try:
        await telegram_service.unregister_faq_bot(bot_id)
        return {"message": "Telegram bot unregistered successfully", "bot_id": bot_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to unregister bot: {str(e)}")

@router.get("/stats", response_model=TelegramStats)
async def get_telegram_stats(current_user: User = Depends(get_current_user)):
    """Get Telegram bot statistics"""
    try:
        stats = await telegram_service.get_bot_stats()
        return TelegramStats(**stats)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")

@router.get("/bots")
async def list_telegram_bots(current_user: User = Depends(get_current_user)):
    """List all registered Telegram bots"""
    try:
        return {
            "bots": list(telegram_service.active_bots.keys()),
            "total": len(telegram_service.active_bots)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list bots: {str(e)}")

@router.post("/start")
async def start_telegram_service(current_user: User = Depends(get_current_user)):
    """Start the Telegram bot service"""
    try:
        if not telegram_service.application:
            await telegram_service.initialize()
        
        if telegram_service.application:
            await telegram_service.start_bot()
            return {"message": "Telegram bot service started successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to initialize Telegram service")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start service: {str(e)}")

@router.post("/stop")
async def stop_telegram_service(current_user: User = Depends(get_current_user)):
    """Stop the Telegram bot service"""
    try:
        await telegram_service.stop_bot()
        return {"message": "Telegram bot service stopped successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to stop service: {str(e)}")

@router.get("/status")
async def get_telegram_status(current_user: User = Depends(get_current_user)):
    """Get Telegram bot service status"""
    try:
        is_running = telegram_service.application is not None
        stats = await telegram_service.get_bot_stats()
        
        return {
            "is_running": is_running,
            "active_bots": stats["active_bots"],
            "total_queries": stats["total_queries"],
            "active_users": stats["active_users"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get status: {str(e)}")
