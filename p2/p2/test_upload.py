"""
Quick test script to diagnose upload issues
"""
import requests
import sys

def test_backend():
    """Test if backend is accessible"""
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        print(f"✅ Backend Health: {response.status_code} - {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Backend not accessible: {e}")
        return False

def test_upload_endpoint():
    """Test upload endpoint with a small test"""
    try:
        # Test with empty request to see error message
        response = requests.post("http://localhost:8000/api/upload", timeout=5)
        print(f"Upload endpoint response: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"❌ Upload test failed: {e}")

if __name__ == "__main__":
    print("=" * 50)
    print("Backend Upload Diagnostics")
    print("=" * 50)
    
    if test_backend():
        print("\n" + "=" * 50)
        test_upload_endpoint()
    else:
        print("\n⚠️  Backend is not running!")
        print("Start it with: cd backend && venv\\Scripts\\activate && uvicorn main:app --reload")
