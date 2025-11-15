"""
NLP analysis service for Aspect-Based Sentiment Analysis (ABSA).
Uses spaCy for aspect extraction and SetFit for sentiment classification.
"""
from typing import List, Dict, Tuple
import spacy
from setfit import AbsaModel

from app.core.config import settings


class AnalysisService:
    """
    Service for performing Aspect-Based Sentiment Analysis on Reddit comments.

    ABSA Process:
    1. Extract noun chunks (aspects) using spaCy
    2. Classify sentiment for each aspect using SetFit
    3. Return structured insights
    """

    def __init__(self):
        """Initialize NLP models."""
        self._nlp = None
        self._absa_model = None

    def _load_models(self):
        """Lazy-load NLP models (expensive operation)."""
        if self._nlp is None:
            # Load spaCy model for aspect extraction
            try:
                self._nlp = spacy.load("en_core_web_lg")
            except OSError:
                # Model not downloaded, use smaller model
                print("Warning: en_core_web_lg not found, using en_core_web_sm")
                self._nlp = spacy.load("en_core_web_sm")

        if self._absa_model is None:
            # Load pre-trained ABSA model
            # Note: This is a placeholder - you may need to fine-tune for Reddit
            self._absa_model = AbsaModel.from_pretrained(
                "tomaarsen/setfit-absa-bge-small-en-v1.5-restaurants-aspect",
                # You'll want to train your own model or find a general-domain one
            )

    def extract_aspects(self, text: str) -> List[str]:
        """
        Extract aspect terms (noun chunks) from text.

        Args:
            text: Comment or review text

        Returns:
            List of aspect strings (e.g., ["battery life", "camera quality"])
        """
        self._load_models()

        doc = self._nlp(text)
        aspects = []

        # Extract noun chunks as aspects
        for chunk in doc.noun_chunks:
            # Filter out generic/non-informative chunks
            if len(chunk.text.split()) <= 4:  # Max 4 words
                aspect = chunk.text.lower().strip()
                if aspect and len(aspect) > 2:  # Min length
                    aspects.append(aspect)

        # Also extract named entities as potential aspects
        for ent in doc.ents:
            if ent.label_ in ["PRODUCT", "ORG", "GPE"]:
                aspects.append(ent.text.lower().strip())

        # Remove duplicates while preserving order
        seen = set()
        unique_aspects = []
        for aspect in aspects:
            if aspect not in seen:
                seen.add(aspect)
                unique_aspects.append(aspect)

        return unique_aspects

    def classify_sentiment(
        self,
        text: str,
        aspect: str
    ) -> str:
        """
        Classify sentiment for a specific aspect within text.

        Args:
            text: Full comment text
            aspect: Specific aspect to analyze

        Returns:
            Sentiment label: "positive", "negative", or "neutral"
        """
        self._load_models()

        try:
            # Use ABSA model to predict sentiment for aspect
            prediction = self._absa_model.predict([{
                "text": text,
                "aspect": aspect
            }])[0]

            # Map model output to our schema
            sentiment_map = {
                "positive": "positive",
                "negative": "negative",
                "neutral": "neutral",
                "POS": "positive",
                "NEG": "negative",
                "NEU": "neutral"
            }

            return sentiment_map.get(prediction.lower(), "neutral")

        except Exception as e:
            print(f"Error classifying sentiment: {e}")
            # Fallback to simple rule-based approach
            return self._fallback_sentiment(text, aspect)

    def _fallback_sentiment(self, text: str, aspect: str) -> str:
        """
        Simple rule-based sentiment as fallback.

        Args:
            text: Comment text
            aspect: Aspect term

        Returns:
            Basic sentiment estimation
        """
        # Find sentences containing the aspect
        self._load_models()
        doc = self._nlp(text.lower())

        aspect_lower = aspect.lower()
        relevant_sentences = [
            sent.text for sent in doc.sents
            if aspect_lower in sent.text
        ]

        if not relevant_sentences:
            return "neutral"

        # Simple keyword matching
        positive_words = {"good", "great", "excellent", "love", "amazing", "best", "perfect"}
        negative_words = {"bad", "terrible", "awful", "hate", "worst", "poor", "disappointing"}

        context = " ".join(relevant_sentences).lower()
        pos_count = sum(1 for word in positive_words if word in context)
        neg_count = sum(1 for word in negative_words if word in context)

        if pos_count > neg_count:
            return "positive"
        elif neg_count > pos_count:
            return "negative"
        else:
            return "neutral"

    def analyze_comment(self, text: str) -> List[Dict[str, str]]:
        """
        Perform full ABSA on a single comment.

        Args:
            text: Comment text

        Returns:
            List of insights: [{"aspect": "...", "sentiment": "...", "text": "..."}]
        """
        if not text or len(text.strip()) < 10:
            return []

        # Extract aspects
        aspects = self.extract_aspects(text)

        if not aspects:
            # No aspects found, treat entire comment as generic sentiment
            sentiment = self._fallback_sentiment(text, "overall")
            return [{
                "aspect": "general",
                "sentiment": sentiment,
                "text": text[:500]  # Truncate for storage
            }]

        # Classify sentiment for each aspect
        insights = []
        for aspect in aspects[:5]:  # Limit to top 5 aspects per comment
            sentiment = self.classify_sentiment(text, aspect)
            insights.append({
                "aspect": aspect,
                "sentiment": sentiment,
                "text": text[:500]  # Store truncated text
            })

        return insights

    def batch_analyze(self, comments: List[str]) -> List[List[Dict[str, str]]]:
        """
        Analyze multiple comments in batch.

        Args:
            comments: List of comment texts

        Returns:
            List of insight lists (one per comment)
        """
        return [self.analyze_comment(comment) for comment in comments]
