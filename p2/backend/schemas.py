"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class FacialMetrics(BaseModel):
    """Facial analysis results"""
    eye_contact_score: float = Field(..., ge=0, le=1)
    head_stability_score: float = Field(..., ge=0, le=1)
    smile_score: float = Field(..., ge=0, le=1)
    face_presence_percentage: float = Field(..., ge=0, le=1)

class SpeechMetrics(BaseModel):
    """Speech analysis results"""
    speech_rate: float = Field(..., ge=0)
    filler_percentage: float = Field(..., ge=0, le=100)
    pitch_mean: float = Field(..., ge=0)
    pitch_variance: float = Field(..., ge=0)
    energy_stability: float = Field(..., ge=0, le=1)
    transcript: str

class AnalysisResult(BaseModel):
    """Complete analysis result"""
    confidence_score: int = Field(..., ge=0, le=100)
    strengths: List[str]
    improvements: List[str]
    facial_metrics: FacialMetrics
    speech_metrics: SpeechMetrics
    video_duration: float

class InterviewResponse(BaseModel):
    """API response for interview results"""
    id: int
    timestamp: datetime
    confidence_score: int
    strengths: List[str]
    improvements: List[str]
    facial_metrics: FacialMetrics
    speech_metrics: SpeechMetrics
    video_duration: Optional[float]
    
    class Config:
        from_attributes = True

class HistoryResponse(BaseModel):
    """Simplified response for history list"""
    id: int
    timestamp: datetime
    confidence_score: int
    
    class Config:
        from_attributes = True
