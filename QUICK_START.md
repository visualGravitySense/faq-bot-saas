# 🚀 Quick Start Guide

Get your FAQ Bot SaaS up and running in 5 minutes!

## ⚡ Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **Git**

## 🏃‍♂️ Quick Setup

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/faq-bot-saas.git
cd faq-bot-saas

# Run setup script
chmod +x setup-git.sh
./setup-git.sh
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp env_example.txt .env

# Edit .env file with your settings
# At minimum, set:
# SECRET_KEY=your-secret-key-here
# TELEGRAM_BOT_TOKEN=your-bot-token (optional)

# Run the backend
python run.py
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access Your Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🎯 First Steps

### 1. Create Your Account

1. Go to http://localhost:5173
2. Click "Sign Up"
3. Fill in your details
4. Verify your email (if configured)

### 2. Create Your First Bot

1. Click "Create New Bot"
2. Fill in bot details:
   - **Name**: "My First FAQ Bot"
   - **Website**: "https://example.com"
   - **Description**: "AI-powered support bot"
   - **Channels**: Select "Web Widget"
   - **Language**: Choose your language

3. Click "Create Bot"

### 3. Test Your Bot

1. Click "Test" on your bot card
2. Ask a question like "What are your office hours?"
3. See the AI response!

### 4. Set Up Telegram Bot (Optional)

1. Create a bot with [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Add it to your `.env` file
4. Go to Dashboard → Telegram Integration
5. Click "Start Service"
6. Test your bot on Telegram!

## 🔧 Configuration

### Essential Environment Variables

```env
# Backend (.env file)
SECRET_KEY=your-super-secret-key-here
DATABASE_URL=sqlite:///./faq_bot_saas.db
TELEGRAM_BOT_TOKEN=your-telegram-bot-token

# Frontend (vite.config.ts)
VITE_API_BASE_URL=http://localhost:8000
```

### Optional Configuration

```env
# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# OpenAI (for enhanced AI)
OPENAI_API_KEY=sk-...

# Redis (for production)
REDIS_URL=redis://localhost:6379
```

## 🚀 Deployment

### Option 1: Heroku (Easiest)

1. **Install Heroku CLI**
2. **Create Heroku app**
   ```bash
   heroku create your-faq-bot-saas
   ```
3. **Set environment variables**
   ```bash
   heroku config:set SECRET_KEY=your-secret-key
   heroku config:set TELEGRAM_BOT_TOKEN=your-token
   ```
4. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 2: Docker

```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Option 3: VPS/Cloud

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

## 💰 Monetization

### Set Up Payments

1. **Create Stripe account**
2. **Get API keys**
3. **Add to environment**
4. **Configure pricing plans**

### Pricing Strategy

- **Starter**: €29/month (1 bot, 1K queries)
- **Professional**: €99/month (5 bots, 10K queries)
- **Business**: €299/month (Unlimited bots, 50K queries)

See [MONETIZATION.md](docs/MONETIZATION.md) for detailed strategies.

## 🎯 Next Steps

### 1. Customize Your Branding

- Update colors and logos
- Customize email templates
- Add your domain

### 2. Add Content to Your Bot

- Import FAQ data
- Train with your content
- Test responses

### 3. Set Up Analytics

- Monitor bot performance
- Track user interactions
- Optimize responses

### 4. Scale Your Business

- Add more bots
- Implement pricing
- Market your service

## 🆘 Troubleshooting

### Common Issues

**Backend won't start:**
```bash
# Check Python version
python --version

# Install dependencies
pip install -r requirements.txt

# Check environment variables
cat .env
```

**Frontend won't start:**
```bash
# Check Node version
node --version

# Install dependencies
npm install

# Clear cache
npm run build
```

**Database errors:**
```bash
# Reset database
rm faq_bot_saas.db
python run.py
```

**Telegram bot not responding:**
- Check bot token in `.env`
- Verify bot is running
- Check webhook configuration

### Getting Help

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/faq-bot-saas/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/faq-bot-saas/discussions)

## 🎉 Success!

You now have a fully functional FAQ Bot SaaS platform! 

**What you can do:**
- ✅ Create and manage AI-powered bots
- ✅ Deploy to multiple channels
- ✅ Track analytics and performance
- ✅ Accept payments and subscriptions
- ✅ Scale your business

**Ready to make money?** Check out the [monetization guide](docs/MONETIZATION.md)!

---

**Need help?** Join our community or open an issue on GitHub! 🚀
