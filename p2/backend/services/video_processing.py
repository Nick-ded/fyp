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

# Frame sampling rate (process every Nth frame)
FRAME_SAMPLE_RATE = 10

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

def process_frame_facial(frame: np.ndarray) -> Optional[Dict[str, float]]:
    """
    Process single frame for live interview mode
    Returns real-time metrics or None if no face detected
    """
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
    smile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_smile.xml')
    
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    
    if len(faces) > 0:
        (x, y, w, h) = faces[0]
        face_roi_gray = gray[y:y+h, x:x+w]
        
        eyes = eye_cascade.detectMultiScale(face_roi_gray)
        smiles = smile_cascade.detectMultiScale(face_roi_gray, 1.8, 20)
        
        return {
            "eye_contact": float(min(len(eyes) / 2.0, 1.0)),
            "head_stability": 0.5,  # Can't compute from single frame
            "smile": 1.0 if len(smiles) > 0 else 0.0
        }
    
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
