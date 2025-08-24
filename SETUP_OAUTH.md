# OAuth Setup Guide for NewsSumm

This guide will help you set up OAuth authentication for your deployed NewsSumm application.

## Deployed Application URLs

- **Frontend**: https://news-summarizer-dashboard.vercel.app
- **Backend**: https://newssummarizerdashboard.onrender.com

## GitHub OAuth Setup

### Step 1: Create GitHub OAuth Application

1. Go to [GitHub Settings](https://github.com/settings)
2. Navigate to **Developer settings** → **OAuth Apps**
3. Click **"New OAuth App"**

### Step 2: Configure OAuth App

Fill in the following details:

```
Application name: NewsSumm Dashboard
Homepage URL: https://news-summarizer-dashboard.vercel.app
Application description: News summarization dashboard with AI-powered insights
Authorization callback URL: https://newssummarizerdashboard.onrender.com/auth/callback/github
```

### Step 3: Get OAuth Credentials

After creating the OAuth app, you'll receive:
- **Client ID**: A public identifier for your app
- **Client Secret**: A private key (keep this secure!)

### Step 4: Configure Environment Variables

Add these to your **Render backend** environment variables:

```bash
GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here
FRONTEND_URL=https://news-summarizer-dashboard.vercel.app
```

## OAuth Flow Explanation

1. **User clicks "Login with GitHub"** on the frontend
2. **Frontend redirects** to: `https://newssummarizerdashboard.onrender.com/auth/login/github`
3. **Backend redirects** to GitHub OAuth authorization page
4. **User authorizes** the application on GitHub
5. **GitHub redirects back** to: `https://newssummarizerdashboard.onrender.com/auth/callback/github`
6. **Backend processes** the OAuth callback and creates a session
7. **Backend redirects** to: `https://news-summarizer-dashboard.vercel.app/dashboard`

## Testing OAuth Configuration

### Test Endpoint

Visit this URL to check your OAuth configuration:
```
https://newssummarizerdashboard.onrender.com/test-oauth-config
```

This will show you:
- Whether GitHub OAuth is configured
- Your GitHub Client ID (masked)
- The frontend URL being used
- The redirect URI for callbacks

### Expected Response

```json
{
  "github_configured": true,
  "github_client_id": "your-client-id",
  "github_client_secret": "***",
  "frontend_url": "https://news-summarizer-dashboard.vercel.app",
  "secret_key_configured": true,
  "redirect_uri": "https://newssummarizerdashboard.onrender.com/auth/callback/github"
}
```

## Troubleshooting

### Common Issues

#### 1. "GitHub OAuth is not configured" Error

**Cause**: Missing environment variables
**Solution**: 
- Check that `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set in Render
- Verify the values match your GitHub OAuth app

#### 2. "Redirect URI mismatch" Error

**Cause**: Callback URL doesn't match GitHub OAuth app settings
**Solution**:
- Ensure GitHub OAuth app has: `https://newssummarizerdashboard.onrender.com/auth/callback/github`
- Check for trailing slashes or typos

#### 3. "Invalid client" Error

**Cause**: Incorrect Client ID or Secret
**Solution**:
- Regenerate the Client Secret in GitHub
- Update the environment variable in Render
- Ensure no extra spaces or characters

#### 4. CORS Errors

**Cause**: Frontend URL not in CORS origins
**Solution**:
- Backend is already configured for your Vercel URL
- If using a different domain, update CORS in `backend/app.py`

### Debug Steps

1. **Check environment variables** in Render dashboard
2. **Test OAuth config endpoint**: `https://newssummarizerdashboard.onrender.com/test-oauth-config`
3. **Check GitHub OAuth app settings** for correct URLs
4. **Review Render logs** for backend errors
5. **Check browser console** for frontend errors

## Security Best Practices

1. **Never commit** OAuth secrets to version control
2. **Use environment variables** for all sensitive data
3. **Regenerate secrets** if accidentally exposed
4. **Use HTTPS** in production (already configured)
5. **Set appropriate scopes** (currently using `user:email`)

## Additional OAuth Providers

### Google OAuth (Optional)

If you want to add Google OAuth as well:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Set authorized redirect URI: `https://newssummarizerdashboard.onrender.com/auth/callback/google`
6. Add environment variables:
   ```bash
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

## Support

If you encounter issues:

1. Check the [troubleshooting section](#troubleshooting)
2. Test the OAuth config endpoint
3. Review Render deployment logs
4. Verify GitHub OAuth app settings
5. Check environment variables in Render dashboard

---

**Note**: This setup is specifically configured for your deployed URLs. If you change domains, update both the GitHub OAuth app settings and the environment variables accordingly.
