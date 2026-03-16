"""
Quick test script to verify emotion detection is working
"""
import cv2
import numpy as np
from services.video_processing import detect_emotion_from_frame, process_frame_facial

# Test with webcam
print("Testing emotion detection...")
print("Press 'q' to quit\n")

cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Could not open webcam")
    exit()

frame_count = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    # Test every 30 frames (about once per second)
    if frame_count % 30 == 0:
        print(f"\n--- Frame {frame_count} ---")
        
        # Test facial metrics
        metrics = process_frame_facial(frame, detect_emotion=True)
        
        if metrics:
            print(f"Eye Contact: {metrics['eye_contact']:.2f}")
            print(f"Engagement: {metrics['engagement']:.2f}")
            
            if 'emotion' in metrics:
                print(f"✅ Emotion: {metrics['emotion']}")
                print(f"   Confidence: {metrics['emotion_confidence']:.1f}%")
                
                # Show top 3 emotions
                if 'all_emotions' in metrics:
                    sorted_emotions = sorted(
                        metrics['all_emotions'].items(), 
                        key=lambda x: x[1], 
                        reverse=True
                    )[:3]
                    print("   Top 3 emotions:")
                    for emotion, score in sorted_emotions:
                        print(f"     - {emotion}: {score:.1f}%")
            else:
                print("❌ No emotion detected")
        else:
            print("❌ No face detected")
    
    # Display frame
    cv2.imshow('Emotion Detection Test', frame)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
    
    frame_count += 1

cap.release()
cv2.destroyAllWindows()
print("\nTest complete!")
