"""
Audio processing service using Whisper and Librosa
Extracts speech and acoustic metrics from video audio
"""
import subprocess
import os
import whisper
import librosa
import numpy as np
from typing import Dict
import re

# Load Whisper model (base model for CPU compatibility)
whisper_model = None

def get_whisper_model():
    """Lazy load Whisper model"""
    global whisper_model
    if whisper_model is None:
        whisper_model = whisper.load_model("base")
    return whisper_model

# Common filler words to detect
FILLER_WORDS = {
    "um", "uh", "like", "you know", "so", "actually", "basically",
    "literally", "right", "okay", "well", "i mean", "kind of", "sort of"
}

def process_audio(video_path: str) -> Dict:
    """
    Extract and process audio from video
    
    Returns:
        Dictionary with speech metrics:
        - speech_rate: Words per minute
        - filler_percentage: Percentage of filler words
        - pitch_mean: Average pitch in Hz
        - pitch_variance: Pitch stability metric
        - energy_stability: RMS energy variance
        - transcript: Full transcription
        - duration: Audio duration in seconds
    """
    # Extract audio from video using FFmpeg
    audio_path = video_path.replace(".mp4", ".wav").replace(".avi", ".wav")
    extract_audio(video_path, audio_path)
    
    try:
        # Transcribe audio with Whisper
        transcript_data = transcribe_audio(audio_path)
        transcript = transcript_data["text"]
        
        # Analyze speech content
        word_count, filler_count = analyze_transcript(transcript)
        
        # Load audio for acoustic analysis
        y, sr = librosa.load(audio_path, sr=None)
        duration = librosa.get_duration(y=y, sr=sr)
        
        # Compute speech rate (WPM)
        speech_rate = (word_count / duration) * 60 if duration > 0 else 0
        
        # Compute filler percentage
        filler_percentage = (filler_count / word_count * 100) if word_count > 0 else 0
        
        # Extract pitch using librosa
        pitch_mean, pitch_variance = extract_pitch(y, sr)
        
        # Compute energy stability
        energy_stability = compute_energy_stability(y)
        
        return {
            "speech_rate": float(speech_rate),
            "filler_percentage": float(filler_percentage),
            "pitch_mean": float(pitch_mean),
            "pitch_variance": float(pitch_variance),
            "energy_stability": float(energy_stability),
            "transcript": transcript,
            "duration": float(duration)
        }
    
    finally:
        # Cleanup extracted audio
        if os.path.exists(audio_path):
            os.remove(audio_path)

def extract_audio(video_path: str, audio_path: str):
    """
    Extract audio from video using FFmpeg
    """
    command = [
        "ffmpeg",
        "-i", video_path,
        "-vn",  # No video
        "-acodec", "pcm_s16le",  # PCM codec
        "-ar", "16000",  # 16kHz sample rate
        "-ac", "1",  # Mono
        "-y",  # Overwrite output
        audio_path
    ]
    
    subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

def transcribe_audio(audio_path: str) -> Dict:
    """
    Transcribe audio using Whisper
    """
    model = get_whisper_model()
    result = model.transcribe(audio_path, language="en", fp16=False)
    return result

def analyze_transcript(transcript: str) -> tuple:
    """
    Analyze transcript for word count and filler words
    
    Returns:
        (total_word_count, filler_word_count)
    """
    # Clean and tokenize
    words = re.findall(r'\b\w+\b', transcript.lower())
    total_words = len(words)
    
    # Count filler words
    filler_count = sum(1 for word in words if word in FILLER_WORDS)
    
    # Check for multi-word fillers
    text_lower = transcript.lower()
    for filler in ["you know", "i mean", "kind of", "sort of"]:
        filler_count += text_lower.count(filler)
    
    return total_words, filler_count

def extract_pitch(y: np.ndarray, sr: int) -> tuple:
    """
    Extract pitch (F0) statistics using librosa
    
    Returns:
        (mean_pitch, pitch_variance)
    """
    # Extract pitch using piptrack
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr, fmin=75, fmax=400)
    
    # Get pitch values where magnitude is highest
    pitch_values = []
    for t in range(pitches.shape[1]):
        index = magnitudes[:, t].argmax()
        pitch = pitches[index, t]
        if pitch > 0:  # Valid pitch
            pitch_values.append(pitch)
    
    if len(pitch_values) > 0:
        mean_pitch = np.mean(pitch_values)
        pitch_variance = np.var(pitch_values)
    else:
        mean_pitch = 150.0  # Default average pitch
        pitch_variance = 0.0
    
    return mean_pitch, pitch_variance

def compute_energy_stability(y: np.ndarray) -> float:
    """
    Compute RMS energy stability
    Lower variance = more stable energy = better
    """
    # Compute RMS energy per frame
    rms = librosa.feature.rms(y=y)[0]
    
    # Normalize variance to 0-1 score
    if len(rms) > 0:
        variance = np.var(rms)
        # Inverse relationship: lower variance = higher score
        stability = 1.0 / (1.0 + variance * 10)
        return np.clip(stability, 0, 1)
    
    return 0.5
