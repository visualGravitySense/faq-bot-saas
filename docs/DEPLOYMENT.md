# 🚀 Deployment Guide

This guide covers various deployment options for FAQ Bot SaaS, from simple cloud deployments to enterprise-grade solutions.

## 📋 Prerequisites

- **Domain name** (optional but recommended)
- **SSL certificate** (for production)
- **Database** (PostgreSQL recommended for production)
- **Redis** (for caching and sessions)
- **Environment variables** configured

## ☁️ Cloud Deployment Options

### 1. Heroku (Easiest)

#### Backend Deployment

1. **Create Heroku app**
   ```bash
   heroku create your-faq-bot-saas
   ```

2. **Set environment variables**
   ```bash
   heroku config:set SECRET_KEY=your-secret-key
   heroku config:set DATABASE_URL=postgres://...
   heroku config:set TELEGRAM_BOT_TOKEN=your-token
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

#### Frontend Deployment

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify/Vercel**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

### 2. DigitalOcean App Platform

#### Create App Spec

Create `app.yaml`:

```yaml
name: faq-bot-saas
services:
- name: backend
  source_dir: backend
  github:
    repo: yourusername/faq-bot-saas
    branch: main
  run_command: python run.py
  environment_slug: python
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: SECRET_KEY
    value: your-secret-key
  - key: DATABASE_URL
    value: postgres://...
  - key: TELEGRAM_BOT_TOKEN
    value: your-token

- name: frontend
  source_dir: frontend
  github:
    repo: yourusername/faq-bot-saas
    branch: main
  run_command: npm run build && npm run start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: VITE_API_BASE_URL
    value: https://backend.yourapp.ondigitalocean.app
```

### 3. AWS Deployment

#### Using AWS ECS

1. **Create ECS Cluster**
   ```bash
   aws ecs create-cluster --cluster-name faq-bot-saas
   ```

2. **Create Task Definition**
   ```json
   {
     "family": "faq-bot-saas",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "256",
     "memory": "512",
     "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
     "containerDefinitions": [
       {
         "name": "backend",
         "image": "your-account/faq-bot-saas-backend:latest",
         "portMappings": [
           {
             "containerPort": 8000,
             "protocol": "tcp"
           }
         ],
         "environment": [
           {
             "name": "SECRET_KEY",
             "value": "your-secret-key"
           }
         ]
       }
     ]
   }
   ```

3. **Deploy with Docker**
   ```bash
   # Build and push images
   docker build -t your-account/faq-bot-saas-backend ./backend
   docker push your-account/faq-bot-saas-backend:latest
   ```

### 4. Google Cloud Platform

#### Using Cloud Run

1. **Enable APIs**
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   ```

2. **Deploy Backend**
   ```bash
   gcloud run deploy faq-bot-saas-backend \
     --source ./backend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

3. **Deploy Frontend**
   ```bash
   gcloud run deploy faq-bot-saas-frontend \
     --source ./frontend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

## 🐳 Docker Deployment

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgres://postgres:password@db:5432/faq_bot_saas
      - REDIS_URL=redis://redis:6379
      - SECRET_KEY=your-secret-key
      - TELEGRAM_BOT_TOKEN=your-token
    depends_on:
      - db
      - redis

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_BASE_URL=http://localhost:8000
    depends_on:
      - backend

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=faq_bot_saas
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### Run with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔧 Production Configuration

### Environment Variables

Create `.env.production`:

```env
# Production Configuration
ENVIRONMENT=production
DEBUG=false

# Database
DATABASE_URL=postgres://user:password@host:5432/dbname

# Redis
REDIS_URL=redis://host:6379

# Security
SECRET_KEY=your-super-secure-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_HOSTS=["https://yourdomain.com", "https://www.yourdomain.com"]

# Telegram
TELEGRAM_BOT_TOKEN=your-production-bot-token

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

### Database Setup

#### PostgreSQL (Recommended)

1. **Install PostgreSQL**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   
   # macOS
   brew install postgresql
   ```

2. **Create Database**
   ```sql
   CREATE DATABASE faq_bot_saas;
   CREATE USER faq_bot_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE faq_bot_saas TO faq_bot_user;
   ```

3. **Run Migrations**
   ```bash
   cd backend
   alembic upgrade head
   ```

