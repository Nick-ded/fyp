# Quick Start: Gemini API Integration

## 3-Step Setup

### Step 1: Get API Key (2 minutes)
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key

### Step 2: Configure (1 minute)
```bash
cd backend
cp .env.example .env
```

Edit `.env` and add:
```env
GEMINI_API_KEY=paste_your_key_here
```

### Step 3: Install & Run (2 minutes)
```bash
# Install the package
pip install google-generativeai

# Or reinstall all requirements
pip install -r requirements.txt

# Start the server
python main.py
```

## Verify It's Working

Look for this message when starting:
```
✓ Gemini API initialized with model: gemini-1.5-flash
```

Or run the test:
```bash
python test_gemini.py
```

## What You Get

### Enhanced Question Generation
- AI analyzes your resume and job description
- Generates personalized, relevant questions
- Mix of technical, behavioral, and role-specific

### Intelligent Answer Analysis
- Evaluates relevance, completeness, clarity
- Provides detailed scores (0-100)
- Gives constructive feedback
- Context-aware assessment

## Without API Key?

No problem! The system automatically falls back to rule-based generation. All features still work, just less sophisticated.

## Free Tier Limits

- 15 requests/minute
- 1,500 requests/day
- More than enough for personal use

## Need Help?

- Full guide: `GEMINI_SETUP.md`
- Integration details: `GEMINI_INTEGRATION.md`
- Troubleshooting: `TROUBLESHOOTING_INSTALL.md`

## Common Issues

**"Module not found"**
```bash
pip install google-generativeai
```

**"API key not valid"**
- Check for typos in .env
- Verify key is activated
- No extra spaces around the key

**"Fallback mode"**
- API key not in .env
- Restart server after adding key
- Check .env is in backend folder

## That's It!

You're ready to use AI-powered interview analysis. Start the app and try the AI Interview feature!
