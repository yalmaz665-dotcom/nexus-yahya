"""
Nexus Yahya - Runtime Configuration
Render.com Deployment
"""

import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""
    
    # Server Configuration
    environment: str = os.getenv("ENVIRONMENT", "production")
    port: int = int(os.getenv("PORT", 8000))
    host: str = "0.0.0.0"
    debug: bool = environment == "development"
    
    # API Configuration
    api_title: str = "Nexus Yahya API"
    api_version: str = "0.1.0"
    api_description: str = "AI-Powered Code Generation Platform API"
    
    # Database Configuration
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")
    
    # Security
    secret_key: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    jwt_secret: str = os.getenv("JWT_SECRET", "dev-jwt-secret-change-in-production")
    jwt_algorithm: str = "HS256"
    
    # CORS Configuration
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "https://nexus-yahya.vercel.app",
    ]
    
    # API Keys
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    github_token: str = os.getenv("GITHUB_TOKEN", "")
    
    # Logging
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    
    # Monitoring
    sentry_dsn: str = os.getenv("SENTRY_DSN", "")
    
    # Features
    features_count: int = 25
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()