### SSL Certificate

#### Using Let's Encrypt

```bash
# Install Certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Nginx Configuration

Create `/etc/nginx/sites-available/faq-bot-saas`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📊 Monitoring & Logging

### Application Monitoring

#### Using Sentry

1. **Install Sentry**
   ```bash
   pip install sentry-sdk[fastapi]
   ```

2. **Configure Sentry**
   ```python
   import sentry_sdk
   from sentry_sdk.integrations.fastapi import FastApiIntegration

   sentry_sdk.init(
       dsn="your-sentry-dsn",
       integrations=[FastApiIntegration()],
       traces_sample_rate=1.0,
   )
   ```

### Logging

#### Structured Logging

```python
import logging
import json
from datetime import datetime

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'level': record.levelname,
            'message': record.getMessage(),
            'module': record.module,
            'function': record.funcName,
            'line': record.lineno,
        }
        return json.dumps(log_entry)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    handlers=[logging.StreamHandler()],
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

## 🔒 Security Checklist

- [ ] **HTTPS enabled** with valid SSL certificate
- [ ] **Environment variables** secured (no hardcoded secrets)
- [ ] **Database** properly configured with strong passwords
- [ ] **CORS** configured for production domains only
- [ ] **Rate limiting** implemented
- [ ] **Input validation** on all endpoints
- [ ] **SQL injection** protection (using ORM)
- [ ] **XSS protection** enabled
- [ ] **CSRF protection** implemented
- [ ] **Security headers** configured
- [ ] **Regular updates** scheduled
- [ ] **Backup strategy** implemented

## 🚀 Performance Optimization

### Backend Optimization

1. **Database Indexing**
   ```sql
   CREATE INDEX idx_user_email ON users(email);
   CREATE INDEX idx_bot_queries ON queries(bot_id, created_at);
   ```

2. **Caching Strategy**
   ```python
   from functools import lru_cache
   import redis

   redis_client = redis.Redis(host='localhost', port=6379, db=0)

   @lru_cache(maxsize=128)
   def get_bot_config(bot_id: int):
       # Cache bot configuration
       pass
   ```

3. **Connection Pooling**
   ```python
   from sqlalchemy.pool import QueuePool

   engine = create_engine(
       DATABASE_URL,
       poolclass=QueuePool,
       pool_size=20,
       max_overflow=30
   )
   ```

### Frontend Optimization

1. **Code Splitting**
   ```typescript
   const Dashboard = lazy(() => import('./pages/Dashboard'));
   const Analytics = lazy(() => import('./pages/Analytics'));
   ```

2. **Bundle Optimization**
   ```typescript
   // vite.config.ts
   export default defineConfig({
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['react', 'react-dom'],
             mui: ['@mui/material', '@mui/icons-material'],
           }
         }
       }
     }
   });
   ```

## 📈 Scaling Strategies

### Horizontal Scaling

1. **Load Balancer** (Nginx/HAProxy)
2. **Multiple Backend Instances**
3. **Database Read Replicas**
4. **Redis Cluster**
5. **CDN** for static assets

### Vertical Scaling

1. **Increase Server Resources**
2. **Database Optimization**
3. **Caching Layers**
4. **Connection Pooling**

## 🎯 Go-Live Checklist

- [ ] **Domain** configured and pointing to server
- [ ] **SSL certificate** installed and working
- [ ] **Database** migrated and tested
- [ ] **Environment variables** configured
- [ ] **Monitoring** set up
- [ ] **Backup** strategy implemented
- [ ] **Error tracking** configured
- [ ] **Performance testing** completed
- [ ] **Security audit** passed
- [ ] **Documentation** updated

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check database URL
   - Verify database is running
   - Check firewall settings

2. **CORS Errors**
   - Update ALLOWED_HOSTS
   - Check frontend URL configuration

3. **Telegram Bot Not Responding**
   - Verify bot token
   - Check webhook configuration
   - Review bot logs

4. **Performance Issues**
   - Check database queries
   - Monitor memory usage
   - Review caching strategy

### Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/faq-bot-saas/issues)
- **Community**: [GitHub Discussions](https://github.com/yourusername/faq-bot-saas/discussions)

---

**Ready to deploy? Choose your preferred method and get started! 🚀**
