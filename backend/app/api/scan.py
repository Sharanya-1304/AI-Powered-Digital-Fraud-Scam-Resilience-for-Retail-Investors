from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.scan import TextScanRequest, UrlScanRequest, ScanResultModel
from app.risk_engine.scorer import evaluate_scan

router = APIRouter()

# In-memory session store for ephemeral lookup
SESSION_CACHE = {}

@router.post("/scan/text", response_model=ScanResultModel)
async def scan_text_endpoint(req: TextScanRequest):
    result = evaluate_scan(text=req.text, input_type="text", language=req.language or "en")
    SESSION_CACHE[result.id] = result
    return result

@router.post("/scan/image", response_model=ScanResultModel)
async def scan_image_endpoint(file: UploadFile = File(...)):
    # Validate mime
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Invalid image MIME type. Supported: JPEG, PNG, WEBP.")

    # Read image contents
    contents = await file.read()
    if len(contents) > 8 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds maximum 8MB limit.")

    # Simulated OCR extraction text for demo
    ocr_extracted_text = (
        f"[OCR Text extracted from {file.filename}]\n"
        "Special Institutional Trading Allocation! Guaranteed 30% monthly return with zero risk. "
        "Sideload our VIP trading APK from telegram group. Send the OTP received on your mobile device to complete authentication."
    )

    result = evaluate_scan(text=ocr_extracted_text, input_type="image", language="en")
    SESSION_CACHE[result.id] = result
    return result

@router.post("/scan/url", response_model=ScanResultModel)
async def scan_url_endpoint(req: UrlScanRequest):
    synthesized_text = f"URL check for {req.url}"
    result = evaluate_scan(text=synthesized_text, input_type="url", language="en", url=req.url)
    SESSION_CACHE[result.id] = result
    return result

@router.get("/scan/{scan_id}", response_model=ScanResultModel)
async def get_scan_endpoint(scan_id: str):
    if scan_id in SESSION_CACHE:
        return SESSION_CACHE[scan_id]
    raise HTTPException(status_code=404, detail="Scan session not found or expired (ephemeral retention).")
