# NewsDigest - AI-Powered News Dashboard

A modern, intelligent news aggregation and summarization platform built with React and Flask. Get personalized news with AI-powered summaries, multi-language support, and beautiful reading experience.

![NewsSumm Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![React](https://img.shields.io/badge/React-18-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎯 Core Features
- **AI-Powered Summaries**: Concise bullet-point summaries using Google Gemini API
- **Personalized News Feed**: Customizable categories and preferences
- **Multi-language Support**: Automatic translation using Google Translate API
- **Reading Analytics**: Track daily reading habits and maintain streaks
- **Social Sharing**: Share articles with public links
- **Dark/Light Mode**: Beautiful theme switching with smooth transitions

### 🔐 Authentication
- **Email/Password** authentication with secure password hashing
- Session-based authentication with secure cookies
- CORS protection with dynamic origin handling
- Secure headers and CSRF protection

### 💾 Smart Storage
- Browser-based storage (LocalStorage)
- Persistent reading streaks and preferences
- No database required (easily extensible)

### 🎨 Modern Design
- Apple/OpenAI inspired minimalist design
- Smooth animations with Framer Motion
- Responsive grid layouts
- Glass morphism effects
- Tailwind CSS with custom styling

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+**
- **Node.js 16+**
- **API Keys** (see setup guide below)

### 1. Clone the Repository
```bash
git clone https://github.com/baka-byte447/NewsSumm.git
cd NewsSumm
```

### 2. Backend Setup
```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp config_example.py .env
# Edit .env with your API keys

# Run the backend
python app.py
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The app will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 🔑 API Setup

### Required API Keys

| Service | Purpose | Cost | Setup Guide |
|---------|---------|------|-------------|
| **News API** | Fetch news articles | Free (1000 req/day) | [NewsAPI.org](https://newsapi.org) |
| **Gemini API** | AI summarization | Free (15 req/min) | [Google AI Studio](https://makersuite.google.com/app/apikey) |
| **Google Translate** | Language translation | $20/month | [Google Cloud Console](https://console.cloud.google.com/) |

> **Note:** Email/Password authentication is built-in and doesn't require additional API keys.

### Environment Variables
Create a `.env` file in the `backend` directory:

```env
# Flask Configuration
SECRET_KEY=your-super-secret-key-here

# News API
NEWS_API_KEY=your-newsapi-key-here

# AI Services
GEMINI_API_KEY=your-gemini-api-key-here
GOOGLE_TRANSLATE_KEY=your-google-translate-key-here
```

## 🏗️ Architecture

### Backend (Flask)
```
backend/
├── app.py              # Main Flask application
├── auth.py             # Authentication module
├── news_service.py     # News processing & AI integration
├── config.py           # Configuration management
└── requirements.txt    # Python dependencies
```

### Frontend (React)
```
frontend/
├── src/
│   ├── components/     # React components
│   ├── utils/          # Utility functions
│   └── styles/         # CSS and styling
├── package.json        # Node.js dependencies
└── tailwind.config.js  # Tailwind CSS configuration
```

## 🛠️ Tech Stack

### Backend
- **Flask** - Lightweight web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Google Gemini API** - AI-powered text generation
- **Google Translate API** - Language translation
- **Secure Password Hashing** - Password security
- **Secure Cookies** - Session management

### Frontend
- **React 18** - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icon set
- **LocalStorage** - Client-side data persistence

## 📱 Screenshots

*[Add screenshots of your app here]*

## 🔧 Development

### Running Tests
```bash
# Backend tests
cd backend
python test_news_service.py

# Frontend tests
cd frontend
npm test
```

### Building for Production
```bash
# Frontend build
cd frontend
npm run build

# Backend deployment
cd backend
pip install -r requirements.txt
python app.py
```

## 📚 API Documentation

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check and service status |
| `/api/news` | GET | Fetch news articles with AI summaries |
| `/auth/signup` | POST | Register new user |
| `/auth/login` | POST | User login |
| `/auth/logout` | POST | User logout |
| `/auth/user` | GET | Get current user info |

### Example API Response
```json
{
  "articles": [
    {
      "id": "article-url",
      "title": "Article Title",
      "description": "Article description",
      "summary": "AI-generated summary",
      "url": "https://article-url.com",
      "source": "News Source",
      "publishedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "totalResults": 20,
  "category": "technology"
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NewsAPI.org** for providing news data
- **Google AI Studio** for Gemini AI capabilities
- **OpenAI** for design inspiration
- **React** and **Flask** communities

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/baka-byte-447/NewsSummarizerDashboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/baka-byte-447/NewsSummarizerDashboard/discussions)
- **Email**: milansharma2807@gmail.com

## 🚀 Deployment

### Vercel (Frontend)
```bash
cd frontend
npm run build
vercel --prod
```

### Heroku (Backend)
```bash
cd backend
heroku create your-app-name
git push heroku main
```

### Docker
```bash
docker-compose up --build
```

---

**Made with ❤️ by Team G-30**

*Star this repository if you found it helpful!*
