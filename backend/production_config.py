import os
from dotenv import load_dotenv

load_dotenv()

class ProductionConfig:
    SECRET_KEY = os.getenv('SECRET_KEY')
    NEWS_API_KEY = os.getenv('NEWS_API_KEY')
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
    GITHUB_CLIENT_ID = os.getenv('GITHUB_CLIENT_ID')
    GITHUB_CLIENT_SECRET = os.getenv('GITHUB_CLIENT_SECRET')
    GOOGLE_TRANSLATE_KEY = os.getenv('GOOGLE_TRANSLATE_KEY')
    
    # Production frontend URL
    FRONTEND_URL = 'https://news-summarizer-dashboard.vercel.app'
    
    # Production specific settings
    DEBUG = False
    TESTING = False
    
    # Security settings
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
