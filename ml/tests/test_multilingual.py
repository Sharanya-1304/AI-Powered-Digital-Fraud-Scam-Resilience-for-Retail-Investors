"""
SANGYAN SHIELD - Test Suite: Multilingual Language Processing & Indic Fraud Detection
Validates English, Hindi, Telugu across native Indic scripts (Devanagari, Telugu)
and romanized transliterations (Prompt Section 19 & 20).
"""

import unittest
from ml.preprocessing.language import detect_language
from ml.inference.predictor import SangyanScamPredictor


class TestSangyanMultilingual(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.predictor = SangyanScamPredictor(artifacts_dir="ml/artifacts")

    def test_hindi_language_detection(self):
        """Verifies native Devanagari and Hinglish detection."""
        devanagari_text = "हर महीने 30% पक्का रिटर्न की गारंटी! ₹10,000 निवेश करें।"
        res = detect_language(devanagari_text)
        self.assertEqual(res["language"], "hi")
        self.assertEqual(res["script"], "devanagari")

        hinglish_text = "Aaj hi ₹5,000 deposit karo aur daily ₹1,000 munafa kamao."
        res_h = detect_language(hinglish_text)
        self.assertEqual(res_h["language"], "hi")

    def test_telugu_language_detection(self):
        """Verifies native Telugu script and Tenglish detection."""
        telugu_text = "ప్రతి నెలా 30% స్థిరమైన రాబడి గ్యారెంటీ! ₹10,000 పెట్టుబడి పెట్టండి."
        res = detect_language(telugu_text)
        self.assertEqual(res["language"], "te")
        self.assertEqual(res["script"], "telugu")

        tenglish_text = "100% guaranteed laabham! Ee roju ₹10,000 deposit pettandi double dabbulu pondandi."
        res_t = detect_language(tenglish_text)
        self.assertEqual(res_t["language"], "te")

    def test_hindi_fraud_inference(self):
        """Verifies Hindi scam detection and signal classification."""
        text = "हर महीने 30% पक्का रिटर्न की गारंटी! ₹10,000 निवेश करें।"
        result = self.predictor.predict(text)
        signal_types = {s["type"] for s in result["signals"]}

        self.assertIn("GUARANTEED_RETURN", signal_types)
        self.assertEqual(result["metadata"]["language"], "hi")

    def test_telugu_fraud_inference(self):
        """Verifies Telugu scam detection and signal classification."""
        text = "ప్రతి నెలా 30% స్థిరమైన రాబడి గ్యారెంటీ! ₹10,000 పెట్టుబడి పెట్టండి."
        result = self.predictor.predict(text)
        signal_types = {s["type"] for s in result["signals"]}

        self.assertIn("GUARANTEED_RETURN", signal_types)
        self.assertEqual(result["metadata"]["language"], "te")


if __name__ == "__main__":
    unittest.main()
