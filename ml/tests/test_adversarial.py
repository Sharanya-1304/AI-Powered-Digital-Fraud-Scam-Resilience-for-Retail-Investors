"""
SANGYAN SHIELD - Test Suite: Adversarial Perturbations & OCR Noise Robustness
Evaluates system resilience against spaced characters, punctuation injection,
OCR misrecognitions, and URL obfuscations (Prompt Section 25 & 27).
"""

import unittest
from ml.inference.predictor import SangyanScamPredictor
from ml.preprocessing.normalizer import deobfuscate_spaced_text


class TestSangyanAdversarial(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.predictor = SangyanScamPredictor(artifacts_dir="ml/artifacts")

    def test_spaced_characters_adversarial(self):
        """Tests spaced obfuscation: 'G U A R A N T E E D 30% RETURN!!!'"""
        text = "G U A R A N T E E D 30% RETURN! Pay immediately to activate profit bot."
        result = self.predictor.predict(text)
        signal_types = {s["type"] for s in result["signals"]}

        self.assertIn("GUARANTEED_RETURN", signal_types)
        self.assertIn(result["classification"]["label"], {"SCAM_LIKE", "SUSPICIOUS"})

    def test_punctuation_obfuscated_otp(self):
        """Tests punctuation-separated obfuscation: 'g.u.a.r.a.n.t.e.e.d' and 'o-t-p'"""
        text = "g.u.a.r.a.n.t.e.e.d returns! Disclose the o-t-p code to unlock payout."
        result = self.predictor.predict(text)
        signal_types = {s["type"] for s in result["signals"]}

        self.assertIn("GUARANTEED_RETURN", signal_types)
        self.assertIn("OTP_REQUEST", signal_types)

    def test_ocr_typo_resilience(self):
        """Tests OCR character drop: 'Guaranted 30% return'"""
        text = "Guaranted 30% return. Pay clearance fee before midnight or account blocked http://tinyurl.com/pay-safe"
        result = self.predictor.predict(text)
        signal_types = {s["type"] for s in result["signals"]}

        self.assertIn("GUARANTEED_RETURN", signal_types)
        self.assertIn("WITHDRAWAL_FEE", signal_types)
        self.assertIn("SUSPICIOUS_URL", signal_types)

    def test_sideload_apk_detection(self):
        """Tests unknown APK installation attempt."""
        text = "Download ApexTrade.apk to access secret institutional breakout calls. Enable install from unknown sources."
        result = self.predictor.predict(text)
        signal_types = {s["type"] for s in result["signals"]}

        self.assertTrue("FAKE_APP" in signal_types or "UNKNOWN_APP" in signal_types)


if __name__ == "__main__":
    unittest.main()
