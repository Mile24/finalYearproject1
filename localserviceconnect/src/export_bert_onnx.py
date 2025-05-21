from transformers import AutoTokenizer, AutoModelForSequenceClassification
from transformers.onnx import export
from transformers.onnx.features import FeaturesManager




import mysql.connector # type: ignore
from transformers import pipeline
from collections import Counter
import nltk # type: ignore
from nltk.tokenize import sent_tokenize # type: ignore

# Download NLTK tokenizer (first time only)
nltk.download('punkt')

# Load BERT sentiment analysis model
sentiment_pipeline = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")

# DB Config (replace with your actual credentials)
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "root",
    "database": "MySqlDB"
}

def fetch_feedback_by_id(feedback_id):
    """Fetch a specific feedback string from DB using ID"""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        cursor.execute("SELECT feedback_text FROM feedback WHERE id = %s", (feedback_id,))
        row = cursor.fetchone()
        cursor.close()
        conn.close()
        return row[0] if row else ""
    except Exception as e:
        print(f"DB Error: {e}")
        return ""

def classify_sentiment(label):
    if "1" in label or "2" in label:
        return "negative"
    elif "3" in label:
        return "neutral"
    else:
        return "positive"

def analyze_text_sentiment(text):
    """Perform BERT sentiment analysis on feedback text"""
    sentences = sent_tokenize(text)
    sentences = [s.strip() for s in sentences if s.strip()]
    if not sentences:
        return {
            "positive": 0.0,
            "neutral": 0.0,
            "negative": 0.0,
            "total": 0,
            "details": []
        }

    results = sentiment_pipeline(sentences)
    sentiment_counts = Counter()
    detailed_results = []

    for sentence, result in zip(sentences, results):
        sentiment = classify_sentiment(result["label"])
        sentiment_counts[sentiment] += 1
        detailed_results.append({
            "sentence": sentence,
            "bert_label": result["label"],
            "confidence": round(result["score"], 4),
            "sentiment": sentiment
        })

    total = len(sentences)
    return {
        "positive": round((sentiment_counts["positive"] / total) * 100, 2),
        "neutral": round((sentiment_counts["neutral"] / total) * 100, 2),
        "negative": round((sentiment_counts["negative"] / total) * 100, 2),
        "total": total,
        "details": detailed_results
    }

# ✅ Run for one specific feedback
if __name__ == "__main__":
    feedback_id = get.id()  # type: ignore # 👈 Replace this with the specific ID you want to analyze
    feedback_text = fetch_feedback_by_id(feedback_id)

    if feedback_text:
        summary = analyze_text_sentiment(feedback_text)
        print(f"\nSentiment Summary for feedback ID {feedback_id}:")
        print(summary)
    else:
        print(f"No feedback found with ID {feedback_id}")
