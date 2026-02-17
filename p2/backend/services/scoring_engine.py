"""
Scoring engine - computes confidence score and generates feedback
Uses rule-based weighted formula for explainable results
"""
import numpy as np
from typing import Dict, List, Tuple

# Scoring weights (must sum to 1.0)
WEIGHTS = {
    "eye_contact": 0.25,
    "head_stability": 0.20,
    "smile": 0.10,
    "speech_rate": 0.20,
    "filler": 0.15,
    "energy_stability": 0.10
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
    Compute overall confidence score (0-100) using weighted formula
    
    Formula:
    score = 0.25 * eye_contact + 0.20 * head_stability + 0.10 * smile
            + 0.20 * speech_rate_score + 0.15 * filler_score + 0.10 * energy
    """
    # Normalize speech rate to 0-1 score
    # Optimal WPM: 120-160
    wpm = speech_metrics["speech_rate"]
    if wpm < 100:
        speech_rate_score = wpm / 100 * 0.7  # Too slow
    elif wpm <= 160:
        speech_rate_score = 1.0  # Optimal
    elif wpm <= 180:
        speech_rate_score = 1.0 - (wpm - 160) / 20 * 0.3  # Slightly fast
    else:
        speech_rate_score = 0.5 - min((wpm - 180) / 100, 0.3)  # Too fast
    
    speech_rate_score = max(0, min(1, speech_rate_score))

    # Normalize filler percentage to 0-1 score (inverse)
    filler_pct = speech_metrics["filler_percentage"]
    filler_score = max(0, 1.0 - filler_pct / 10)  # 10% filler = 0 score
    
    # Compute weighted score
    score = (
        WEIGHTS["eye_contact"] * facial_metrics["eye_contact_score"] +
        WEIGHTS["head_stability"] * facial_metrics["head_stability_score"] +
        WEIGHTS["smile"] * facial_metrics["smile_score"] +
        WEIGHTS["speech_rate"] * speech_rate_score +
        WEIGHTS["filler"] * filler_score +
        WEIGHTS["energy_stability"] * speech_metrics["energy_stability"]
    )
    
    # Convert to 0-100 scale
    confidence_score = int(score * 100)
    
    return max(0, min(100, confidence_score))

def generate_feedback(facial_metrics: Dict, speech_metrics: Dict) -> Tuple[List[str], List[str]]:
    """
    Generate explainable feedback based on rule-based analysis
    
    Returns:
        (strengths, improvements) - Lists of feedback strings
    """
    strengths = []
    improvements = []
    
    # Eye contact feedback
    if facial_metrics["eye_contact_score"] >= 0.7:
        strengths.append("Excellent eye contact - you maintained strong camera engagement")
    elif facial_metrics["eye_contact_score"] < THRESHOLDS["eye_contact_low"]:
        improvements.append("Improve eye contact by looking directly at the camera more often")
    
    # Head stability feedback
    if facial_metrics["head_stability_score"] >= 0.7:
        strengths.append("Great head stability - you appeared calm and composed")
    elif facial_metrics["head_stability_score"] < THRESHOLDS["head_stability_low"]:
        improvements.append("Try to minimize head movements to appear more confident")
    
    # Smile/expressiveness feedback
    if facial_metrics["smile_score"] >= 0.5:
        strengths.append("Good facial expressiveness - you showed positive energy")
    elif facial_metrics["smile_score"] < THRESHOLDS["smile_low"]:
        improvements.append("Show more facial expressions to appear more engaging")
    
    # Speech rate feedback
    wpm = speech_metrics["speech_rate"]
    if 120 <= wpm <= 160:
        strengths.append(f"Perfect speech rate at {int(wpm)} words per minute")
    elif wpm > THRESHOLDS["wpm_high"]:
        improvements.append(f"Slow down your speech - {int(wpm)} WPM is too fast (aim for 120-160)")
    elif wpm < THRESHOLDS["wpm_low"]:
        improvements.append(f"Speak a bit faster - {int(wpm)} WPM is too slow (aim for 120-160)")
    
    # Filler words feedback
    filler_pct = speech_metrics["filler_percentage"]
    if filler_pct < 3:
        strengths.append("Minimal filler words - very articulate speech")
    elif filler_pct > THRESHOLDS["filler_high"]:
        improvements.append(f"Reduce filler words (um, uh, like) - currently {filler_pct:.1f}% of speech")
    
    # Energy stability feedback
    if speech_metrics["energy_stability"] >= 0.7:
        strengths.append("Consistent vocal energy throughout the interview")
    elif speech_metrics["energy_stability"] < 0.5:
        improvements.append("Maintain more consistent vocal energy and volume")
    
    # Pitch variance feedback
    if speech_metrics["pitch_variance"] > THRESHOLDS["pitch_variance_high"]:
        improvements.append("Try to maintain steadier pitch to sound more confident")
    
    # Ensure we have at least some feedback
    if not strengths:
        strengths.append("You completed the interview - keep practicing to improve")
    
    if not improvements:
        improvements.append("Great job! Continue refining your interview skills")
    
    return strengths, improvements
