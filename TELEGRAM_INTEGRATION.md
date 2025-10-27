# Telegram Bot Integration

This document explains how to set up and use the Telegram bot integration for FAQ Bot SaaS.

## Prerequisites

1. **Telegram Bot Token**: You need to create a bot on Telegram and get a bot token.
2. **Python Dependencies**: Install required packages.
3. **Environment Configuration**: Set up your environment variables.

## Setup Instructions

### 1. Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Start a conversation with BotFather
3. Send `/newbot` command
4. Follow the instructions to create your bot
5. Copy the bot token you receive

### 2. Configure Environment

1. Copy `env_example.txt` to `.env` in the backend directory:
   ```bash
   cp env_example.txt .env
   ```

2. Edit `.env` file and add your bot token:
   ```
   TELEGRAM_BOT_TOKEN=your-bot-token-here
   ```

### 3. Install Dependencies

```bash
cd faq-bot-saas/backend
pip install python-telegram-bot
```

### 4. Run the Telegram Bot

#### Option A: Run as standalone service
```bash
python run_telegram_bot.py
```

#### Option B: Run with the main API server
```bash
python run.py
```

## Features

### Bot Commands

- `/start` - Welcome message and instructions
- `/help` - Show help information
- `/list` - List available FAQ bots
- `/select <bot_id>` - Select a specific FAQ bot
- `/status` - Show current status

### Bot Management

The Telegram integration includes a web interface for managing bots:

1. **Register Bots**: Add new FAQ bots to the Telegram service
2. **Monitor Statistics**: View bot performance and usage statistics
3. **Start/Stop Service**: Control the Telegram bot service
4. **Bot Configuration**: Configure bot settings and webhooks

### AI-Powered Responses

The Telegram bot uses the same AI service as the web platform:

- **Semantic Search**: Advanced question understanding
- **Multi-language Support**: Russian, English, Estonian
- **Context Awareness**: Maintains conversation context
- **Confidence Scoring**: Shows response confidence levels

## Usage Examples

### For Users

1. **Start a conversation**: Send `/start` to begin
2. **Select a bot**: Use `/list` to see available bots, then `/select <id>`
3. **Ask questions**: Simply type your question and get AI-powered answers

### For Administrators

1. **Access Dashboard**: Log into the web dashboard
2. **Open Telegram Integration**: Click "Telegram Integration" button
3. **Manage Bots**: Add, remove, or configure bots
4. **Monitor Performance**: View statistics and usage data

## API Endpoints

The Telegram integration provides several API endpoints:

- `POST /api/v1/telegram/register` - Register a new bot
- `DELETE /api/v1/telegram/{bot_id}` - Unregister a bot
- `GET /api/v1/telegram/bots` - List all bots
- `GET /api/v1/telegram/stats` - Get statistics
- `GET /api/v1/telegram/status` - Get service status
- `POST /api/v1/telegram/start` - Start the service
- `POST /api/v1/telegram/stop` - Stop the service

## Troubleshooting

### Common Issues

1. **Bot not responding**: Check if the service is running and the token is correct
2. **Authentication errors**: Ensure the bot token is valid and not expired
3. **Webhook issues**: If using webhooks, ensure the URL is accessible

### Logs

Check the console output for detailed logs:
- Service startup/shutdown messages
- Bot registration events
- Error messages and stack traces

### Testing

1. **Test bot commands**: Send `/start` to your bot
2. **Test AI responses**: Ask a question after selecting a bot
3. **Check web interface**: Verify bot management works in the dashboard

## Security Considerations

1. **Bot Token**: Keep your bot token secure and never share it
2. **Webhook Security**: If using webhooks, implement proper authentication
3. **Rate Limiting**: The bot respects Telegram's rate limits
4. **User Data**: User sessions are stored temporarily and cleared on restart

## Advanced Configuration

### Webhook Setup (Optional)

For production deployments, you can use webhooks instead of polling:

1. Set `TELEGRAM_WEBHOOK_URL` in your environment
2. Configure your webhook endpoint
3. The bot will automatically use webhooks if configured

### Custom Bot Responses

You can customize bot responses by modifying the `telegram_service.py` file:

- Welcome messages
- Help text
- Error messages
- Response formatting

## Support

For issues or questions:

1. Check the logs for error messages
2. Verify your configuration
3. Test with the web interface
4. Contact support if needed

## Next Steps

- Set up multiple bots for different purposes
- Configure webhooks for production
- Implement custom response templates
- Add more advanced features like inline keyboards
