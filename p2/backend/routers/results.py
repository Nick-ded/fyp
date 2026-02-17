"""
Results router - handles fetching interview results and history
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json

from database import get_db
from models import Interview
from schemas import InterviewResponse, HistoryResponse, FacialMetrics, SpeechMetrics

router = APIRouter()

@router.get("/results/{interview_id}", response_model=InterviewResponse)
def get_interview_result(interview_id: int, db: Session = Depends(get_db)):
    """
    Get detailed results for a specific interview
    """
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    # Parse JSON strings back to lists
    strengths = json.loads(interview.strengths) if interview.strengths else []
    improvements = json.loads(interview.improvements) if interview.improvements else []
    
    return InterviewResponse(
        id=interview.id,
        timestamp=interview.timestamp,
        confidence_score=interview.confidence_score,
        strengths=strengths,
        improvements=improvements,
        facial_metrics=FacialMetrics(
            eye_contact_score=interview.eye_contact_score,
            head_stability_score=interview.head_stability_score,
            smile_score=interview.smile_score,
            face_presence_percentage=interview.face_presence_percentage
        ),
        speech_metrics=SpeechMetrics(
            speech_rate=interview.speech_rate,
            filler_percentage=interview.filler_percentage,
            pitch_mean=interview.pitch_mean,
            pitch_variance=interview.pitch_variance,
            energy_stability=interview.energy_stability,
            transcript=interview.transcript or ""
        ),
        video_duration=interview.video_duration
    )

@router.get("/history", response_model=List[HistoryResponse])
def get_interview_history(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Get list of recent interviews
    """
    interviews = db.query(Interview)\
        .order_by(Interview.timestamp.desc())\
        .limit(limit)\
        .all()
    
    return [
        HistoryResponse(
            id=interview.id,
            timestamp=interview.timestamp,
            confidence_score=interview.confidence_score
        )
        for interview in interviews
    ]

@router.delete("/results/{interview_id}")
def delete_interview(interview_id: int, db: Session = Depends(get_db)):
    """
    Delete an interview record
    """
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    db.delete(interview)
    db.commit()
    
    return {"message": "Interview deleted successfully"}
