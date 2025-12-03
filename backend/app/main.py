from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routes import projects, auth
from app.db.base import Base
from app.db.session import engine
from app.core.cache import cache
import time

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await init_db()

@app.on_event("shutdown")
async def shutdown_event():
    await cache.close()

# REGISTER ROUTES
app.include_router(auth.router, prefix="/api/auth", tags=["auth"]) # <--- WAS MISSING
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])

# METRICS ENDPOINT
@app.get("/metrics")
async def get_metrics():
    return {
        "status": "up",
        "timestamp": time.time(),
        "service": "castos-backend",
        "db_status": "connected" # simplified
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}