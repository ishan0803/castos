import json
from typing import Optional, Any
import redis.asyncio as redis
from app.core.config import settings  # <--- Import settings

class CacheService:
    def __init__(self):
        # FIX: Use the variable from settings/env instead of hardcoded string
        self.redis_url = settings.REDIS_URL 
        
        # Add error handling for connection
        try:
            self.redis = redis.from_url(
                self.redis_url, 
                encoding="utf-8", 
                decode_responses=True,
                socket_connect_timeout=5  # Fail fast if connection is bad
            )
        except Exception as e:
            print(f"❌ Redis Connection Error: {e}")

    async def get(self, key: str) -> Optional[Any]:
        try:
            val = await self.redis.get(key)
            return json.loads(val) if val else None
        except Exception as e:
            print(f"⚠️ Cache Get Error: {e}")
            return None

    async def set(self, key: str, value: Any, expire: int = 3600):
        try:
            await self.redis.set(key, json.dumps(value), ex=expire)
        except Exception as e:
            print(f"⚠️ Cache Set Error: {e}")

    async def close(self):
        await self.redis.close()

cache = CacheService()