from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime, timedelta

router = APIRouter()

class AnalyticsOverview(BaseModel):
    total_bots: int
    total_queries: int
    active_users: int
    accuracy_avg: float
    response_time_avg: float

class QueryStats(BaseModel):
    date: str
    queries: int
    accuracy: float

class ChannelStats(BaseModel):
    channel: str
    queries: int
    percentage: float

class TopQuestion(BaseModel):
    question: str
    count: int
    accuracy: float

@router.get("/overview", response_model=AnalyticsOverview)
async def get_analytics_overview():
    """Get overall analytics overview"""
    return AnalyticsOverview(
        total_bots=3,
        total_queries=5420,
        active_users=15,
        accuracy_avg=0.89,
        response_time_avg=1.3
    )

@router.get("/queries/trends")
async def get_query_trends(days: int = 30):
    """Get query trends over time"""
    # Mock data - replace with real analytics
    trends = []
    for i in range(days):
        date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
        queries = max(0, 50 - i + (i % 7) * 10)  # Mock trend
        accuracy = 0.85 + (i % 10) * 0.01  # Mock accuracy
        
        trends.append(QueryStats(
            date=date,
            queries=queries,
            accuracy=round(accuracy, 2)
        ))
    
    return {"trends": trends}

@router.get("/channels/stats", response_model=List[ChannelStats])
async def get_channel_stats():
    """Get statistics by channel"""
    return [
        ChannelStats(channel="telegram", queries=3200, percentage=59.0),
        ChannelStats(channel="web", queries=1500, percentage=27.7),
        ChannelStats(channel="whatsapp", queries=720, percentage=13.3)
    ]

@router.get("/questions/top", response_model=List[TopQuestion])
async def get_top_questions(limit: int = 10):
    """Get most frequently asked questions"""
    return [
        TopQuestion(question="How do I apply for admission?", count=245, accuracy=0.92),
        TopQuestion(question="What are the tuition fees?", count=189, accuracy=0.88),
        TopQuestion(question="When is the application deadline?", count=156, accuracy=0.95),
        TopQuestion(question="What documents do I need?", count=134, accuracy=0.87),
        TopQuestion(question="How can I contact admissions?", count=98, accuracy=0.91),
        TopQuestion(question="What programs are available?", count=87, accuracy=0.89),
        TopQuestion(question="Is financial aid available?", count=76, accuracy=0.85),
        TopQuestion(question="What are the admission requirements?", count=65, accuracy=0.93),
        TopQuestion(question="How long does the process take?", count=54, accuracy=0.86),
        TopQuestion(question="Can I visit the campus?", count=43, accuracy=0.90)
    ]

@router.get("/performance")
async def get_performance_metrics():
    """Get performance metrics"""
    return {
        "response_times": {
            "average": 1.3,
            "p50": 1.1,
            "p95": 2.8,
            "p99": 4.2
        },
        "accuracy_by_language": {
            "en": 0.91,
            "ru": 0.88,
            "et": 0.85
        },
        "uptime": {
            "last_24h": 99.8,
            "last_7d": 99.5,
            "last_30d": 99.2
        },
        "user_satisfaction": {
            "rating": 4.6,
            "total_ratings": 156,
            "positive_feedback": 89.2
        }
    }

@router.get("/revenue")
async def get_revenue_analytics():
    """Get revenue and subscription analytics"""
    return {
        "monthly_recurring_revenue": 2475.0,
        "total_revenue": 19800.0,
        "subscriptions": {
            "starter": 8,
            "professional": 12,
            "business": 3,
            "enterprise": 1
        },
        "churn_rate": 0.05,
        "growth_rate": 0.15,
        "average_revenue_per_user": 103.13
    }
