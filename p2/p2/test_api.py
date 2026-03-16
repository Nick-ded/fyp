"""
Simple API test script
Tests backend endpoints without video processing
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_root():
    """Test root endpoint"""
    print("Testing root endpoint...")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_history():
    """Test history endpoint"""
    print("Testing history endpoint...")
    response = requests.get(f"{BASE_URL}/api/history")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def main():
    print("=" * 50)
    print("AI Interview Analyzer - API Test")
    print("=" * 50)
    print()
    
    try:
        test_health()
        test_root()
        test_history()
        
        print("✅ All basic tests passed!")
        print()
        print("To test video upload:")
        print("1. Start the frontend: cd frontend && npm run dev")
        print("2. Navigate to http://localhost:5173")
        print("3. Upload a test video")
        
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to backend")
        print("Make sure the backend is running:")
        print("cd backend && uvicorn main:app --reload")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
