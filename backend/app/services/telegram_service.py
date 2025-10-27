import asyncio
import logging
from typing import Dict, Any, Optional
from telegram import Update, Bot, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, CallbackQueryHandler, filters, ContextTypes
from telegram.error import TelegramError
import json
from datetime import datetime

from app.services.ai_service import ai_service
from app.core.config import settings

logger = logging.getLogger(__name__)

class TelegramBotService:
    def __init__(self):
        self.bot = None
        self.application = None
        self.active_bots = {}  # bot_id -> bot_config
        self.user_sessions = {}  # user_id -> current_bot_id
        
    async def initialize(self):
        """Initialize the Telegram bot service"""
        if not settings.TELEGRAM_BOT_TOKEN:
            logger.warning("TELEGRAM_BOT_TOKEN not set, Telegram bot disabled")
            return False
            
        try:
            self.bot = Bot(token=settings.TELEGRAM_BOT_TOKEN)
            self.application = Application.builder().token(settings.TELEGRAM_BOT_TOKEN).build()
            
            # Add handlers
            self.application.add_handler(CommandHandler("start", self.start_command))
            self.application.add_handler(CommandHandler("help", self.help_command))
            self.application.add_handler(CommandHandler("list", self.list_bots_command))
            self.application.add_handler(CommandHandler("select", self.select_bot_command))
            self.application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, self.handle_message))
            self.application.add_handler(CallbackQueryHandler(self.handle_callback))
            
            logger.info("Telegram bot service initialized successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize Telegram bot: {e}")
            return False
    
    async def start_bot(self):
        """Start the Telegram bot"""
        if not self.application:
            logger.error("Telegram bot not initialized")
            return
            
        try:
            await self.application.initialize()
            await self.application.start()
            await self.application.updater.start_polling()
            logger.info("Telegram bot started successfully")
        except Exception as e:
            logger.error(f"Failed to start Telegram bot: {e}")
    
    async def stop_bot(self):
        """Stop the Telegram bot"""
        if self.application:
            await self.application.updater.stop()
            await self.application.stop()
            await self.application.shutdown()
            logger.info("Telegram bot stopped")
    
    async def register_faq_bot(self, bot_id: int, bot_name: str, bot_token: str = None):
        """Register a new FAQ bot for Telegram integration"""
        self.active_bots[bot_id] = {
            'name': bot_name,
            'token': bot_token,
            'created_at': datetime.now(),
            'total_queries': 0
        }
        logger.info(f"Registered FAQ bot: {bot_name} (ID: {bot_id})")
    
    async def unregister_faq_bot(self, bot_id: int):
        """Unregister a FAQ bot"""
        if bot_id in self.active_bots:
            del self.active_bots[bot_id]
            logger.info(f"Unregistered FAQ bot ID: {bot_id}")
    
    async def start_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /start command"""
        user_id = update.effective_user.id
        username = update.effective_user.username or "User"
        
        welcome_text = f"""
🤖 Welcome to FAQ Bot SaaS, {username}!

I'm an AI-powered FAQ bot that can help answer questions about various topics.

Available commands:
/help - Show this help message
/list - List available FAQ bots
/select <bot_id> - Select a specific FAQ bot
/status - Show current status

