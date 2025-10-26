# 🤖 FAQ Bot SaaS Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.68+-009688.svg)](https://fastapi.tiangolo.com/)

> AI-powered FAQ Bot SaaS Platform for Educational Institutions

## 🚀 Features

- **AI-Powered**: Semantic search using Sentence Transformers
- **Multi-tenant**: Support for multiple educational institutions
- **Multi-language**: Russian, English, Estonian support
- **Auto-scraping**: Automatic content extraction from websites
- **Multiple Channels**: Telegram, WhatsApp, Web widgets
- **Analytics**: Comprehensive usage analytics and insights

## 🏗️ Architecture

- **Backend**: Python + FastAPI + PostgreSQL
- **Frontend**: React + TypeScript + Material-UI
- **AI Engine**: Sentence Transformers + FAISS
- **Infrastructure**: Docker + Kubernetes
- **Payments**: Stripe integration

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 16+
- PostgreSQL 13+
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/visualGravitySense/faq-bot-saas.git
   cd faq-bot-saas
   ```

2. **Setup Backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```

4. **Setup Database**
   ```bash
   # Create PostgreSQL database
   createdb faq_bot_saas
   
   # Run migrations
   python scripts/migrate.py
   ```

5. **Start Development Servers**
   ```bash
   # Backend (Terminal 1)
   cd backend
   uvicorn app.main:app --reload --port 8000
   
   # Frontend (Terminal 2)
   cd frontend
   npm start
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## 📊 Pricing Plans

| Plan | Price | Websites | Queries/Month | Bots | Features |
|------|-------|----------|---------------|------|----------|
| Starter | €29/mo | 1 | 1,000 | 1 | Basic features |
| Professional | €99/mo | 5 | 10,000 | 3 | Advanced analytics |
| Business | €299/mo | 15 | 50,000 | Unlimited | White-label |
| Enterprise | €999/mo | Unlimited | Unlimited | Unlimited | Custom solutions |

## 🛠️ Development

### Backend Development

```bash
cd backend
python -m pytest tests/          # Run tests
python -m black app/             # Format code
python -m flake8 app/            # Lint code
```

### Frontend Development

```bash
cd frontend
npm test                         # Run tests
npm run build                    # Build for production
npm run lint                     # Lint code
```

## 📚 Documentation

- [API Documentation](docs/api/)
- [Deployment Guide](docs/deployment/)
- [User Guide](docs/user-guide/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Dmitri Gornakov**
- GitHub: [@visualGravitySense](https://github.com/visualGravitySense)
- LinkedIn: [in/dmitri-gornakov](https://linkedin.com/in/dmitri-gornakov)
- Email: dmitri@designlytics.com

## 🙏 Acknowledgments

- [LangChain](https://github.com/langchain-ai/langchain) for AI framework
- [FastAPI](https://fastapi.tiangolo.com/) for backend framework
- [React](https://reactjs.org/) for frontend framework
- [Material-UI](https://mui.com/) for UI components

---

⭐ **If you find this project valuable, consider starring it and sharing with others!**
