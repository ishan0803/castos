import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "CastOS API"
    API_V1_STR: str = "/api"
    
    # Database
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_SERVER: str = "db"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "castos"
    
    # Default to empty string so we can detect if env var is missing
    DATABASE_URL: str = ""

    # Security
    CLERK_PEM_PUBLIC_KEY: str = ""
    CLERK_ISSUER: str = ""
    
    # AI
    GOOGLE_API_KEY: str = ""

    # Redis
    REDIS_URL: str = "redis://redis:6379/0"

    def model_post_init(self, __context):
        # 1. If DATABASE_URL is provided (by Render), fix the scheme for AsyncPG
        if self.DATABASE_URL:
            if self.DATABASE_URL.startswith("postgres://"):
                self.DATABASE_URL = self.DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
            elif self.DATABASE_URL.startswith("postgresql://"):
                self.DATABASE_URL = self.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
        
        # 2. If no DATABASE_URL, build it from local vars (for Docker/Local)
        else:
            self.DATABASE_URL = f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    class Config:
        env_file = ".env"
        extra = "ignore" # Ignore extra env vars from Render

settings = Settings()