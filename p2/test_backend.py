"""
Quick backend test script
Run this to check if backend can start and process videos
"""
import sys
import os

print("=" * 50)
print("Backend Diagnostic Test")
print("=" * 50)

# Test 1: Check Python environment
print("\n1. Python Environment:")
print(f"   Python: {sys.version}")
print(f"   Executable: {sys.executable}")

# Test 2: Check critical imports
print("\n2. Testing Imports:")
try:
    import cv2
    print(f"   ✓ OpenCV: {cv2.__version__}")
except Exception as e:
    print(f"   ✗ OpenCV: {e}")

try:
    import mediapipe as mp
    print(f"   ✓ MediaPipe: {mp.__version__}")
except Exception as e:
    print(f"   ✗ MediaPipe: {e}")

try:
    import fastapi
    print(f"   ✓ FastAPI: {fastapi.__version__}")
except Exception as e:
    print(f"   ✗ FastAPI: {e}")

try:
    import whisper
    print(f"   ✓ Whisper: Available")
except Exception as e:
    print(f"   ✗ Whisper: {e}")

# Test 3: Check cascade classifiers
print("\n3. Testing OpenCV Cascades:")
try:
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    if face_cascade.empty():
        print("   ✗ Face cascade failed to load")
    else:
        print("   ✓ Face cascade loaded")
except Exception as e:
    print(f"   ✗ Face cascade: {e}")

# Test 4: Check directories
print("\n4. Checking Directories:")
dirs = ['backend/uploads', 'backend/temp']
for d in dirs:
    if os.path.exists(d):
        print(f"   ✓ {d} exists")
    else:
        print(f"   ✗ {d} missing")
        try:
            os.makedirs(d, exist_ok=True)
            print(f"     Created {d}")
        except Exception as e:
            print(f"     Failed to create: {e}")

# Test 5: Check FFmpeg
print("\n5. Checking FFmpeg:")
import subprocess
try:
    result = subprocess.run(['ffmpeg', '-version'], capture_output=True, text=True, timeout=5)
    if result.returncode == 0:
        version_line = result.stdout.split('\n')[0]
        print(f"   ✓ {version_line}")
    else:
        print("   ✗ FFmpeg not working")
except Exception as e:
    print(f"   ✗ FFmpeg: {e}")

print("\n" + "=" * 50)
print("Test Complete")
print("=" * 50)
