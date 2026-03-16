"""Quick test for Gemini API"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Check if API key is set
api_key = os.getenv("GEMINI_API_KEY")

if not api_key or api_key == "paste_your_gemini_api_key_here":
    print("❌ Gemini API key not configured")
    print("\nPlease:")
    print("1. Open backend/.env file")
    print("2. Replace 'paste_your_gemini_api_key_here' with your actual API key")
    print("3. Save and restart the server")
else:
    print("✓ Gemini API key is configured")
    print(f"  Key starts with: {api_key[:10]}...")
    
    # Try to import and initialize
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        print("✓ Gemini API initialized successfully")
        print("\nYour Gemini integration is ready!")
    except Exception as e:
        print(f"❌ Error initializing Gemini: {e}")
