"""
Video processing service using OpenCV and MediaPipe
Extracts facial behavioral metrics from video frames
"""
import cv2
import numpy as np
from typing import Dict, Optional
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

# Import DeepFace for emotion detection
try:
    from deepface import DeepFace
    DEEPFACE_AVAILABLE = True
except ImportError:
    DEEPFACE_AVAILABLE = False
    print("Warning: DeepFace not available. Emotion detection will be disabled.")

# Frame sampling rate (process every Nth frame)
FRAME_SAMPLE_RATE = 10

def detect_emotion_from_frame(frame: np.ndarray) -> Optional[Dict]:
    """
    Detect emotion from a single frame using DeepFace
    
    Returns:
        Dictionary with emotion data or None if detection fails:
        - dominant_emotion: The primary detected emotion
        - emotions: Dictionary of all emotion scores
        - confidence: Confidence score for dominant emotion
    """
    if not DEEPFACE_AVAILABLE:
        print("⚠️ DeepFace not available")
        return None
    
    try:
        # Analyze frame for emotions
        result = DeepFace.analyze(
            frame, 
            actions=['emotion'], 
            enforce_detection=False,
            silent=True
        )
        
        # DeepFace returns a list, get first result
        if isinstance(result, list) and len(result) > 0:
            result = result[0]
        
        emotion_data = {
            'dominant_emotion': result['dominant_emotion'],
            'emotions': result['emotion'],
            'confidence': result['emotion'][result['dominant_emotion']]
        }
        print(f"🎭 DeepFace result: {emotion_data['dominant_emotion']} ({emotion_data['confidence']:.1f}%)")
        return emotion_data
    except Exception as e:
        # Log the error for debugging
        print(f"❌ Emotion detection error: {str(e)}")
        return None

def process_video_facial(video_path: str) -> Dict[str, float]:
    """
    Process video file and extract facial metrics
    
    Returns:
        Dictionary with normalized scores (0-1):
        - eye_contact_score: How often eyes look at camera
        - head_stability_score: How stable head position is
        - smile_score: Frequency of smiling
        - face_presence_percentage: How often face is detected
    """
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened():
        raise ValueError("Could not open video file")
    
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    
    # Metrics accumulators
    eye_contact_scores = []
    head_positions = []
    smile_scores = []
    face_detected_count = 0
    processed_frames = 0
    
    # Simplified face detection using OpenCV (MediaPipe v0.10+ has different API)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
    smile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_smile.xml')
    
    frame_idx = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        # Sample frames for performance
        if frame_idx % FRAME_SAMPLE_RATE != 0:
            frame_idx += 1
            continue
        
        processed_frames += 1
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Detect faces
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        
        if len(faces) > 0:
            face_detected_count += 1
            (x, y, w, h) = faces[0]  # Use first face
            
            # Extract face region
            face_roi_gray = gray[y:y+h, x:x+w]
            face_roi_color = frame[y:y+h, x:x+w]
            
            # Detect eyes
            eyes = eye_cascade.detectMultiScale(face_roi_gray)
            eye_score = min(len(eyes) / 2.0, 1.0)  # Normalize to 0-1
            eye_contact_scores.append(eye_score)
            
            # Detect smile
            smiles = smile_cascade.detectMultiScale(face_roi_gray, 1.8, 20)
            smile_score = 1.0 if len(smiles) > 0 else 0.0
            smile_scores.append(smile_score)
            
            # Head position (center of face)
            head_center = np.array([x + w/2, y + h/2])
            head_positions.append(head_center)
        
        frame_idx += 1
    
    cap.release()
    
    # Compute final metrics
    face_presence = face_detected_count / processed_frames if processed_frames > 0 else 0
    
    eye_contact_score = np.mean(eye_contact_scores) if eye_contact_scores else 0.0
    
    # Head stability: lower variance = more stable
    head_stability_score = compute_stability(head_positions) if head_positions else 0.0
    
    smile_score = np.mean(smile_scores) if smile_scores else 0.0
    
    return {
        "eye_contact_score": float(np.clip(eye_contact_score, 0, 1)),
        "head_stability_score": float(np.clip(head_stability_score, 0, 1)),
        "smile_score": float(np.clip(smile_score, 0, 1)),
        "face_presence_percentage": float(np.clip(face_presence, 0, 1))
    }

