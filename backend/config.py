import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    NEWS_API_KEY = os.getenv('NEWS_API_KEY')
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
    GITHUB_CLIENT_ID = os.getenv('GITHUB_CLIENT_ID')
    GITHUB_CLIENT_SECRET = os.getenv('GITHUB_CLIENT_SECRET')
    GOOGLE_TRANSLATE_KEY = os.getenv('GOOGLE_TRANSLATE_KEY')
    
    # Frontend URL - use production URL in production, localhost in development
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'https://news-summarizer-dashboard.vercel.app' if os.getenv('FLASK_ENV') == 'production' else 'http://localhost:3000')