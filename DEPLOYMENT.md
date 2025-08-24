# Deployment Guide

This guide covers deploying the NewsSumm application to production environments.

## Deployed URLs

- **Frontend (Vercel)**: https://news-summarizer-dashboard.vercel.app
- **Backend (Render)**: https://newssummarizerdashboard.onrender.com

## Environment Variables

### Backend (Render) Environment Variables

Set these environment variables in your Render dashboard:

```bash
# Flask Configuration
FLASK_ENV=production
SECRET_KEY=your-secure-secret-key-here

# API Keys
NEWS_API_KEY=your-news-api-key
GEMINI_API_KEY=your-gemini-api-key
GOOGLE_TRANSLATE_KEY=your-google-translate-key

# OAuth Configuration
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL (for OAuth redirects)
FRONTEND_URL=https://news-summarizer-dashboard.vercel.app
```

### Frontend (Vercel) Environment Variables

Set these environment variables in your Vercel dashboard:

```bash
# Production flag
NODE_ENV=production
```

## GitHub OAuth Setup

### 1. Create GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: NewsSumm Dashboard
   - **Homepage URL**: `https://news-summarizer-dashboard.vercel.app`
   - **Authorization callback URL**: `https://newssummarizerdashboard.onrender.com/auth/callback/github`

### 2. Get OAuth Credentials

After creating the OAuth app, you'll get:
- **Client ID**: Copy this to `GITHUB_CLIENT_ID`
- **Client Secret**: Generate a new one and copy to `GITHUB_CLIENT_SECRET`

## Deployment Steps

### Backend (Render)

1. Connect your GitHub repository to Render
2. Set the build command: `pip install -r requirements.txt`
3. Set the start command: `gunicorn wsgi:app`
4. Add all environment variables listed above
5. Deploy

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set the build command: `npm run build`
3. Set the output directory: `build`
4. Add environment variables if needed
5. Deploy

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:3000` (development)
- `https://news-summarizer-dashboard.vercel.app` (production)

## OAuth Flow

1. User clicks "Login with GitHub" on frontend
2. Frontend redirects to: `https://newssummarizerdashboard.onrender.com/auth/login/github`
3. Backend redirects to GitHub OAuth
4. GitHub redirects back to: `https://newssummarizerdashboard.onrender.com/auth/callback/github`
5. Backend processes OAuth callback and redirects to: `https://news-summarizer-dashboard.vercel.app/dashboard`

## Testing OAuth

You can test the OAuth configuration by visiting:
- `https://newssummarizerdashboard.onrender.com/test-oauth-config`

This endpoint will show you the current OAuth configuration status.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the frontend URL is correctly added to CORS origins
2. **OAuth Redirect Errors**: Verify the callback URL matches exactly in GitHub OAuth app settings
3. **Session Issues**: Ensure `SECRET_KEY` is set and consistent
4. **API Errors**: Check that all API keys are properly set in environment variables

### Debug Endpoints

- Health check: `https://newssummarizerdashboard.onrender.com/api/health`
- OAuth config test: `https://newssummarizerdashboard.onrender.com/test-oauth-config`
