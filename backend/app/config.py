import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "SANGYAN SHIELD API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "*"
    ]
    MAX_UPLOAD_SIZE_BYTES: int = 8 * 1024 * 1024  # 8 MB
    ALLOWED_IMAGE_MIMES: list[str] = ["image/jpeg", "image/png", "image/webp"]

settings = Settings()
