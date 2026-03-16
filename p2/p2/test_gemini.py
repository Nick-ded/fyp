"""
Test script to verify Gemini API integration
Run this to check if your API key is working correctly
"""
import os
import sys

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from services.ai_interviewer import ai_interviewer

def test_gemini_setup():
    """Test if Gemini API is configured correctly"""
    print("=" * 60)
    print("Testing Gemini API Integration")
    print("=" * 60)
    
    # Check if API is initialized
    if ai_interviewer.use_gemini:
        print("✓ Gemini API is configured")
        print(f"  Model: {ai_interviewer.model._model_name if hasattr(ai_interviewer.model, '_model_name') else 'Unknown'}")
    else:
        print("✗ Gemini API is NOT configured")
        print("  Using rule-based fallback")
        print("\nTo enable Gemini API:")
        print("1. Get API key from: https://makersuite.google.com/app/apikey")
        print("2. Add to backend/.env: GEMINI_API_KEY=your_key_here")
        print("3. Restart the application")
        return False
    
    print("\n" + "-" * 60)
    print("Testing Question Generation...")
    print("-" * 60)
    
    # Test question generation
    sample_resume = """
    John Doe
    Software Engineer
    
    Skills: Python, JavaScript, React, FastAPI, SQL
    Experience: 3 years in web development
    """
    
    sample_job = """
    Looking for a Full Stack Developer with experience in 
    Python, React, and REST APIs. Must have strong problem-solving skills.
    """
    
    try:
        questions = ai_interviewer.generate_questions(sample_resume, sample_job, 3)
        print(f"✓ Generated {len(questions)} questions")
        for i, q in enumerate(questions, 1):
            print(f"\n{i}. {q['question']}")
            print(f"   Type: {q['type']}, Topic: {q.get('topic', 'N/A')}")
    except Exception as e:
        print(f"✗ Question generation failed: {e}")
        return False
    
    print("\n" + "-" * 60)
    print("Testing Answer Analysis...")
    print("-" * 60)
    
    # Test answer analysis
    test_question = {
        "question": "Can you explain your experience with Python?",
        "type": "technical",
        "topic": "python"
    }
    
    test_answer = """
    I have been working with Python for 3 years. I've used it to build 
    web applications with FastAPI and Django. I've also worked on data 
    processing scripts and automation tools. In my last project, I 
    developed a REST API that handled over 10,000 requests per day.
    """
    
    try:
        analysis = ai_interviewer.analyze_answer(test_question, test_answer, 30.0)
        print(f"✓ Answer analyzed successfully")
        print(f"\n  Overall Score: {analysis['score']}/100")
        print(f"  Relevance: {analysis['metrics']['relevance']}/100")
        print(f"  Completeness: {analysis['metrics']['completeness']}/100")
        print(f"  Clarity: {analysis['metrics']['clarity']}/100")
        print(f"\n  Feedback: {analysis['feedback']}")
    except Exception as e:
        print(f"✗ Answer analysis failed: {e}")
        return False
    
    print("\n" + "=" * 60)
    print("✓ All tests passed! Gemini API is working correctly.")
    print("=" * 60)
    return True

if __name__ == "__main__":
    try:
        success = test_gemini_setup()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n✗ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
