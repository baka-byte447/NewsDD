from flask import Flask, request, jsonify, session
from flask_cors import CORS
import hashlib
import json
import time
from datetime import datetime
from config import Config
from auth import auth_bp, init_oauth
from news_service import NewsService
import os

app = Flask(__name__)
app.config.from_object(Config)
app.secret_key = app.config['SECRET_KEY']

# Configure CORS for production
CORS(app, supports_credentials=True, origins=[
    'http://localhost:3000',  # Local development
    'https://newssummarizerdashboard.onrender.com'  # Update this with your actual frontend domain
])

# Initialize OAuth
oauth, google, github = init_oauth(app)

# Initialize News Service
news_service = NewsService(
    app.config['NEWS_API_KEY'],
    app.config['GEMINI_API_KEY'],
    app.config.get('GOOGLE_TRANSLATE_KEY')
)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')

# In-memory storage for shared articles (replace with DB later)
shared_articles = {}

@app.route('/api/news')
def get_news():
    """Fetch news articles"""
    try:
        category = request.args.get('category', 'general')
        language = request.args.get('language', 'en')
        user_language = request.args.get('userLanguage', 'en')
        
        # Fetch raw articles
        news_data = news_service.fetch_news(category=category, language=language, page_size=20)
        
        if not news_data or news_data.get('status') == 'error':
            return jsonify({'articles': [], 'error': news_data.get('message', 'No articles found')})
        
        # Process articles (summarize, translate if needed)
        processed_data = news_service.process_news_data(
            news_data, 
            summarize=True, 
            translate_to=user_language if user_language != 'en' else None
        )
        
        return jsonify({
            'articles': processed_data.get('articles', []),
            'category': category,
            'timestamp': datetime.now().isoformat(),
            'totalResults': processed_data.get('totalResults', 0)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/article/<article_id>')
def get_article(article_id):
    """Get full article details"""
    try:
        # This would typically fetch from database
        # For now, we'll return a placeholder response
        return jsonify({
            'id': article_id,
            'message': 'Article details would be fetched from database'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/share', methods=['POST'])
def share_article():
    """Create shareable link for article"""
    try:
        data = request.json
        article_data = data.get('article')
        
        if not article_data:
            return jsonify({'error': 'No article data provided'}), 400
        
        # Generate unique share ID
        share_id = hashlib.md5(
            f"{article_data.get('url', '')}{time.time()}".encode()
        ).hexdigest()[:12]
        
        # Store article data (in production, use database)
        shared_articles[share_id] = {
            'article': article_data,
            'created_at': datetime.now().isoformat(),
            'views': 0
        }
        
        # Use environment variable for base URL or default to request host
        base_url = request.host_url.rstrip('/')
        share_url = f"{base_url}/shared/{share_id}"
        
        return jsonify({
            'shareId': share_id,
            'shareUrl': share_url
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/shared/<share_id>')
def get_shared_article(share_id):
    """Get shared article by ID"""
    try:
        if share_id not in shared_articles:
            return jsonify({'error': 'Article not found'}), 404
        
        # Increment view count
        shared_articles[share_id]['views'] += 1
        
        return jsonify(shared_articles[share_id])
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/preferences', methods=['POST'])
def save_preferences():
    """Save user preferences"""
    try:
        user = session.get('user')
        if not user:
            return jsonify({'error': 'Not authenticated'}), 401
        
        # In production, save to database
        # For now, just return success
        preferences = request.json
        return jsonify({
            'message': 'Preferences saved successfully',
            'preferences': preferences
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'oauth': {
            'github': bool(github),
            'google': bool(google)
        },
        'services': {
            'news_service': news_service is not None,
            'oauth_configured': bool(github) or bool(google)
        }
    })

if __name__ == '__main__':
    # Production settings
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
