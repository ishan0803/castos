import json
from typing import Optional, Any
import redis.asyncio as redis
from app.core.config import settings

class CacheService:
    def __init__(self):
        self.redis_url = "redis://redis:6379/0" # In prod, move to settings
        self.redis = redis.from_url(self.redis_url, encoding="utf-8", decode_responses=True)

    async def get(self, key: str) -> Optional[Any]:
        val = await self.redis.get(key)
        return json.loads(val) if val else None

    async def set(self, key: str, value: Any, expire: int = 3600):
        """Cache for 1 hour by default"""
        await self.redis.set(key, json.dumps(value), ex=expire)

    async def close(self):
        await self.redis.close()

cache = CacheService()