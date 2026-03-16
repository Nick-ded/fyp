"""
Scoring engine - computes confidence score and generates feedback
Uses rule-based weighted formula for explainable results
"""
import numpy as np
from typing import Dict, List, Tuple

# Scoring weights (must sum to 1.0)
# Enhanced weights for more accurate confidence assessment
WEIGHTS = {
    "eye_contact": 0.20,        # Direct camera engagement
    "head_stability": 0.15,     # Composure and steadiness
    "engagement": 0.15,         # Overall presence (smile, positioning)
    "speech_rate": 0.15,        # Speaking pace
    "filler": 0.15,             # Clarity (reduced filler words)
    "energy_stability": 0.10,   # Vocal consistency
    "clarity": 0.10             # Speech articulation
}

# Thresholds for feedback rules
THRESHOLDS = {
    "eye_contact_low": 0.5,
    "head_stability_low": 0.6,
    "smile_low": 0.3,
    "wpm_high": 180,
    "wpm_low": 100,
    "filler_high": 5.0,
    "pitch_variance_high": 1000
}

def compute_confidence_score(facial_metrics: Dict, speech_metrics: Dict) -> int:
    """
    Compute overall confidence score (0-100) using enhanced weighted formula
    Returns 0 if insufficient face presence detected
    
    Enhanced Formula considers:
    - Eye contact (20%): Direct camera engagement
    - Head stability (15%): Physical composure
    - Engagement (15%): Facial expressions and positioning
    - Speech rate (15%): Optimal pacing
    - Filler words (15%): Speech clarity
    - Energy stability (10%): Vocal consistency
    - Clarity (10%): Overall articulation
    """
    # Check face presence - must be detected in at least 50% of frames
    face_presence = facial_metrics.get("face_presence_percentage", 0)
    if face_presence < 0.5:
        print(f"WARNING: Insufficient face presence ({face_presence*100:.1f}%) - returning score of 0")
        return 0
    
    # Normalize speech rate to 0-1 score
    # Optimal WPM: 120-160 (conversational pace)
    wpm = speech_metrics.get("speech_rate", 0)
    if wpm < 80:
        speech_rate_score = wpm / 80 * 0.5  # Very slow
    elif wpm < 100:
        speech_rate_score = 0.5 + (wpm - 80) / 20 * 0.3  # Slow
    elif wpm <= 160:
        speech_rate_score = 0.8 + (wpm - 100) / 60 * 0.2  # Optimal range
    elif wpm <= 180:
        speech_rate_score = 1.0 - (wpm - 160) / 20 * 0.2  # Slightly fast
    else:
        speech_rate_score = max(0.4, 0.8 - (wpm - 180) / 100)  # Too fast
    
    speech_rate_score = max(0, min(1, speech_rate_score))

    # Normalize filler percentage to 0-1 score (inverse)
    # Excellent: <2%, Good: 2-5%, Fair: 5-8%, Poor: >8%
    filler_pct = speech_metrics.get("filler_percentage", 0)
    if filler_pct < 2:
        filler_score = 1.0
    elif filler_pct < 5:
        filler_score = 1.0 - (filler_pct - 2) / 3 * 0.2
    elif filler_pct < 8:
        filler_score = 0.8 - (filler_pct - 5) / 3 * 0.3
    else:
        filler_score = max(0, 0.5 - (filler_pct - 8) / 10)
    
    # Clarity score based on energy stability and pitch variance
    energy = speech_metrics.get("energy_stability", 0.5)
    pitch_var = speech_metrics.get("pitch_variance", 0)
    
    # Lower pitch variance = better clarity (more controlled speech)
    pitch_clarity = max(0, 1.0 - pitch_var / 2000)
    clarity_score = (energy * 0.6 + pitch_clarity * 0.4)
    
    # Get engagement score (combination of smile, positioning, face size)
    engagement_score = facial_metrics.get("engagement_score", 
                                         facial_metrics.get("smile_score", 0.5))
    
    # Apply face presence penalty if less than 90%
    presence_multiplier = min(1.0, face_presence / 0.9)
    
    # Compute weighted score
    score = (
        WEIGHTS["eye_contact"] * facial_metrics.get("eye_contact_score", 0) +
        WEIGHTS["head_stability"] * facial_metrics.get("head_stability_score", 0) +
        WEIGHTS["engagement"] * engagement_score +
        WEIGHTS["speech_rate"] * speech_rate_score +
        WEIGHTS["filler"] * filler_score +
        WEIGHTS["energy_stability"] * speech_metrics.get("energy_stability", 0.5) +
        WEIGHTS["clarity"] * clarity_score
    )
    
    # Apply presence multiplier
    score = score * presence_multiplier
    
    # Convert to 0-100 scale
    confidence_score = int(score * 100)
    
    print(f"Confidence calculation: face_presence={face_presence*100:.1f}%, raw_score={score*100:.1f}, final_score={confidence_score}")
    
    return max(0, min(100, confidence_score))

