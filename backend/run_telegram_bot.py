#!/usr/bin/env python3
"""
Script to run the Telegram bot service
"""
import asyncio
import logging
import os
import sys
from pathlib import Path

# Add the app directory to Python path
sys.path.append(str(Path(__file__).parent))

from app.services.telegram_service import telegram_service
from app.core.config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def main():
    """Main function to run the Telegram bot"""
    logger.info("Starting FAQ Bot SaaS Telegram Service...")
    
    # Check if Telegram bot token is configured
    if not settings.TELEGRAM_BOT_TOKEN:
        logger.error("TELEGRAM_BOT_TOKEN not set in environment variables")
        logger.info("Please set TELEGRAM_BOT_TOKEN in your .env file or environment")
        logger.info("You can get a bot token from @BotFather on Telegram")
        return
    
    try:
        # Initialize the Telegram service
        if await telegram_service.initialize():
            logger.info("Telegram service initialized successfully")
            
            # Register some demo bots
            await telegram_service.register_faq_bot(1, "FAQ Bot Demo", settings.TELEGRAM_BOT_TOKEN)
            await telegram_service.register_faq_bot(2, "Support Bot", settings.TELEGRAM_BOT_TOKEN)
            
            logger.info("Demo bots registered")
            logger.info("Starting Telegram bot polling...")
            
            # Start the bot
            await telegram_service.start_bot()
            
            # Keep the bot running
            try:
                while True:
                    await asyncio.sleep(1)
            except KeyboardInterrupt:
                logger.info("Received interrupt signal, stopping bot...")
        else:
            logger.error("Failed to initialize Telegram service")
            
    except Exception as e:
        logger.error(f"Error running Telegram bot: {e}")
    finally:
        await telegram_service.stop_bot()
        logger.info("Telegram bot stopped")

if __name__ == "__main__":
    asyncio.run(main())
