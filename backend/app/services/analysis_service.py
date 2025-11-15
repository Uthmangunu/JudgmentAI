"""
NLP analysis service for Aspect-Based Sentiment Analysis (ABSA).
Uses spaCy for aspect extraction and OpenAI for sentiment classification.
"""
from typing import List, Dict, Tuple
import spacy
from openai import OpenAI

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
        self._openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)

    def _load_models(self):
        """Lazy-load spaCy model (expensive operation)."""
        if self._nlp is None:
            # Load spaCy model for aspect extraction
            try:
                self._nlp = spacy.load("en_core_web_lg")
            except OSError:
                # Model not downloaded, use smaller model
                print("Warning: en_core_web_lg not found, using en_core_web_sm")
                self._nlp = spacy.load("en_core_web_sm")

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
        Classify sentiment for a specific aspect within text using OpenAI.

        Args:
            text: Full comment text
            aspect: Specific aspect to analyze

        Returns:
            Sentiment label: "positive", "negative", or "neutral"
        """
        try:
            # Use OpenAI to classify sentiment (lightweight, no model loading)
            response = self._openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a sentiment analysis assistant. Classify the sentiment about a specific aspect in the given text. Respond with only one word: positive, negative, or neutral."
                    },
                    {
                        "role": "user",
                        "content": f"Text: {text}\n\nAspect: {aspect}\n\nSentiment:"
                    }
                ],
                temperature=0,
                max_tokens=10
            )

            sentiment = response.choices[0].message.content.strip().lower()

            # Validate response
            if sentiment in ["positive", "negative", "neutral"]:
                return sentiment
            else:
                return "neutral"

        except Exception as e:
            print(f"Error classifying sentiment with OpenAI: {e}")
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
