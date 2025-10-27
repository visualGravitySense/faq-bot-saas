# 🤖 FAQ Bot SaaS - AI-Powered Educational Support Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

> **Transform your educational institution's support with intelligent chatbots!** Create, deploy, and manage AI-powered FAQ bots for multiple channels including Telegram, WhatsApp, and web widgets.

## ✨ Features

### 🧠 **AI-Powered Intelligence**
- Advanced semantic search using Sentence Transformers
- Context-aware responses to student questions
- Multi-language support (Russian, English, Estonian)
- Confidence scoring for response quality

### 📱 **Multi-Channel Deployment**
- **Telegram Bot Integration** - Deploy bots directly to Telegram
- **Web Widget** - Embed in your website
- **WhatsApp Integration** - Coming soon
- **API Access** - Integrate with any platform

### 📊 **Comprehensive Analytics**
- Real-time bot performance metrics
- User interaction tracking
- Query analysis and insights
- Revenue and usage statistics

### 🎯 **SaaS-Ready Features**
- User authentication and authorization
- Subscription management
- Payment integration (Stripe)
- Multi-tenant architecture
- Admin dashboard

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/faq-bot-saas.git
   cd faq-bot-saas
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   cp env_example.txt .env
   # Edit .env with your configuration
   python run.py
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## 🏗️ Architecture

```
faq-bot-saas/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Configuration
│   │   ├── services/       # Business logic
│   │   └── models/         # Data models
│   ├── requirements.txt    # Python dependencies
│   └── run.py             # Application entry point
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── contexts/       # React contexts
│   ├── package.json        # Node dependencies
│   └── vite.config.ts      # Vite configuration
└── docs/                   # Documentation
```

## 💰 Monetization

### Pricing Plans

| Plan | Price | Features |
|------|-------|----------|
| **Starter** | €29/month | 1 bot, 1,000 queries, Basic analytics |
| **Professional** | €99/month | 5 bots, 10,000 queries, Advanced analytics |
| **Business** | €299/month | Unlimited bots, 50,000 queries, Full features |

### Revenue Streams

1. **Subscription Revenue** - Monthly/yearly plans
2. **Usage-Based Pricing** - Pay per query
3. **Enterprise Licenses** - Custom solutions
4. **White-Label Solutions** - Reseller opportunities

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# API Configuration
API_V1_STR=/api/v1
PROJECT_NAME=FAQ Bot SaaS

# Database
DATABASE_URL=sqlite:///./faq_bot_saas.db

# JWT Authentication
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Telegram Bot
TELEGRAM_BOT_TOKEN=your-telegram-bot-token

# Stripe Payments
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# OpenAI (Optional)
OPENAI_API_KEY=your-openai-api-key
```

### Telegram Bot Setup

1. Create a bot with [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Add it to your `.env` file
4. Start the Telegram service

## 📚 Documentation

- [API Documentation](http://localhost:8000/docs) - Interactive API docs
- [Telegram Integration Guide](TELEGRAM_INTEGRATION.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Contributing Guidelines](CONTRIBUTING.md)

## 🛠️ Development

### Running in Development

```bash
# Backend (Terminal 1)
cd backend
python run.py

# Frontend (Terminal 2)
cd frontend
npm run dev

# Telegram Bot (Terminal 3)
cd backend
python run_telegram_bot.py
```

### Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Cloud Deployment

- **Heroku** - One-click deployment
- **AWS** - EC2, ECS, or Lambda
- **DigitalOcean** - Droplet or App Platform
- **Google Cloud** - Cloud Run or GKE

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

### Q1 2024
- [ ] WhatsApp integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language UI

### Q2 2024
- [ ] Voice message support
- [ ] Advanced AI training
- [ ] Enterprise features
- [ ] API rate limiting

### Q3 2024
- [ ] White-label solutions
- [ ] Advanced integrations
- [ ] Machine learning insights
- [ ] Global deployment

## 💡 Business Opportunities

### For Entrepreneurs
- **SaaS Business** - Start your own FAQ bot service
- **White-Label** - Resell to educational institutions
- **Consulting** - Help organizations implement AI chatbots

### For Developers
- **Open Source** - Contribute to the project
- **Extensions** - Build custom integrations
- **Plugins** - Create additional features

### For Educational Institutions
- **Student Support** - Improve student experience
- **Cost Reduction** - Reduce support staff workload
- **24/7 Availability** - Always-on support

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/faq-bot-saas/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/faq-bot-saas/discussions)
- **Email**: support@faqbotsaas.com

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/faq-bot-saas&type=Date)](https://star-history.com/#yourusername/faq-bot-saas&Date)

---

**Made with ❤️ for the educational community**

*Transform education with AI-powered support. Start your FAQ Bot SaaS journey today!*