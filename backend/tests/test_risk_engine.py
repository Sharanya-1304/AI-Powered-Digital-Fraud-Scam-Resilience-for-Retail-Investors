import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.risk_engine.rules import scan_text_with_rules
from app.url_analyzer.ssrf import is_url_ssrf_safe
from app.url_analyzer.analyzer import analyze_url
from app.risk_engine.scorer import evaluate_scan
from app.safety.guardrails import apply_safety_guardrails

def test_guaranteed_return_detection():
    sample = "Join our group for guaranteed 30% monthly return on your capital."
    signals = scan_text_with_rules(sample)
    types = [s.type for s in signals]
    assert "GUARANTEED_RETURN" in types, "Should detect guaranteed return"
    print("[PASS] Test guaranteed return passed")

def test_otp_harvesting_detection():
    sample = "Send the OTP received on your phone to complete your KYC activation."
    signals = scan_text_with_rules(sample)
    types = [s.type for s in signals]
    assert "OTP_REQUEST" in types, "Should detect OTP request"
    print("[PASS] Test OTP request passed")

def test_urgency_detection():
    sample = "Pay today! Only 2 slots left before registration closes."
    signals = scan_text_with_rules(sample)
    types = [s.type for s in signals]
    assert "URGENCY" in types, "Should detect urgency"
    print("[PASS] Test urgency passed")

def test_ssrf_protection():
    assert is_url_ssrf_safe("http://127.0.0.1/admin")[0] is False
    assert is_url_ssrf_safe("http://localhost:8000/metrics")[0] is False
    assert is_url_ssrf_safe("http://192.168.1.1/router")[0] is False
    assert is_url_ssrf_safe("http://10.0.0.1/internal")[0] is False
    assert is_url_ssrf_safe("file:///etc/passwd")[0] is False
    assert is_url_ssrf_safe("https://sebi.gov.in")[0] is True
    print("[PASS] Test SSRF prevention passed")

def test_url_analyzer_brand_mismatch():
    finding = analyze_url("https://secure-sebi-invest.vip-trade.net/login")
    assert finding.brandMismatch is True
    assert finding.hasRegulatorKeywords is True
    print("[PASS] Test URL brand mismatch passed")

def test_safety_guardrails_no_advice():
    advice_text = "You should buy stocks now for target price 500."
    sanitized = apply_safety_guardrails(advice_text)
    assert "does not provide investment recommendations" in sanitized
    print("[PASS] Test non-advisory safety guardrail passed")

def test_full_pipeline_critical_warning():
    scam = "SEBI approved investment! Guaranteed 30% return. Pay ₹5,000 today. Send OTP to activate."
    result = evaluate_scan(scam)
    assert result.riskBand == "CRITICAL_SAFETY_WARNING"
    assert result.riskScore >= 75
    assert len(result.signals) >= 3
    print("[PASS] Test full pipeline critical warning passed")

if __name__ == "__main__":
    print("Running SANGYAN SHIELD Security & Risk Engine Tests...")
    test_guaranteed_return_detection()
    test_otp_harvesting_detection()
    test_urgency_detection()
    test_ssrf_protection()
    test_url_analyzer_brand_mismatch()
    test_safety_guardrails_no_advice()
    test_full_pipeline_critical_warning()
    print("\nALL BACKEND SECURITY & LOGIC TESTS PASSED SUCCESSFULLY! (7/7)")
