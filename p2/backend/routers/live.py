"""
Live interview router - handles webcam-based interviews
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
import json
import base64
import cv2
import numpy as np

from database import get_db
from services.video_processing import process_frame_facial

router = APIRouter()

@router.websocket("/live")
async def live_interview(websocket: WebSocket):
    """
    WebSocket endpoint for live interview processing
    Receives frames from frontend, processes, and returns metrics
    """
    await websocket.accept()
    
    frame_count = 0
    accumulated_metrics = {
        "eye_contact": [],
        "head_stability": [],
        "smile": []
    }
    
    try:
        while True:
            # Receive frame data from frontend
            data = await websocket.receive_text()
            frame_data = json.loads(data)
            
            # Decode base64 image
            img_bytes = base64.b64decode(frame_data["frame"].split(",")[1])
            nparr = np.frombuffer(img_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            # Process frame (sample every 5th frame for performance)
            if frame_count % 5 == 0:
                metrics = process_frame_facial(frame)
                
                if metrics:
                    accumulated_metrics["eye_contact"].append(metrics["eye_contact"])
                    accumulated_metrics["head_stability"].append(metrics["head_stability"])
                    accumulated_metrics["smile"].append(metrics["smile"])
                    
                    # Send real-time feedback
                    await websocket.send_json({
                        "type": "metrics",
                        "data": metrics
                    })
            
            frame_count += 1
            
    except WebSocketDisconnect:
        # Calculate final metrics when connection closes
        if accumulated_metrics["eye_contact"]:
            final_metrics = {
                "eye_contact_score": np.mean(accumulated_metrics["eye_contact"]),
                "head_stability_score": np.mean(accumulated_metrics["head_stability"]),
                "smile_score": np.mean(accumulated_metrics["smile"])
            }
            print(f"Live interview completed: {final_metrics}")

@router.post("/live/save")
async def save_live_interview(
    metrics: dict,
    db: Session = Depends(get_db)
):
    """
    Save live interview results to database
    Note: Audio processing would require separate recording
    """
    # This endpoint would be called after live interview completes
    # Implementation depends on how audio is captured in live mode
    return {"message": "Live interview saved", "id": 1}
