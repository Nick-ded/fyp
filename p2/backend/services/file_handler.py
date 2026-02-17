"""
File handling utilities for upload and cleanup
"""
import os
import shutil
from fastapi import UploadFile
from pathlib import Path
import uuid

UPLOAD_DIR = "uploads"
TEMP_DIR = "temp"

# Ensure directories exist
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)

async def save_upload_file(upload_file: UploadFile) -> str:
    """
    Save uploaded file to disk with unique filename
    
    Returns:
        Path to saved file
    """
    # Generate unique filename
    file_extension = Path(upload_file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    
    return file_path

def cleanup_file(file_path: str):
    """
    Delete file from disk
    """
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception as e:
        print(f"Error cleaning up file {file_path}: {e}")

def cleanup_old_files(directory: str, max_age_hours: int = 24):
    """
    Remove files older than specified hours
    Useful for periodic cleanup
    """
    import time
    current_time = time.time()
    
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        if os.path.isfile(file_path):
            file_age = current_time - os.path.getmtime(file_path)
            if file_age > max_age_hours * 3600:
                cleanup_file(file_path)
