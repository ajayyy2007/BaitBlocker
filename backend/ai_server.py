from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# Load DistilBERT model
classifier = pipeline(
    "text-classification",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

@app.route("/analyze", methods=["POST"])
def analyze():

    data = request.json
    text = data["text"]

    result = classifier(text)[0]

    return jsonify({
        "label": result["label"],
        "confidence": float(result["score"])
    })

if __name__ == "__main__":
    app.run(port=5001)