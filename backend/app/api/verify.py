from fastapi import APIRouter
from app.schemas.scan import EntityVerifyRequest, EntityVerificationModel
from app.verification.sebi_registry import verify_entity_record

router = APIRouter()

@router.post("/verify/entity", response_model=EntityVerificationModel)
async def verify_entity_endpoint(req: EntityVerifyRequest):
    return verify_entity_record(name=req.name, reg_no=req.registration_number)
