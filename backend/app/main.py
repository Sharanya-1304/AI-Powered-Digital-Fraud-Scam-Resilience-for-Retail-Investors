import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.config import settings
from app.api.scan import router as scan_router
from app.api.verify import router as verify_router
from app.api.feedback import router as feedback_router
from app.api.education import router as education_router
from app.api.ml import router as ml_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="SANGYAN Hackathon 2026 Track A - Digital Fraud & Scam Resilience Assistant"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health endpoint (Section 45)
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Sangyan Shield API",
        "version": settings.VERSION,
        "ml_engine": "CalibratedLogisticRegression + TF-IDF Domain Hybrid"
    }

# Register API Routers
app.include_router(scan_router, prefix="/api", tags=["Scam Scanning"])
app.include_router(verify_router, prefix="/api", tags=["Entity Verification"])
app.include_router(ml_router, prefix="/api", tags=["Machine Learning Engine"])
app.include_router(feedback_router, prefix="/api", tags=["Feedback"])
app.include_router(education_router, prefix="/api", tags=["Education"])

# Mount static frontend build in production mode if dist exists
FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
ASSETS_DIR = os.path.join(FRONTEND_DIST, "assets")

if os.path.exists(ASSETS_DIR):
    app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")

if os.path.exists(FRONTEND_DIST):
    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        # Do not intercept API routes, OpenAPI spec, or Swagger docs
        if full_path.startswith("api/") or full_path in ("docs", "openapi.json", "redoc"):
            raise HTTPException(status_code=404, detail="Not Found")
        target_file = os.path.join(FRONTEND_DIST, full_path)
        if os.path.isfile(target_file):
            return FileResponse(target_file)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
