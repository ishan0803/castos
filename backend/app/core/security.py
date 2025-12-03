import jwt
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings
import httpx
from jwt.algorithms import RSAAlgorithm
import json

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Validates Clerk JWT against Clerk's JWKS.
    """
    token = credentials.credentials
    
    try:
        # In production, cache the JWKS keys
        jwks_url = f"{settings.CLERK_ISSUER}/.well-known/jwks.json"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(jwks_url)
            jwks = response.json()

        public_key = RSAAlgorithm.from_jwk(json.dumps(jwks['keys'][0]))
        
        payload = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            options={"verify_aud": False}, # Clerk audience varies
            issuer=settings.CLERK_ISSUER
        )
        
        return {
            "id": payload.get("sub"),
            "email": payload.get("email", "")
        }
        
    except Exception as e:
        print(f"Auth Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )