from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum
from app.services.ai_service import ai_service

router = APIRouter()

class BotStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    TRAINING = "training"
    ERROR = "error"

class BotChannel(str, Enum):
    TELEGRAM = "telegram"
    WHATSAPP = "whatsapp"
    WEB = "web"

class BotCreate(BaseModel):
    name: str
    website_url: str
    description: Optional[str] = None
    channels: List[BotChannel] = [BotChannel.TELEGRAM]
    language: str = "en"

class BotUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    channels: Optional[List[BotChannel]] = None
    language: Optional[str] = None

class Bot(BaseModel):
    id: int
    name: str
    website_url: str
    description: Optional[str] = None
    status: BotStatus
    channels: List[BotChannel]
    language: str
    created_at: datetime
    last_trained: Optional[datetime] = None
    total_queries: int = 0
    accuracy_score: Optional[float] = None

class BotResponse(BaseModel):
    question: str
    answer: str
    confidence: float
    source_url: Optional[str] = None

# Mock database
mock_bots = [
    Bot(
        id=1,
        name="University FAQ Bot",
        website_url="https://university.edu",
        description="AI-powered FAQ bot for university students",
        status=BotStatus.ACTIVE,
        channels=[BotChannel.TELEGRAM, BotChannel.WEB],
        language="en",
        created_at=datetime.now(),
        last_trained=datetime.now(),
        total_queries=1250,
        accuracy_score=0.92
    ),
    Bot(
        id=2,
        name="School Support Bot",
        website_url="https://school.edu",
        description="Multilingual support bot for school students",
        status=BotStatus.ACTIVE,
        channels=[BotChannel.TELEGRAM, BotChannel.WHATSAPP],
        language="ru",
        created_at=datetime.now(),
        last_trained=datetime.now(),
        total_queries=890,
        accuracy_score=0.88
    )
]

@router.get("/", response_model=List[Bot])
async def get_bots():
    """Get all user's bots"""
    return mock_bots

@router.get("/{bot_id}", response_model=Bot)
async def get_bot(bot_id: int):
    """Get specific bot by ID"""
    bot = next((bot for bot in mock_bots if bot.id == bot_id), None)
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    return bot

@router.post("/", response_model=Bot)
async def create_bot(bot_data: BotCreate):
    """Create a new bot"""
    new_bot = Bot(
        id=len(mock_bots) + 1,
        name=bot_data.name,
        website_url=bot_data.website_url,
        description=bot_data.description,
        status=BotStatus.TRAINING,
        channels=bot_data.channels,
        language=bot_data.language,
        created_at=datetime.now()
    )
    mock_bots.append(new_bot)
    return new_bot

@router.put("/{bot_id}", response_model=Bot)
async def update_bot(bot_id: int, bot_update: BotUpdate):
    """Update bot configuration"""
    bot = next((bot for bot in mock_bots if bot.id == bot_id), None)
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    if bot_update.name:
        bot.name = bot_update.name
    if bot_update.description is not None:
        bot.description = bot_update.description
    if bot_update.channels:
        bot.channels = bot_update.channels
    if bot_update.language:
        bot.language = bot_update.language
    
    return bot

@router.delete("/{bot_id}")
async def delete_bot(bot_id: int):
    """Delete a bot"""
    global mock_bots
    bot = next((bot for bot in mock_bots if bot.id == bot_id), None)
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    mock_bots = [bot for bot in mock_bots if bot.id != bot_id]
    return {"message": "Bot deleted successfully"}

@router.post("/{bot_id}/train")
async def train_bot(bot_id: int, background_tasks: BackgroundTasks):
    """Start bot training process"""
    bot = next((bot for bot in mock_bots if bot.id == bot_id), None)
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    bot.status = BotStatus.TRAINING
    
    # Start training in background
    background_tasks.add_task(train_bot_async, bot_id, bot.website_url)
    
    return {"message": "Bot training started", "status": "training"}

async def train_bot_async(bot_id: int, website_url: str):
    """Background task to train the bot"""
    try:
        # Initialize AI service if not already done
        if ai_service.model is None:
            await ai_service.initialize_model()
        
        # Train the bot
        result = await ai_service.train_bot(bot_id, website_url)
        
        # Update bot status
        bot = next((bot for bot in mock_bots if bot.id == bot_id), None)
        if bot:
            if result['success']:
                bot.status = BotStatus.ACTIVE
                bot.last_trained = datetime.now()
            else:
                bot.status = BotStatus.ERROR
                
    except Exception as e:
        # Update bot status to error
        bot = next((bot for bot in mock_bots if bot.id == bot_id), None)
        if bot:
            bot.status = BotStatus.ERROR

@router.post("/{bot_id}/query", response_model=BotResponse)
async def query_bot(bot_id: int, question: str):
    """Query the bot with a question"""
    bot = next((bot for bot in mock_bots if bot.id == bot_id), None)
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    if bot.status != BotStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Bot is not active")
    
    try:
        # Initialize AI service if not already done
        if ai_service.model is None:
            await ai_service.initialize_model()
        
        # Query the bot using AI service
        result = await ai_service.query_bot(bot_id, question)
        
        if not result['success']:
            raise HTTPException(status_code=500, detail=result['message'])
        
        # Update bot query count
        bot.total_queries += 1
        
        return BotResponse(
            question=question,
            answer=result['answer'],
            confidence=result['confidence'],
            source_url=result.get('source_url')
        )
        
    except Exception as e:
        # Fallback to mock response if AI fails
        return BotResponse(
            question=question,
            answer="I apologize, but I'm experiencing technical difficulties. Please try again later or contact support.",
            confidence=0.0,
            source_url=bot.website_url
        )

@router.get("/{bot_id}/analytics")
async def get_bot_analytics(bot_id: int):
    """Get bot analytics and statistics"""
    bot = next((bot for bot in mock_bots if bot.id == bot_id), None)
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    return {
        "bot_id": bot_id,
        "total_queries": bot.total_queries,
        "accuracy_score": bot.accuracy_score,
        "status": bot.status,
        "last_trained": bot.last_trained,
        "daily_queries": 45,
        "weekly_queries": 320,
        "monthly_queries": 1250,
        "top_questions": [
            "How do I apply for admission?",
            "What are the tuition fees?",
            "When is the application deadline?",
            "What documents do I need?",
            "How can I contact the admissions office?"
        ],
        "response_times": {
            "average": 1.2,
            "min": 0.8,
            "max": 3.5
        }
    }
