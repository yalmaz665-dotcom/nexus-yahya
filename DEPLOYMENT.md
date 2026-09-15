# Nexus Yahya - Deployment Rehberi

**Şirket:** Yahya Almaz Teknoloji  
**Platform:** Render.com  
**Versiyon:** 0.1.0

---

## 📋 İçindekiler

1. [Yerel Kurulum](#yerel-kurulum)
2. [Docker Kurulumu](#docker-kurulumu)
3. [Render Deployment](#render-deployment)
4. [Environment Variables](#environment-variables)
5. [Troubleshooting](#troubleshooting)

---

## 🖥️ Yerel Kurulum

### Gereksinimler
- Python 3.10+
- pip/poetry
- Git

### Adımlar

```bash
# 1. Repository'yi klonla
git clone https://github.com/yalmaz665-dotcom/nexus-yahya.git
cd nexus-yahya

# 2. Virtual environment oluştur
python -m venv venv

# 3. Virtual environment'ı aktifleştir
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# 4. Bağımlılıkları yükle
pip install -r requirements.txt

# 5. Environment variables dosyası oluştur
cp .env.example .env
# .env dosyasını düzenle

# 6. Uygulamayı çalıştır
python app.py
# veya
uvicorn app:app --reload
```

### API Testi

```bash
# Health check
curl http://localhost:8000/health

# API Docs
http://localhost:8000/api/docs

# Features listesi
curl http://localhost:8000/api/features
```

---

## 🐳 Docker Kurulumu

### Gereksinimler
- Docker
- Docker Compose

### Build & Run

```bash
# 1. Docker image'ı build et
docker build -t nexus-yahya:0.1.0 .

# 2. Container'ı çalıştır
docker run -p 8000:8000 \
  -e ENVIRONMENT=development \
  -e OPENAI_API_KEY=your_key \
  nexus-yahya:0.1.0
```

### Docker Compose ile Tam Stack

```bash
# 1. .env dosyasını oluştur
cp .env.example .env
# Gerekli API keys'leri ekle

# 2. Services'leri başlat
docker-compose up -d

# 3. Logs'ları görüntüle
docker-compose logs -f web

# 4. Database'e migration çalıştır (gerekirse)
docker-compose exec web alembic upgrade head

# 5. Services'leri durdur
docker-compose down
```

### Servislerin Durumu

```bash
# Tüm services
docker-compose ps

# PostgreSQL bağlantısı
docker-compose exec db psql -U postgres -d nexus_yahya

# Redis bağlantısı
docker-compose exec redis redis-cli
```

---

## 🚀 Render Deployment

### Render.com'da Kurulum

#### 1. Web Service Oluştur

```
render.com → Dashboard → New+ → Web Service
```

#### 2. Git Repository Bağla

- GitHub hesabınızı bağla
- Repository: `yalmaz665-dotcom/nexus-yahya`
- Branch: `main`

#### 3. Build & Start Komutları

| Ayar | Değer |
|------|-------|
| Build Command | `pip install -r requirements.txt` |
| Start Command | `gunicorn app:app --bind 0.0.0.0:$PORT --workers 4 --worker-class uvicorn.workers.UvicornWorker --timeout 120` |
| Environment | Python |
| Region | Frankfurt (EU) / Singapore (ASIA) |

#### 4. Environment Variables

Render Dashboard → Environment:

```bash
ENVIRONMENT=production
PORT=8000
DATABASE_URL=your_postgresql_url
OPENAI_API_KEY=your_openai_key
GITHUB_TOKEN=your_github_token
SECRET_KEY=your_secret_key
JWT_SECRET=your_jwt_secret
```

#### 5. Deploy Settings

- Auto-deploy: Enabled (main branch)
- Health Check Path: `/health`
- Max Age: 604800s (7 days)

#### 6. Deploy Başlat

```
Deploy butonuna tıkla
```

---

## 🔐 Environment Variables

### Gerekli Variables

```bash
# Server
ENVIRONMENT=production          # production/development
PORT=8000                       # Render otomatik set eder

# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# API Keys
OPENAI_API_KEY=sk-...          # OpenAI API key
GITHUB_TOKEN=ghp_...           # GitHub Personal Access Token

# Security
SECRET_KEY=your-secret-key-min-32-chars
JWT_SECRET=your-jwt-secret-key

# Logging
LOG_LEVEL=INFO                 # DEBUG/INFO/WARNING/ERROR

# Monitoring
SENTRY_DSN=https://...         # Sentry error tracking (optional)
```

### Render PostgreSQL Oluştur

```
Render Dashboard → New+ → PostgreSQL
→ Database Name: nexus_yahya
→ User: postgres
→ Şifresi otomatik oluştur
→ DATABASE_URL copy et
```

---

## ✅ Deployment Kontrolü

### Sağlık Kontrolleri

```bash
# Health Check
curl https://your-app.onrender.com/health

# Response Beklenen:
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00",
  "version": "0.1.0",
  "environment": "production"
}
```

### API Endpoints Test

```bash
# Features
curl https://your-app.onrender.com/api/features

# Stats
curl https://your-app.onrender.com/api/stats/summary

# Docs
https://your-app.onrender.com/api/docs
```

### Logs Kontrol

```
Render Dashboard → Service → Logs
```

---

## 🐛 Troubleshooting

### Build Hatası

**Problem:** `ModuleNotFoundError`

```bash
# Çözüm: requirements.txt güncelle
pip install -r requirements.txt
pip freeze > requirements.txt
```

### Deploy Hatası

**Problem:** `gunicorn not found`

```bash
# Çözüm: requirements.txt'de gunicorn var mı kontrol et
grep gunicorn requirements.txt
```

### PostgreSQL Bağlantı Hatası

**Problem:** `psycopg2.OperationalError`

```bash
# Çözüm: DATABASE_URL kontrol et
# Format: postgresql://user:password@host:port/dbname
```

### Memory/CPU Hatası

**Problem:** `Out of memory` veya slow response

```bash
# Çözüm: Render plan yükselt
# Dashboard → Settings → Plan
```

---

## 📊 Performance Monitoring

### Render Metrikleri

```
Dashboard → Service → Metrics
- CPU Usage
- Memory Usage
- Network I/O
```

### Custom Monitoring (Sentry)

```bash
# 1. Sentry hesap oluştur
https://sentry.io

# 2. Python project oluştur

# 3. SENTRY_DSN'i Environment'a ekle
SENTRY_DSN=https://key@sentry.io/project_id
```

---

## 🔄 Updates & Rollback

### Otomatik Deploy

```
main branch'e push → Render otomatik deploy eder
```

### Manual Deploy

```
Render Dashboard → Manual Deploy
```

### Rollback

```
Render Dashboard → Deploy History → Previous Deploy → Rollback
```

---

## 📈 Scale Up

```
Render Dashboard → Settings → Instance Type
- Starter (0.5GB) → Standard (4GB)
- Auto-scaling enable
```

---

## 📞 Support & Referanslar

- **Render Docs:** https://render.com/docs
- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **Gunicorn Docs:** https://gunicorn.org/
- **GitHub Issues:** https://github.com/yalmaz665-dotcom/nexus-yahya/issues

---

**Son Güncelleme:** 2024-09-15  
**Hazırladı:** Yahya Almaz
