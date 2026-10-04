"""
SANGYAN SHIELD - Robust Multilingual Feature Engineering Pipeline
Combines word-level n-grams with character n-grams (subwords) to ensure resilience
against spelling perturbations, adversarial spacing, OCR noise, and multilingual Indic scripts.
"""

from typing import Tuple, Dict, Any, List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import FeatureUnion
import numpy as np


def build_feature_pipeline(
    word_ngram_range: Tuple[int, int] = (1, 2),
    char_ngram_range: Tuple[int, int] = (3, 5),
    max_features: int = 5000,
    min_df: int = 1
) -> FeatureUnion:
    """
    Constructs a dual-granularity TF-IDF FeatureUnion:
    1. Word-level TF-IDF: captures key financial & fraud n-gram semantics
    2. Character-level TF-IDF: captures morphological roots, obfuscated tokens, and Indic scripts
    """
    word_vectorizer = TfidfVectorizer(
        ngram_range=word_ngram_range,
        analyzer="word",
        min_df=min_df,
        max_features=int(max_features * 0.6),
        sublinear_tf=True,
        strip_accents="unicode"
    )

    char_vectorizer = TfidfVectorizer(
        ngram_range=char_ngram_range,
        analyzer="char_wb",  # char n-grams inside word boundaries
        min_df=min_df,
        max_features=int(max_features * 0.4),
        sublinear_tf=True
    )

    feature_union = FeatureUnion([
        ("word_tfidf", word_vectorizer),
        ("char_tfidf", char_vectorizer)
    ])

    return feature_union


class SangyanFeatureExtractor:
    """Encapsulates feature extraction, fitting, transform, and vocabulary inspection."""

    def __init__(self, config: Dict[str, Any] = None):
        cfg = config or {}
        word_ngram = tuple(cfg.get("word_ngram_range", [1, 2]))
        char_ngram = tuple(cfg.get("char_ngram_range", [3, 5]))
        max_features = cfg.get("max_features", 5000)
        min_df = cfg.get("min_df", 1)

        self.pipeline = build_feature_pipeline(
            word_ngram_range=word_ngram,
            char_ngram_range=char_ngram,
            max_features=max_features,
            min_df=min_df
        )
        self.is_fitted = False

    def fit(self, texts: List[str]):
        """Fit the feature union on cleaned text corpus."""
        self.pipeline.fit(texts)
        self.is_fitted = True
        return self

    def transform(self, texts: List[str]):
        """Transform texts into sparse TF-IDF feature matrix."""
        if not self.is_fitted:
            raise RuntimeError("Feature extractor must be fitted before calling transform.")
        return self.pipeline.transform(texts)

    def fit_transform(self, texts: List[str]):
        """Fit and transform in one step."""
        features = self.pipeline.fit_transform(texts)
        self.is_fitted = True
        return features

    def get_feature_names(self) -> List[str]:
        """Returns union feature names."""
        if not self.is_fitted:
            return []
        names = []
        for name, transformer in self.pipeline.transformer_list:
            sub_names = transformer.get_feature_names_out()
            names.extend([f"{name}__{sn}" for sn in sub_names])
        return names
