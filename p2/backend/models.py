"""
SQLAlchemy ORM models for database tables
"""
from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime
from database import Base

class Interview(Base):
    """
    Interview results table
    Stores all computed metrics and scores
    """
    __tablename__ = "interviews"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Facial/behavioral metrics (0-1 normalized)
    eye_contact_score = Column(Float, nullable=False)
    head_stability_score = Column(Float, nullable=False)
    smile_score = Column(Float, nullable=False)
    face_presence_percentage = Column(Float, nullable=False)
    
    # Speech metrics
    speech_rate = Column(Float, nullable=False)  # Words per minute
    filler_percentage = Column(Float, nullable=False)  # Percentage of filler words
    pitch_mean = Column(Float, nullable=False)  # Average pitch in Hz
    pitch_variance = Column(Float, nullable=False)  # Pitch stability
    energy_stability = Column(Float, nullable=False)  # RMS energy variance
    
    # Overall confidence score (0-100)
    confidence_score = Column(Integer, nullable=False)
    
    # Feedback text (JSON stored as string)
    strengths = Column(String, nullable=True)
    improvements = Column(String, nullable=True)
    
    # Metadata
    video_duration = Column(Float, nullable=True)  # Duration in seconds
    transcript = Column(String, nullable=True)  # Full transcript