Just send me a question and I'll do my best to help you!
        """
        
        await update.message.reply_text(welcome_text)
    
    async def help_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /help command"""
        help_text = """
📚 FAQ Bot Help

Commands:
/start - Start the bot
/help - Show this help message
/list - List available FAQ bots
/select <bot_id> - Select a specific FAQ bot
/status - Show current status

How to use:
1. Use /list to see available FAQ bots
2. Use /select <bot_id> to choose a bot
3. Ask any question and get AI-powered answers!

The bot uses advanced AI to understand your questions and provide relevant answers based on the knowledge base.
        """
        
        await update.message.reply_text(help_text)
    
    async def list_bots_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /list command"""
        if not self.active_bots:
            await update.message.reply_text("No FAQ bots are currently available.")
            return
        
        text = "🤖 Available FAQ Bots:\n\n"
        keyboard = []
        
        for bot_id, bot_config in self.active_bots.items():
            text += f"ID: {bot_id}\n"
            text += f"Name: {bot_config['name']}\n"
            text += f"Queries: {bot_config['total_queries']}\n\n"
            
            keyboard.append([InlineKeyboardButton(
                f"Select {bot_config['name']}", 
                callback_data=f"select_{bot_id}"
            )])
        
        reply_markup = InlineKeyboardMarkup(keyboard)
        await update.message.reply_text(text, reply_markup=reply_markup)
    
    async def select_bot_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /select command"""
        if not context.args:
            await update.message.reply_text("Please provide a bot ID. Use /list to see available bots.")
            return
        
        try:
            bot_id = int(context.args[0])
            if bot_id not in self.active_bots:
                await update.message.reply_text(f"Bot with ID {bot_id} not found. Use /list to see available bots.")
                return
            
            user_id = update.effective_user.id
            self.user_sessions[user_id] = bot_id
            
            bot_name = self.active_bots[bot_id]['name']
            await update.message.reply_text(f"✅ Selected FAQ bot: {bot_name}\n\nYou can now ask questions!")
            
        except ValueError:
            await update.message.reply_text("Invalid bot ID. Please provide a number.")
    
    async def handle_callback(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle callback queries from inline keyboards"""
        query = update.callback_query
        await query.answer()
        
        if query.data.startswith("select_"):
            bot_id = int(query.data.split("_")[1])
            if bot_id in self.active_bots:
                user_id = query.from_user.id
                self.user_sessions[user_id] = bot_id
                bot_name = self.active_bots[bot_id]['name']
                await query.edit_message_text(f"✅ Selected FAQ bot: {bot_name}\n\nYou can now ask questions!")
            else:
                await query.edit_message_text("Bot not found. Please try again.")
    
    async def handle_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle regular text messages"""
        user_id = update.effective_user.id
        message_text = update.message.text
        
        # Check if user has selected a bot
        if user_id not in self.user_sessions:
            await update.message.reply_text(
                "Please select a FAQ bot first using /list and /select commands."
            )
            return
        
        bot_id = self.user_sessions[user_id]
        
        # Show typing indicator
        await context.bot.send_chat_action(chat_id=update.effective_chat.id, action="typing")
        
        try:
            # Initialize AI service if needed
            if ai_service.model is None:
                await ai_service.initialize_model()
            
            # Query the AI service
            result = await ai_service.query_bot(bot_id, message_text)
            
            if result['success']:
                # Format response
                response_text = f"🤖 **Answer:**\n\n{result['answer']}\n\n"
                response_text += f"📊 Confidence: {result['confidence']:.1%}\n"
                
                if result.get('source_url'):
                    response_text += f"🔗 Source: {result['source_url']}"
                
                # Update bot statistics
                if bot_id in self.active_bots:
                    self.active_bots[bot_id]['total_queries'] += 1
                
                await update.message.reply_text(response_text, parse_mode='Markdown')
                
            else:
                await update.message.reply_text(
                    "I apologize, but I couldn't process your question. Please try again or contact support."
                )
                
        except Exception as e:
            logger.error(f"Error processing message: {e}")
            await update.message.reply_text(
                "I'm experiencing technical difficulties. Please try again later."
            )
    
    async def get_bot_stats(self) -> Dict[str, Any]:
        """Get statistics for all active bots"""
        total_queries = sum(bot['total_queries'] for bot in self.active_bots.values())
        active_users = len(self.user_sessions)
        
        return {
            'active_bots': len(self.active_bots),
            'total_queries': total_queries,
            'active_users': active_users,
            'bots': list(self.active_bots.keys())
        }

# Global Telegram bot service instance
telegram_service = TelegramBotService()
