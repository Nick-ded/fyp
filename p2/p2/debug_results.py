"""
Debug script to check what's in the database
"""
import sys
sys.path.append('backend')

from backend.database import SessionLocal, engine, Base
from backend.models import Interview
import json

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

# Get database session
db = SessionLocal()

# Get all interviews
interviews = db.query(Interview).all()

print("=" * 60)
print(f"Total interviews in database: {len(interviews)}")
print("=" * 60)

for interview in interviews:
    print(f"\nInterview ID: {interview.id}")
    print(f"Timestamp: {interview.timestamp}")
    print(f"Confidence Score: {interview.confidence_score}")
    print(f"\nFacial Metrics:")
    print(f"  Eye Contact: {interview.eye_contact_score}")
    print(f"  Head Stability: {interview.head_stability_score}")
    print(f"  Smile: {interview.smile_score}")
    print(f"  Face Presence: {interview.face_presence_percentage}")
    print(f"\nSpeech Metrics:")
    print(f"  Speech Rate: {interview.speech_rate} WPM")
    print(f"  Filler %: {interview.filler_percentage}%")
    print(f"  Pitch Mean: {interview.pitch_mean}")
    print(f"  Pitch Variance: {interview.pitch_variance}")
    print(f"  Energy Stability: {interview.energy_stability}")
    print(f"\nStrengths:")
    strengths = json.loads(interview.strengths) if interview.strengths else []
    for s in strengths:
        print(f"  - {s}")
    print(f"\nImprovements:")
    improvements = json.loads(interview.improvements) if interview.improvements else []
    for i in improvements:
        print(f"  - {i}")
    print(f"\nTranscript: {interview.transcript[:100] if interview.transcript else 'None'}...")
    print("-" * 60)

db.close()

print("\n" + "=" * 60)
print("If facial metrics are all 0.0, the video processing failed")
print("Check backend terminal for errors during upload")
print("=" * 60)