def process_frame_facial(frame: np.ndarray, detect_emotion: bool = False) -> Optional[Dict[str, float]]:
    """
    Process single frame for live interview mode with enhanced accuracy
    Returns real-time metrics or None if no face detected
    
    Args:
        frame: Input video frame
        detect_emotion: Whether to run emotion detection (slower, run less frequently)
    """
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
    smile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_smile.xml')
    
    # Convert to grayscale and apply histogram equalization for better detection
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    gray = cv2.equalizeHist(gray)
    
    # Detect faces with more sensitive parameters
    faces = face_cascade.detectMultiScale(
        gray, 
        scaleFactor=1.1,  # More sensitive
        minNeighbors=4,   # Lower threshold for better detection
        minSize=(80, 80)  # Minimum face size
    )
    
    if len(faces) > 0:
        # Use the largest face (closest to camera)
        (x, y, w, h) = max(faces, key=lambda f: f[2] * f[3])
        face_roi_gray = gray[y:y+h, x:x+w]
        face_roi_color = frame[y:y+h, x:x+w]
        
        # Enhanced eye detection
        eyes = eye_cascade.detectMultiScale(
            face_roi_gray,
            scaleFactor=1.1,
            minNeighbors=3,
            minSize=(20, 20)
        )
        
        # Calculate eye contact score based on eye detection quality
        # Both eyes detected = 1.0, one eye = 0.7, no eyes = 0.3
        if len(eyes) >= 2:
            eye_contact_score = 1.0
        elif len(eyes) == 1:
            eye_contact_score = 0.7
        else:
            eye_contact_score = 0.3  # Face detected but eyes not clear
        
        # Enhanced smile detection with multiple scales
        smiles = smile_cascade.detectMultiScale(
            face_roi_gray,
            scaleFactor=1.5,
            minNeighbors=15,
            minSize=(25, 25)
        )
        
        # Calculate engagement score (smile + facial positioning)
        smile_score = 1.0 if len(smiles) > 0 else 0.0
        
        # Calculate face centering (better engagement when centered)
        frame_center_x = frame.shape[1] / 2
        frame_center_y = frame.shape[0] / 2
        face_center_x = x + w / 2
        face_center_y = y + h / 2
        
        # Distance from center (normalized)
        center_distance = np.sqrt(
            ((face_center_x - frame_center_x) / frame.shape[1]) ** 2 +
            ((face_center_y - frame_center_y) / frame.shape[0]) ** 2
        )
        centering_score = max(0, 1.0 - center_distance * 2)
        
        # Calculate face size ratio (optimal engagement at 20-40% of frame)
        face_area_ratio = (w * h) / (frame.shape[0] * frame.shape[1])
        if 0.15 <= face_area_ratio <= 0.45:
            size_score = 1.0
        elif face_area_ratio < 0.15:
            size_score = face_area_ratio / 0.15  # Too far
        else:
            size_score = max(0, 1.0 - (face_area_ratio - 0.45) / 0.3)  # Too close
        
        # Combined engagement score
        engagement_score = (centering_score * 0.4 + size_score * 0.3 + smile_score * 0.3)
        
        result = {
            "eye_contact": float(eye_contact_score),
            "head_stability": float(centering_score),  # Use centering as proxy for stability
            "smile": float(smile_score),
            "engagement": float(engagement_score),
            "face_size_ratio": float(face_area_ratio),
            "centering": float(centering_score)
        }
        
        # Detect emotion from frame only if requested (slower operation)
        if detect_emotion:
            emotion_data = detect_emotion_from_frame(frame)
            if emotion_data:
                result["emotion"] = emotion_data["dominant_emotion"]
                result["emotion_confidence"] = emotion_data["confidence"]
                result["all_emotions"] = emotion_data["emotions"]
        
        return result
    
    return None

def compute_stability(positions: list) -> float:
    """
    Compute stability score from position variance
    Lower variance = higher stability
    """
    if len(positions) < 2:
        return 0.5
    
    positions_array = np.array(positions)
    variance = np.var(positions_array, axis=0).mean()
    
    # Normalize variance to 0-1 score (inverse relationship)
    # Typical variance range for pixel positions: 100 to 10000
    stability = 1.0 / (1.0 + variance / 1000)
    
    return stability
