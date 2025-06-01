import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(override=True)

# API Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_BASE_URL = "https://openrouter.ai/api/v1"

# Server Configuration
CORS_ORIGINS = [
    "http://localhost:8080",
    "http://localhost:8081",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:8081",
    "http://localhost:5000",
    "http://127.0.0.1:5000"
]

# Chat Configuration
MAX_HISTORY_LENGTH = 10
DEFAULT_MODEL = "deepseek/deepseek-r1:free"

# Available Models
AVAILABLE_MODELS = [
    "google/gemma-3-27b-it:free",
    "deepseek/deepseek-r1:free",
    "meta-llama/llama-3.3-70b-instruct:free"
] 
