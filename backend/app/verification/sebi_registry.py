from typing import Optional, List
from app.schemas.scan import EntityVerificationModel

OFFICIAL_INTERMEDIARY_DB = {
    "zerodha": {
        "legalName": "Zerodha Broking Limited",
        "sebiRegNo": "INZ000031633",
        "entityType": "Broker",
        "validity": "Permanent / Active",
        "officialDomain": "zerodha.com"
    },
    "groww": {
        "legalName": "Nextbillion Technology Private Limited",
        "sebiRegNo": "INZ000301838",
        "entityType": "Broker",
        "validity": "Active",
        "officialDomain": "groww.in"
    },
    "angel one": {
        "legalName": "Angel One Limited",
        "sebiRegNo": "INZ000161534",
        "entityType": "Broker",
        "validity": "Active",
        "officialDomain": "angelone.in"
    },
    "icici direct": {
        "legalName": "ICICI Securities Limited",
        "sebiRegNo": "INZ000183631",
        "entityType": "Broker",
        "validity": "Active",
        "officialDomain": "icicidirect.com"
    }
}

def verify_entity_record(name: str, reg_no: Optional[str] = None) -> EntityVerificationModel:
    query = name.strip().lower()

    for key, data in OFFICIAL_INTERMEDIARY_DB.items():
        if key in query or (reg_no and data["sebiRegNo"].lower() == reg_no.strip().lower()):
            return EntityVerificationModel(
                entityName=data["legalName"],
                claimedRegistration=data["sebiRegNo"],
                entityType=data["entityType"],
                status="VERIFIED_MATCH",
                source="Official SEBI Recognised Intermediaries Directory",
                sourceUrl="https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognised=yes",
                details="Active intermediary registered under SEBI. Remember: a registration match does not prove that a private chat message or payment request came from this entity.",
                isMockData=False,
                matchedRecord=data
            )

    return EntityVerificationModel(
        entityName=name,
        claimedRegistration=reg_no or "None provided",
        entityType="Unknown",
        status="NO_MATCH_FOUND",
        source="SEBI Registry Search (Prototype Simulation)",
        sourceUrl="https://www.sebi.gov.in",
        details="No registered intermediary matched this name or registration number in current active registry cache.",
        isMockData=True
    )
