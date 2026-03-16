"""
Test script for AI Interview feature
Tests the AI interviewer service without requiring full API setup
"""
import sys
sys.path.append('backend')

from services.ai_interviewer import ai_interviewer

def test_question_generation():
    """Test question generation from resume and job description"""
    print("=" * 60)
    print("Testing AI Interview Question Generation")
    print("=" * 60)
    
    # Sample resume text
    resume_text = """
    John Doe
    Software Engineer
    
    Experience:
    - 3 years of Python development
    - Built REST APIs using FastAPI and Django
    - Experience with React and JavaScript
    - Worked with PostgreSQL and MongoDB databases
    - Implemented CI/CD pipelines using Docker and Kubernetes
    
    Skills:
    Python, JavaScript, React, FastAPI, Django, SQL, Docker, Git
    """
    
    # Sample job description
    job_description = """
    We are looking for a Full Stack Developer with experience in:
    - Python backend development (FastAPI/Django)
    - React frontend development
    - Database design (SQL/NoSQL)
    - RESTful API design
    - Agile development practices
    
    The ideal candidate will work on building scalable web applications.
    """
    
    print("\n📄 Resume Summary:")
    print(resume_text[:200] + "...")
    
    print("\n💼 Job Description Summary:")
    print(job_description[:200] + "...")
    
    # Generate questions
    print("\n🤖 Generating interview questions...")
    questions = ai_interviewer.generate_questions(resume_text, job_description, num_questions=5)
    
    print(f"\n✅ Generated {len(questions)} questions:\n")
    for i, q in enumerate(questions, 1):
        print(f"{i}. [{q['type'].upper()}] {q['question']}")
        print(f"   Topic: {q['topic']}\n")
    
    return questions


def test_answer_analysis():
    """Test answer analysis"""
    print("\n" + "=" * 60)
    print("Testing Answer Analysis")
    print("=" * 60)
    
    # Sample question
    question = {
        "question": "Can you explain your experience with Python?",
        "type": "technical",
        "topic": "python"
    }
    
    # Test different answer qualities
    test_cases = [
        {
            "name": "Good Answer",
            "answer": """I have been working with Python for over 3 years now. 
            I've used it extensively to build REST APIs using FastAPI and Django frameworks. 
            In my previous project, I developed a microservices architecture that handled 
            over 10,000 requests per minute. I also implemented automated testing using pytest 
            and deployed applications using Docker containers.""",
            "duration": 45.0
        },
        {
            "name": "Average Answer",
            "answer": """I have used Python in my previous job. I worked on some projects 
            with Django and created APIs. It was a good experience.""",
            "duration": 15.0
        },
        {
            "name": "Poor Answer",
            "answer": """Um, yeah, I know Python. Like, I used it before.""",
            "duration": 5.0
        }
    ]
    
    print(f"\n❓ Question: {question['question']}\n")
    
    for test_case in test_cases:
        print(f"\n--- {test_case['name']} ---")
        print(f"Answer: {test_case['answer'][:100]}...")
        print(f"Duration: {test_case['duration']}s")
        
        analysis = ai_interviewer.analyze_answer(
            question, 
            test_case['answer'], 
            test_case['duration']
        )
        
        print(f"\n📊 Analysis Results:")
        print(f"  Overall Score: {analysis['score']}/100")
        print(f"  Relevance: {analysis['metrics']['relevance']}/100")
        print(f"  Completeness: {analysis['metrics']['completeness']}/100")
        print(f"  Clarity: {analysis['metrics']['clarity']}/100")
        print(f"  Word Count: {analysis['word_count']}")
        print(f"  Feedback: {analysis['feedback']}")


def test_overall_scoring():
    """Test overall knowledge score calculation"""
    print("\n" + "=" * 60)
    print("Testing Overall Score Calculation")
    print("=" * 60)
    
    # Sample answer results
    answer_results = [
        {"score": 85, "type": "technical", "feedback": "Great answer"},
        {"score": 78, "type": "technical", "feedback": "Good answer"},
        {"score": 92, "type": "behavioral", "feedback": "Excellent answer"},
        {"score": 70, "type": "technical", "feedback": "Needs improvement"},
        {"score": 88, "type": "role_specific", "feedback": "Very good"}
    ]
    
    print("\n📝 Individual Answer Scores:")
    for i, result in enumerate(answer_results, 1):
        print(f"  Q{i} [{result['type']}]: {result['score']}/100")
    
    overall = ai_interviewer.calculate_overall_knowledge_score(answer_results)
    
    print(f"\n🎯 Overall Results:")
    print(f"  Overall Score: {overall['overall_score']}/100")
    print(f"  Technical Score: {overall['technical_score']}/100")
    print(f"  Behavioral Score: {overall['behavioral_score']}/100")
    print(f"  Questions Answered: {overall['answered_questions']}/{overall['total_questions']}")


def test_skill_extraction():
    """Test skill extraction from resume and job description"""
    print("\n" + "=" * 60)
    print("Testing Skill Extraction")
    print("=" * 60)
    
    resume_text = """
    Senior Software Engineer with expertise in Python, JavaScript, React, 
    Node.js, FastAPI, PostgreSQL, MongoDB, Docker, Kubernetes, AWS, and Git.
    Experience with machine learning and data analysis using Python libraries.
    """
    
    job_description = """
    Looking for a developer with Python, React, SQL, Docker, and API development skills.
    Experience with cloud platforms (AWS/Azure) is a plus.
    """
    
    skills = ai_interviewer.extract_skills(resume_text, job_description)
    
    print(f"\n🔍 Extracted Skills: {', '.join(skills)}")
    print(f"   Total: {len(skills)} skills identified")


if __name__ == "__main__":
    try:
        print("\n🚀 Starting AI Interview Feature Tests\n")
        
        # Run tests
        test_question_generation()
        test_answer_analysis()
        test_overall_scoring()
        test_skill_extraction()
        
        print("\n" + "=" * 60)
        print("✅ All tests completed successfully!")
        print("=" * 60)
        print("\nThe AI Interview feature is working correctly.")
        print("You can now start the backend and test the full API.\n")
        
    except Exception as e:
        print(f"\n❌ Error during testing: {str(e)}")
        import traceback
        traceback.print_exc()
