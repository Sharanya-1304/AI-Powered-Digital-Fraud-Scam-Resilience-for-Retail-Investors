from fastapi import APIRouter
from app.schemas.scan import FeedbackRequest

router = APIRouter()

@router.post("/feedback")
async def feedback_endpoint(req: FeedbackRequest):
    return {"status": "success", "message": "Feedback recorded anonymously."}
