"""
SANGYAN SHIELD - Test Suite: Task B Multi-Label Signal Classifier & Evidence Extraction
"""

import unittest
from ml.inference.predictor import SangyanScamPredictor


class TestSangyanMultiLabel(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.predictor = SangyanScamPredictor(artifacts_dir="ml/artifacts")

    def test_multi_signal_detection(self):
        """
        Verifies that multiple independent scam signals are detected simultaneously
        without being forced into a single-label softmax (Section 3 & 10).
        """
        text = "Guaranteed 30% monthly return! Pay ₹5,000 today within 10 minutes and share your 6-digit OTP."
        result = self.predictor.predict(text)
        detected_types = {s["type"] for s in result["signals"]}

        self.assertIn("GUARANTEED_RETURN", detected_types)
        self.assertIn("URGENCY", detected_types)
        self.assertIn("OTP_REQUEST", detected_types)
        self.assertIn("PAYMENT_REQUEST", detected_types)

    def test_verbatim_evidence_spans(self):
        """
        Section 11: Verifies that every extracted evidence span strictly matches
        input_text[start:end] == evidence without hallucinating non-existent strings.
        """
        text = "Deposit ₹25,000 today and get ₹75,000 in 30 days guaranteed. Limited slots available."
        result = self.predictor.predict(text)

        self.assertGreater(len(result["signals"]), 0)
        for sig in result["signals"]:
            self.assertIn("start", sig)
            self.assertIn("end", sig)
            self.assertIn("evidence", sig)
            self.assertIn("confidence", sig)

            start = sig["start"]
            end = sig["end"]
            evidence = sig["evidence"]

            # Exact substring guarantee
            self.assertEqual(
                text[start:end],
                evidence,
                f"Evidence mismatch: expected '{evidence}', got '{text[start:end]}'"
            )

    def test_safety_critical_otp_preservation(self):
        """
        Section 14: Verifies safety-critical OTP signals are retained even in mixed text.
        """
        text = "Dear user, share the 6-digit OTP sent to your phone immediately to verify demat holdings."
        result = self.predictor.predict(text)
        detected_types = {s["type"] for s in result["signals"]}
        self.assertIn("OTP_REQUEST", detected_types)


if __name__ == "__main__":
    unittest.main()
