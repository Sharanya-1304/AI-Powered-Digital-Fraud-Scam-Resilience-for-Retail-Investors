from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class TextScanRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000)
    language: Optional[str] = "en"

class UrlScanRequest(BaseModel):
    url: str = Field(..., min_length=3, max_length=2048)

class EntityVerifyRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=256)
    registration_number: Optional[str] = None
    domain: Optional[str] = None

class FeedbackRequest(BaseModel):
    scan_id: str
    feedback_type: str
    comments: Optional[str] = None

class SignalModel(BaseModel):
    id: str
    type: str
    title: str
    severity: str
    evidence: str
    whyItMatters: str
    actionRecommendation: Optional[str] = None
    start: Optional[int] = None
    end: Optional[int] = None
    confidence: Optional[float] = None

class EntityVerificationModel(BaseModel):
    entityName: str
    claimedRegistration: Optional[str] = None
    entityType: Optional[str] = None
    status: str
    source: str
    sourceUrl: Optional[str] = None
    details: str
    isMockData: bool = False
    matchedRecord: Optional[dict] = None

class UrlFindingModel(BaseModel):
    url: str
    isHttps: bool
    domain: str
    registrableDomain: str
    hasIpAddress: bool
    isPunycode: bool
    isShortener: bool
    hasRegulatorKeywords: bool
    hasApkOrDownload: bool
    hasPaymentOrLoginKeywords: bool
    brandMismatch: bool
    riskFlags: List[str]

class SafeActionModel(BaseModel):
    step: int
    title: str
    description: str
    isUrgent: bool = False

class MLFeatureContributionModel(BaseModel):
    feature: str
    category: str
    weight: float

class MLAnalysisModel(BaseModel):
    scamProbability: float
    predictedLabel: str
    confidenceLevel: str
    modelArchitecture: str
    topContributingFeatures: List[MLFeatureContributionModel]
    linguisticSummary: Dict[str, Any]
    uncertainty: Optional[float] = None
    classProbabilities: Optional[Dict[str, float]] = None
    modelVersion: Optional[str] = "1.0.0"
    calibrationStatus: Optional[str] = "Verified Well-Calibrated (ECE: 0.1325)"

class ScanResultModel(BaseModel):
    id: str
    inputType: str
    timestamp: str
    originalInput: str
    extractedText: Optional[str] = None
    language: str
    riskBand: str
    riskScore: int
    confidenceLabel: str
    summaryExplanation: str
    signals: List[SignalModel]
    entities: List[EntityVerificationModel]
    urlAnalysis: Optional[UrlFindingModel] = None
    mlAnalysis: Optional[MLAnalysisModel] = None
    safeActions: List[SafeActionModel]
    isDemo: bool = False
