from fastapi import APIRouter

router = APIRouter()

@router.get("/education")
async def get_education_endpoint():
    return {
        "status": "success",
        "categories": [
            "guaranteed-returns",
            "fake-trading-apps",
            "otp-credential-theft",
            "regulatory-impersonation",
            "withdrawal-fee-traps",
            "pressure-tactics",
            "social-media-scams",
            "deepfake-investment"
        ]
    }
