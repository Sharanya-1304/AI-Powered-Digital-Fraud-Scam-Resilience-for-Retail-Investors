"""
SANGYAN SHIELD - Test Suite: Task A Classifier & Structured Inference
"""

import unittest
import os
from ml.inference.predictor import SangyanScamPredictor


class TestSangyanClassifier(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.predictor = SangyanScamPredictor(artifacts_dir="ml/artifacts")

    def test_predictor_loaded(self):
        """Verifies predictor loads artifacts successfully."""
        self.assertTrue(self.predictor.is_loaded)
        self.assertEqual(self.predictor.metadata.get("status"), "ACTIVE")

    def test_scam_classification_structure(self):
        """Verifies structured output format mandated by Section 1 & 50."""
        text = "Guaranteed 30% monthly return with zero market risk. Invest ₹10,000 today."
        result = self.predictor.predict(text)

        self.assertIn("classification", result)
        self.assertIn("signals", result)
        self.assertIn("model", result)
        self.assertIn("metadata", result)

        cls_info = result["classification"]
        self.assertIn(cls_info["label"], {"SCAM_LIKE", "SUSPICIOUS", "BENIGN"})
        self.assertGreaterEqual(cls_info["confidence"], 0.0)
        self.assertLessEqual(cls_info["confidence"], 1.0)
        self.assertIn("uncertainty", cls_info)
        self.assertIn("class_probabilities", cls_info)

    def test_benign_trade_confirmation(self):
        """Verifies benign financial notices do not get falsely alarmed."""
        text = "Your buy order for 25 shares of INFOSYS LIMITED has been executed at ₹1,845.50 on NSE. Trade ID: 2026100491823."
        result = self.predictor.predict(text)
        self.assertEqual(result["classification"]["label"], "BENIGN")

    def test_empty_input_graceful(self):
        """Verifies empty input does not crash the predictor."""
        result = self.predictor.predict("")
        self.assertEqual(result["classification"]["label"], "BENIGN")


if __name__ == "__main__":
    unittest.main()
