# Gemini API Setup Guide

This guide will help you set up Google Gemini API for AI-powered interview question generation and answer analysis.

## Step 1: Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

## Step 2: Configure Your Application

### Option 1: Using .env file (Recommended)

1. Navigate to the `backend` folder
2. Create a `.env` file (or copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. Open `.env` and add your API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   GEMINI_MODEL=gemini-1.5-flash
   ```

### Option 2: Using Environment Variables

Set the environment variable directly:

**Windows (CMD):**
```cmd
set GEMINI_API_KEY=your_actual_api_key_here
```

**Windows (PowerShell):**
```powershell
$env:GEMINI_API_KEY="your_actual_api_key_here"
```

**Linux/Mac:**
```bash
export GEMINI_API_KEY=your_actual_api_key_here
```

## Step 3: Install Required Package

The Gemini package is already in requirements.txt. Install it:

```bash
cd backend
pip install google-generativeai
```

Or install all requirements:
```bash
pip install -r requirements.txt
```

## Step 4: Verify Setup

Start your backend server:
```bash
cd backend
python main.py
```

Look for this message in the console:
```
✓ Gemini API initialized with model: gemini-1.5-flash
```

If you see this instead:
```
⚠ No Gemini API key found. Using rule-based fallback.
```

Then your API key is not configured correctly.

## Features Powered by Gemini

### 1. Question Generation
- Analyzes resume and job description
- Generates relevant technical, behavioral, and role-specific questions
- Tailored to candidate's experience and job requirements

### 2. Answer Analysis
- Evaluates answer relevance, completeness, and clarity
- Provides detailed scoring (0-100)
- Generates constructive feedback
- Assesses knowledge depth

### 3. Overall Knowledge Score
- Calculates comprehensive performance metrics
- Breaks down technical vs behavioral performance
- Provides actionable insights

## Fallback Behavior

If Gemini API is not configured or fails:
- The system automatically falls back to rule-based generation
- Basic functionality is maintained
- No errors or crashes occur

## API Models Available

- `gemini-1.5-flash` (Default) - Fast and efficient
- `gemini-1.5-pro` - More capable, slower
- `gemini-pro` - Previous generation

Change the model in `.env`:
```env
GEMINI_MODEL=gemini-1.5-pro
```

## Pricing

- Gemini API has a generous free tier
- Check current pricing: https://ai.google.dev/pricing
- Free tier includes:
  - 15 requests per minute
  - 1 million tokens per minute
  - 1,500 requests per day

## Troubleshooting

### Error: "API key not valid"
- Verify your API key is correct
- Check if the API key has been activated
- Ensure no extra spaces in the .env file

### Error: "Module 'google.generativeai' not found"
```bash
pip install google-generativeai
```

### Error: "Quota exceeded"
- You've hit the free tier limit
- Wait for the quota to reset (usually 1 minute)
- Consider upgrading to paid tier

### Fallback Mode Activating
- Check if GEMINI_API_KEY is set in .env
- Verify the .env file is in the backend folder
- Restart the backend server after adding the key

## Testing the Integration

1. Start the backend server
2. Go to AI Interview section in the frontend
3. Upload a resume and job description
4. Click "Generate Questions"
5. Check the console for Gemini API logs

## Security Best Practices

1. Never commit your `.env` file to git
2. Keep your API key secret
3. Use environment variables in production
4. Rotate API keys periodically
5. Monitor API usage in Google AI Studio

## Support

- Google AI Documentation: https://ai.google.dev/docs
- API Reference: https://ai.google.dev/api
- Community Forum: https://discuss.ai.google.dev/