def generate_feedback(facial_metrics: Dict, speech_metrics: Dict) -> Tuple[List[str], List[str]]:
    """
    Generate explainable feedback based on enhanced rule-based analysis
    
    Returns:
        (strengths, improvements) - Lists of feedback strings
    """
    strengths = []
    improvements = []
    
    # Check face presence first
    face_presence = facial_metrics.get("face_presence_percentage", 0)
    
    if face_presence < 0.5:
        improvements.append(
            f"⚠️ CRITICAL: Your face was only detected in {face_presence*100:.0f}% of frames. "
            "Ensure your camera is not blocked, improve lighting, and position yourself clearly in frame. "
            "Without proper face detection, visual metrics cannot be accurately assessed."
        )
        # Still provide speech feedback if available
        wpm = speech_metrics.get("speech_rate", 0)
        if wpm > 0:
            improvements.append("Focus on improving camera visibility for your next attempt.")
    elif face_presence < 0.8:
        improvements.append(
            f"Face detection was inconsistent ({face_presence*100:.0f}% of frames). "
            "Try to stay centered in frame and ensure consistent lighting for more accurate scoring."
        )
    
    # Only provide detailed facial feedback if face presence is adequate
    if face_presence >= 0.5:
        # Eye contact feedback (Confidence indicator)
        eye_contact = facial_metrics.get("eye_contact_score", 0)
        if eye_contact >= 0.8:
            strengths.append("Outstanding eye contact - you maintained excellent camera engagement throughout")
        elif eye_contact >= 0.6:
            strengths.append("Good eye contact - you showed strong camera awareness")
        elif eye_contact < THRESHOLDS["eye_contact_low"]:
            improvements.append("Improve eye contact by looking directly at the camera more consistently")
        
        # Head stability feedback (Confidence indicator)
        stability = facial_metrics.get("head_stability_score", 0)
        if stability >= 0.75:
            strengths.append("Excellent composure - you appeared calm and professionally poised")
        elif stability >= 0.6:
            strengths.append("Good head stability - you maintained steady positioning")
        elif stability < THRESHOLDS["head_stability_low"]:
            improvements.append("Minimize excessive head movements to project more confidence")
        
        # Engagement feedback (combination of smile, positioning, presence)
        engagement = facial_metrics.get("engagement_score", facial_metrics.get("smile_score", 0))
        if engagement >= 0.7:
            strengths.append("Great engagement - your expressions and presence were very positive")
        elif engagement >= 0.5:
            strengths.append("Good facial expressiveness - you showed appropriate energy")
        elif engagement < 0.4:
            improvements.append("Show more natural expressions and maintain better frame positioning for higher engagement")
    
    # Speech rate feedback (Clarity indicator) - always provide if available
    wpm = speech_metrics.get("speech_rate", 0)
    if wpm > 0:
        if 120 <= wpm <= 160:
            strengths.append(f"Perfect speech rate at {int(wpm)} words per minute - very clear and easy to follow")
        elif 100 <= wpm < 120:
            strengths.append(f"Good speech rate at {int(wpm)} WPM - consider speaking slightly faster")
        elif wpm > THRESHOLDS["wpm_high"]:
            improvements.append(f"Slow down your speech - {int(wpm)} WPM is too fast (aim for 120-160 WPM)")
        elif wpm < THRESHOLDS["wpm_low"]:
            improvements.append(f"Increase your speech pace - {int(wpm)} WPM is too slow (aim for 120-160 WPM)")
    
    # Filler words feedback (Clarity indicator)
    filler_pct = speech_metrics.get("filler_percentage", 0)
    if filler_pct < 2:
        strengths.append("Excellent clarity - minimal filler words, very articulate speech")
    elif filler_pct < 3:
        strengths.append("Very good clarity - low use of filler words")
    elif filler_pct > THRESHOLDS["filler_high"]:
        improvements.append(f"Reduce filler words (um, uh, like) - currently {filler_pct:.1f}% of speech")
    elif filler_pct > 3:
        improvements.append(f"Work on reducing filler words to improve clarity (currently {filler_pct:.1f}%)")
    
    # Energy stability feedback (Clarity indicator)
    energy = speech_metrics.get("energy_stability", 0.5)
    if energy >= 0.75:
        strengths.append("Excellent vocal consistency - you maintained steady energy throughout")
    elif energy >= 0.6:
        strengths.append("Good vocal energy - consistent volume and projection")
    elif energy < 0.5:
        improvements.append("Maintain more consistent vocal energy and volume for better clarity")
    
    # Pitch variance feedback (Clarity indicator)
    pitch_var = speech_metrics.get("pitch_variance", 0)
    if pitch_var > THRESHOLDS["pitch_variance_high"]:
        improvements.append("Try to maintain steadier pitch to sound more confident and clear")
    elif pitch_var < 500 and pitch_var > 0:
        strengths.append("Great pitch control - your voice sounded steady and confident")
    
    # Face presence feedback
    if face_presence >= 0.9:
        strengths.append("Excellent camera presence - you stayed in frame throughout the interview")
    elif face_presence >= 0.8:
        strengths.append("Good camera presence - mostly stayed in frame")
    
    # Ensure we have at least some feedback
    if not strengths:
        if face_presence < 0.5:
            strengths.append("You attempted the interview - focus on camera setup for next time")
        else:
            strengths.append("You completed the interview - keep practicing to build your skills")
    
    if not improvements:
        if face_presence >= 0.8:
            improvements.append("Excellent performance! Continue refining your interview technique")
        else:
            improvements.append("Focus on maintaining consistent camera visibility for accurate assessment")
    
    return strengths, improvements
