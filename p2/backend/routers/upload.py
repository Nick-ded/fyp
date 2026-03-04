"""
Upload router - handles video file uploads and processing
"""
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
import os
import json

from database import get_db
from models import Interview
from schemas import AnalysisResult
from services.file_handler import save_upload_file, cleanup_file
from services.video_processing import process_video_facial
from services.audio_processing import process_audio
from services.scoring_engine import compute_confidence_score, generate_feedback
from utils.file_validation import FileValidator

router = APIRouter()

@router.post("/upload", response_model=dict)
async def upload_video(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload and process interview video with comprehensive validation
    Returns analysis results and stores in database
    """
    
    # Comprehensive file validation
    await FileValidator.validate_video(file)
    
    video_path = None
    audio_path = None
    
    try:
        # Save uploaded file
        video_path = await save_upload_file(file)
        
        # Additional MIME type validation on saved file
        try:
            from utils.file_validation import ALLOWED_VIDEO_TYPES
            FileValidator.validate_mime_type(video_path, ALLOWED_VIDEO_TYPES)
        except Exception as e:
            cleanup_file(video_path)
            raise HTTPException(
                status_code=400,
                detail=f"File validation failed: {str(e)}"
            )
        
        # Process video for facial metrics
        facial_metrics = process_video_facial(video_path)
        
        # Process audio for speech metrics
        speech_metrics = process_audio(video_path)
        
        # Compute confidence score
        confidence_score = compute_confidence_score(facial_metrics, speech_metrics)
        
        # Generate feedback
        strengths, improvements = generate_feedback(facial_metrics, speech_metrics)
        
        # Store in database
        interview = Interview(
            eye_contact_score=facial_metrics["eye_contact_score"],
            head_stability_score=facial_metrics["head_stability_score"],
            smile_score=facial_metrics["smile_score"],
            face_presence_percentage=facial_metrics["face_presence_percentage"],
            speech_rate=speech_metrics["speech_rate"],
            filler_percentage=speech_metrics["filler_percentage"],
            pitch_mean=speech_metrics["pitch_mean"],
            pitch_variance=speech_metrics["pitch_variance"],
            energy_stability=speech_metrics["energy_stability"],
            confidence_score=confidence_score,
            strengths=json.dumps(strengths),
            improvements=json.dumps(improvements),
            video_duration=speech_metrics.get("duration", 0),
            transcript=speech_metrics.get("transcript", "")
        )
        
        db.add(interview)
        db.commit()
        db.refresh(interview)
        
        return {
            "id": interview.id,
            "confidence_score": confidence_score,
            "strengths": strengths,
            "improvements": improvements,
            "facial_metrics": facial_metrics,
            "speech_metrics": speech_metrics
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")
    
    finally:
        # Cleanup uploaded files
        if video_path:
            cleanup_file(video_path)
        if audio_path:
            cleanup_file(audio_path)
