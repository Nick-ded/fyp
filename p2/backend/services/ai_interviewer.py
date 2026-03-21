"""
AI Interviewer Service
Generates interview questions based on resume and job description
Analyzes candidate answers for knowledge assessment using Google Gemini API
"""
import re
import json
import random
from typing import List, Dict, Tuple
import PyPDF2
import docx
from io import BytesIO
import os

# Try to import Gemini - handle both old and new packages
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    try:
        from google import genai
        GEMINI_AVAILABLE = True
    except ImportError:
        GEMINI_AVAILABLE = False
        genai = None

from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key from environment
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

# For now, using rule-based approach. Can be upgraded to use OpenAI/Anthropic/Ollama
# To use LLM APIs, add API keys to .env and uncomment the relevant sections

class AIInterviewer:
    """Handles question generation and answer analysis using Gemini API"""
    
    def __init__(self):
        # Configure Gemini API
        self.use_gemini = GEMINI_AVAILABLE and bool(GEMINI_API_KEY) and GEMINI_API_KEY != "paste_your_gemini_api_key_here"
        if self.use_gemini:
            try:
                genai.configure(api_key=GEMINI_API_KEY)
                self.model = genai.GenerativeModel(GEMINI_MODEL)
                print(f"✓ Gemini API initialized with model: {GEMINI_MODEL}")
            except Exception as e:
                print(f"⚠ Failed to initialize Gemini API: {e}")
                self.use_gemini = False
                self.model = None
        else:
            if not GEMINI_AVAILABLE:
                print("⚠ Gemini package not installed. Using rule-based fallback.")
            elif not GEMINI_API_KEY or GEMINI_API_KEY == "paste_your_gemini_api_key_here":
                print("⚠ No Gemini API key found. Using rule-based fallback.")
            self.model = None
        
        # Fallback question templates for when API is not available
        self.question_templates = {
            "technical": [
                "Can you explain your experience with {skill}?",
                "How have you used {skill} in your previous projects?",
                "What challenges did you face while working with {skill}?",
                "Describe a project where you implemented {skill}.",
            ],
            "behavioral": [
                "Tell me about a time when you {situation}.",
                "How do you handle {situation}?",
                "Describe your approach to {situation}.",
            ],
            "role_specific": [
                "Why are you interested in this {role} position?",
                "What makes you a good fit for {role}?",
                "How does your experience align with {role} requirements?",
            ]
        }

        # Pre-generated 50-question bank per role for free interview mode
        self.role_question_bank = {
            "frontend developer": [
                "What is the difference between let, const, and var in JavaScript?",
                "Explain the concept of closures in JavaScript and provide an example.",
                "How does event delegation work in JavaScript?",
                "What are ES6 arrow functions and how do they differ from regular functions?",
                "Describe the React component lifecycle methods.",
                "What is the virtual DOM in React and how does it improve performance?",
                "How do you manage state in a React application?",
                "Explain the difference between controlled and uncontrolled components in React.",
                "What are React hooks and how do they change the way we write components?",
                "How do you optimize React application performance?",
                "What is the difference between inline, internal, and external CSS?",
                "Explain CSS specificity and how it's calculated.",
                "What are CSS preprocessors like Sass and why would you use them?",
                "How do you create responsive web designs?",
                "What is the CSS box model?",
                "Explain the difference between flexbox and CSS grid.",
                "How do you handle browser compatibility issues in frontend development?",
                "What are Progressive Web Apps (PWAs) and their key features?",
                "How do you implement lazy loading for images and components?",
                "What are Web Components and how do they work?",
                "Explain the concept of single-page applications (SPAs).",
                "How do you manage routing in a single-page application?",
                "What are the benefits and drawbacks of using a frontend framework?",
                "How do you handle form validation in React?",
                "What is the difference between client-side and server-side rendering?",
                "Explain the concept of state management in frontend applications.",
                "How do you implement authentication in a frontend application?",
                "What are the different ways to style React components?",
                "How do you handle API calls in a React application?",
                "What is the purpose of package.json in a Node.js project?",
                "How do you manage dependencies in a frontend project?",
                "What are the different build tools available for frontend development?",
                "How do you set up a development environment for frontend development?",
                "What are the best practices for writing clean and maintainable CSS?",
                "How do you implement accessibility (a11y) in web applications?",
                "What are the different types of storage available in browsers?",
                "How do you handle errors and exceptions in JavaScript?",
                "What is the event loop in JavaScript?",
                "Explain the concept of promises and async/await in JavaScript.",
                "How do you optimize website loading speed?",
                "What are the different ways to handle cross-origin requests?",
                "How do you implement internationalization (i18n) in a web application?",
                "What are the security considerations for frontend applications?",
                "How do you implement testing in a frontend application?",
                "What are the different types of CSS animations and transitions?",
                "How do you handle browser storage limitations?",
                "What is the difference between cookies, localStorage, and sessionStorage?",
                "How do you implement real-time features in a web application?",
                "What are the best practices for mobile-first responsive design?",
                "How do you handle memory leaks in JavaScript applications?",
                "What is the role of TypeScript in frontend development?",
                "How do you implement code splitting in a web application?"
            ],
            "backend developer": [
                "What is the difference between REST and GraphQL APIs?",
                "How do you design scalable database schemas?",
                "Explain the concept of database normalization.",
                "What are the differences between SQL and NoSQL databases?",
                "How do you implement authentication and authorization in a web application?",
                "What is the difference between synchronous and asynchronous programming?",
                "How do you handle database connections in a web application?",
                "Explain the concept of middleware in web frameworks.",
                "What are the different types of HTTP status codes?",
                "How do you implement caching in a web application?",
                "What is the difference between stateless and stateful applications?",
                "How do you handle file uploads in a web application?",
                "Explain the concept of database transactions.",
                "What are the different types of database indexes and when to use them?",
                "How do you implement logging in a web application?",
                "What is the difference between unit testing and integration testing?",
                "How do you handle database migrations?",
                "Explain the concept of dependency injection.",
                "What are the different types of web servers and their use cases?",
                "How do you implement rate limiting in an API?",
                "What is the difference between monolithic and microservices architecture?",
                "How do you handle database backups and recovery?",
                "Explain the concept of database sharding.",
                "What are the different types of caching strategies?",
                "How do you implement background job processing?",
                "What is the difference between HTTP and HTTPS?",
                "How do you handle cross-origin resource sharing (CORS)?",
                "Explain the concept of database connection pooling.",
                "What are the different types of authentication methods?",
                "How do you implement API versioning?",
                "What is the difference between SOAP and REST?",
                "How do you handle database query optimization?",
                "Explain the concept of database replication.",
                "What are the different types of load balancing techniques?",
                "How do you implement error handling in APIs?",
                "What is the difference between cookies and sessions?",
                "How do you handle database schema changes in production?",
                "Explain the concept of database indexing strategies.",
                "What are the different types of web application firewalls?",
                "How do you implement API documentation?",
                "What is the difference between horizontal and vertical scaling?",
                "How do you handle database deadlocks?",
                "Explain the concept of database partitioning.",
                "What are the different types of message queues?",
                "How do you implement distributed caching?",
                "What is the difference between TCP and UDP?",
                "How do you handle API rate limiting and throttling?",
                "Explain the concept of database views and stored procedures.",
                "What are the different types of database backup strategies?",
                "How do you implement multi-tenant applications?",
                "What is the difference between eager and lazy loading?",
                "How do you handle database connection leaks?"
            ],
            "software developer": [
                "What is the software development lifecycle (SDLC)?",
                "Explain the difference between agile and waterfall methodologies.",
                "What are the principles of object-oriented programming?",
                "How do you handle version control in a team environment?",
                "What is the difference between compiled and interpreted languages?",
                "How do you implement error handling and exception management?",
                "Explain the concept of design patterns and their importance.",
                "What are the different types of testing methodologies?",
                "How do you optimize code performance?",
                "What is the difference between threads and processes?",
                "How do you implement logging and monitoring in applications?",
                "Explain the concept of code refactoring.",
                "What are the different types of data structures and their use cases?",
                "How do you handle memory management in different programming languages?",
                "What is the difference between unit testing and integration testing?",
                "How do you implement security best practices in software development?",
                "Explain the concept of continuous integration and continuous deployment (CI/CD).",
                "What are the different types of software architecture patterns?",
                "How do you handle database design and optimization?",
                "What is the difference between functional and object-oriented programming?",
                "How do you implement internationalization and localization?",
                "Explain the concept of code reviews and their importance.",
                "What are the different types of algorithms and their complexities?",
                "How do you handle concurrent programming?",
                "What is the difference between monolithic and microservices architecture?",
                "How do you implement API design and documentation?",
                "Explain the concept of dependency management.",
                "What are the different types of software licenses?",
                "How do you handle software deployment and rollback strategies?",
                "What is the difference between frontend and backend development?",
                "How do you implement user authentication and authorization?",
                "Explain the concept of software testing pyramid.",
                "What are the different types of databases and their use cases?",
                "How do you handle software scalability and performance?",
                "What is the difference between synchronous and asynchronous communication?",
                "How do you implement caching strategies?",
                "Explain the concept of software modularity.",
                "What are the different types of software development environments?",
                "How do you handle software documentation?",
                "What is the difference between open-source and proprietary software?",
                "How do you implement software monitoring and alerting?",
                "Explain the concept of software architecture evolution.",
                "What are the different types of software development tools?",
                "How do you handle software project management?",
                "What is the difference between agile and scrum methodologies?",
                "How do you implement software quality assurance?",
                "Explain the concept of software maintenance and support.",
                "What are the different types of software bugs and their severity?",
                "How do you handle software version control and branching strategies?",
                "What is the difference between compiled and interpreted languages performance?",
                "How do you implement software security testing?"
            ],
            "ai/ml engineer": [
                "What is the difference between supervised and unsupervised learning?",
                "How do you handle overfitting in machine learning models?",
                "Explain the concept of gradient descent and its variants.",
                "What are the different types of neural networks?",
                "How do you evaluate the performance of a machine learning model?",
                "What is the difference between classification and regression problems?",
                "How do you handle imbalanced datasets?",
                "Explain the concept of feature engineering.",
                "What are the different types of activation functions in neural networks?",
                "How do you implement cross-validation?",
                "What is the difference between bagging and boosting?",
                "How do you handle missing data in datasets?",
                "Explain the concept of regularization in machine learning.",
                "What are the different types of loss functions?",
                "How do you implement dimensionality reduction?",
                "What is the difference between parametric and non-parametric models?",
                "How do you handle model deployment and serving?",
                "Explain the concept of transfer learning.",
                "What are the different types of optimization algorithms?",
                "How do you implement hyperparameter tuning?",
                "What is the difference between batch and online learning?",
                "How do you handle model interpretability?",
                "Explain the concept of ensemble learning.",
                "What are the different types of clustering algorithms?",
                "How do you implement recommendation systems?",
                "What is the difference between deep learning and traditional machine learning?",
                "How do you handle time series data?",
                "Explain the concept of natural language processing.",
                "What are the different types of computer vision techniques?",
                "How do you implement A/B testing for ML models?",
                "What is the difference between precision and recall?",
                "How do you handle model monitoring and maintenance?",
                "Explain the concept of reinforcement learning.",
                "What are the different types of generative models?",
                "How do you implement model compression and optimization?",
                "What is the difference between supervised and semi-supervised learning?",
                "How do you handle adversarial attacks on ML models?",
                "Explain the concept of federated learning.",
                "What are the different types of autoencoders?",
                "How do you implement multi-modal learning?",
                "What is the difference between online and offline learning?",
                "How do you handle concept drift in ML models?",
                "Explain the concept of meta-learning.",
                "What are the different types of attention mechanisms?",
                "How do you implement model fairness and bias detection?",
                "What is the difference between statistical and deep learning approaches?",
                "How do you handle large-scale ML training?",
                "Explain the concept of few-shot learning.",
                "What are the different types of graph neural networks?",
                "How do you implement ML pipelines and MLOps?",
                "What is the difference between model-centric and data-centric AI?",
                "How do you handle uncertainty in ML predictions?"
            ]
        }
    
    def extract_text_from_file(self, file_content: bytes, filename: str) -> str:
        """Extract text from PDF or DOCX resume"""
        try:
            if filename.lower().endswith('.pdf'):
                return self._extract_from_pdf(file_content)
            elif filename.lower().endswith(('.docx', '.doc')):
                return self._extract_from_docx(file_content)
            elif filename.lower().endswith('.txt'):
                return file_content.decode('utf-8')
            else:
                raise ValueError("Unsupported file format. Please upload PDF, DOCX, or TXT")
        except Exception as e:
            raise ValueError(f"Failed to extract text from resume: {str(e)}")
    
    def _extract_from_pdf(self, file_content: bytes) -> str:
        """Extract text from PDF"""
        pdf_file = BytesIO(file_content)
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    
    def _extract_from_docx(self, file_content: bytes) -> str:
        """Extract text from DOCX"""
        doc_file = BytesIO(file_content)
        doc = docx.Document(doc_file)
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        return text.strip()
    
    def extract_skills(self, resume_text: str, job_description: str) -> List[str]:
        """Extract relevant skills from resume and job description"""
        # Common technical skills to look for
        common_skills = [
            "python", "javascript", "java", "c++", "react", "angular", "vue",
            "node.js", "django", "flask", "fastapi", "sql", "mongodb", "postgresql",
            "aws", "azure", "docker", "kubernetes", "git", "agile", "scrum",
            "machine learning", "data analysis", "api", "rest", "graphql",
            "html", "css", "typescript", "testing", "ci/cd", "devops"
        ]
        
        combined_text = (resume_text + " " + job_description).lower()
        found_skills = []
        
        for skill in common_skills:
            if skill in combined_text:
                found_skills.append(skill)
        
        return found_skills[:8]  # Return top 8 skills
    
    async def generate_questions(
        self, 
        resume_text: str, 
        job_description: str, 
        num_questions: int = 5,
        difficulty: str = "intermediate"
    ) -> List[Dict[str, str]]:
        """
        Generate interview questions based on resume and job description
        Uses Gemini API if available, otherwise falls back to rule-based generation
        
        Args:
            resume_text: Candidate's resume content
            job_description: Job requirements and description
            num_questions: Number of questions to generate
            difficulty: Question difficulty level (beginner, intermediate, advanced)
        
        Returns:
            List of question dictionaries with 'question' and 'type' keys
        """
        if self.use_gemini and self.model:
            try:
                return await self._generate_questions_with_gemini(resume_text, job_description, num_questions, difficulty)
            except Exception as e:
                print(f"⚠ Gemini API error: {e}. Falling back to rule-based generation.")
                return self._generate_questions_fallback(resume_text, job_description, num_questions, difficulty)
        else:
            return self._generate_questions_fallback(resume_text, job_description, num_questions, difficulty)
    
    async def _generate_questions_with_gemini(
        self, 
        resume_text: str, 
        job_description: str, 
        num_questions: int,
        difficulty: str = "intermediate"
    ) -> List[Dict[str, str]]:
        """Generate questions using Gemini API"""
        print(f"🤖 Using Gemini API to generate {num_questions} {difficulty} questions...")
        
        # Difficulty-specific instructions
        difficulty_instructions = {
            "beginner": """
- Focus on fundamental concepts and basic terminology
- Ask about simple, straightforward scenarios
- Test foundational knowledge without complex problem-solving
- Use clear, simple language
- Suitable for entry-level candidates or those new to the field""",
            "intermediate": """
- Focus on practical knowledge and real-world applications
- Include moderate problem-solving scenarios
- Test understanding of best practices and common patterns
- Suitable for candidates with 1-3 years of experience""",
            "advanced": """
- Focus on complex, real-world scenarios similar to FAANG interviews
- Include system design and architecture questions
- Test deep understanding and advanced problem-solving
- Challenge candidates with edge cases and trade-offs
- Suitable for senior-level candidates with 3+ years of experience"""
        }
        
        difficulty_instruction = difficulty_instructions.get(difficulty, difficulty_instructions["intermediate"])
        
        prompt = f"""You are an expert technical interviewer. Based on the candidate's resume and the job description, generate {num_questions} relevant interview questions at {difficulty.upper()} difficulty level.

Resume:
{resume_text[:2000]}

Job Description:
{job_description[:1000]}

Difficulty Level: {difficulty.upper()}
{difficulty_instruction}

Generate exactly {num_questions} interview questions that:
1. Match the {difficulty} difficulty level
2. Test technical skills mentioned in the resume
3. Assess fit for the job requirements
4. Include a mix of technical, behavioral, and role-specific questions
5. Are clear and specific

Return ONLY a JSON array in this exact format:
[
  {{"question": "Question text here?", "type": "technical", "topic": "skill name"}},
  {{"question": "Question text here?", "type": "behavioral", "topic": "topic name"}},
  ...
]

Types can be: "technical", "behavioral", or "role_specific"
"""
        
        response = await self.model.generate_content_async(prompt)
        response_text = response.text.strip()
        print(f"✓ Gemini API responded successfully")
        
        # Extract JSON from response (handle markdown code blocks)
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        
        questions = json.loads(response_text)
        
        # Validate and ensure correct format
        validated_questions = []
        for q in questions[:num_questions]:
            if isinstance(q, dict) and "question" in q:
                validated_questions.append({
                    "question": q.get("question", ""),
                    "type": q.get("type", "general"),
                    "topic": q.get("topic", "general")
                })
        
        return validated_questions if validated_questions else self._generate_questions_fallback(resume_text, job_description, num_questions, difficulty)
    
    def _generate_questions_fallback(
        self, 
        resume_text: str, 
        job_description: str, 
        num_questions: int,
        difficulty: str = "intermediate"
    ) -> List[Dict[str, str]]:
        """Fallback rule-based question generation with difficulty levels"""
        questions = []
        skills = self.extract_skills(resume_text, job_description)
        
        # Extract job role from job description
        role = self._extract_role(job_description)
        
        # Difficulty-specific question templates
        difficulty_templates = {
            "beginner": {
                "technical": [
                    "What is {skill} and why is it used?",
                    "Can you explain the basic concepts of {skill}?",
                    "What are the main features of {skill}?",
                    "How would you describe {skill} to someone new?",
                ],
                "behavioral": [
                    "Tell me about your interest in {situation}.",
                    "What motivated you to learn about {situation}?",
                    "Describe a simple project where you used {situation}.",
                ],
            },
            "intermediate": {
                "technical": [
                    "Can you explain your experience with {skill}?",
                    "How have you used {skill} in your previous projects?",
                    "What challenges did you face while working with {skill}?",
                    "Describe a project where you implemented {skill}.",
                ],
                "behavioral": [
                    "Tell me about a time when you {situation}.",
                    "How do you handle {situation}?",
                    "Describe your approach to {situation}.",
                ],
            },
            "advanced": {
                "technical": [
                    "How would you architect a system using {skill} at scale?",
                    "What are the trade-offs when choosing {skill} over alternatives?",
                    "Explain how you would optimize {skill} for production use.",
                    "Design a solution using {skill} for a high-traffic application.",
                ],
                "behavioral": [
                    "Describe a complex situation where you {situation} and the impact it had.",
                    "How would you lead a team through {situation}?",
                    "Tell me about a time you made a critical decision regarding {situation}.",
                ],
            }
        }
        
        templates = difficulty_templates.get(difficulty, difficulty_templates["intermediate"])
        
        # Ensure we always generate num_questions with minimal duplicates
        behavioral_situations = {
            "beginner": [
                "working in a team",
                "learning new technologies",
                "solving a technical problem"
            ],
            "intermediate": [
                "faced a challenging deadline",
                "worked in a team with conflicting opinions",
                "had to learn a new technology quickly"
            ],
            "advanced": [
                "led a critical project under tight constraints",
                "made an architectural decision with significant trade-offs",
                "resolved a major production incident"
            ]
        }

        situations = behavioral_situations.get(difficulty, behavioral_situations["intermediate"])

        # Build a dynamic list to prevent repeating the same question text
        candidate_skills = skills.copy() if skills else ["your primary expertise"]
        for i in range(num_questions):
            if i < len(candidate_skills):
                skill = candidate_skills[i]
                template = random.choice(templates["technical"])
                questions.append({
                    "question": template.format(skill=skill.title()),
                    "type": "technical",
                    "topic": skill,
                    "difficulty": difficulty
                })
            elif i == len(candidate_skills):
                question_text = random.choice(templates["behavioral"]).format(situation=random.choice(situations))
                questions.append({
                    "question": question_text,
                    "type": "behavioral",
                    "topic": "teamwork",
                    "difficulty": difficulty
                })
            elif i == len(candidate_skills) + 1 and role:
                questions.append({
                    "question": self.question_templates["role_specific"][random.randint(0, len(self.question_templates["role_specific"]) - 1)].format(role=role),
                    "type": "role_specific",
                    "topic": "motivation",
                    "difficulty": difficulty
                })
            else:
                fallback_skill = random.choice(candidate_skills)
                question_text = random.choice(self.question_templates["technical"]).format(skill=fallback_skill.title())
                questions.append({
                    "question": question_text,
                    "type": "technical",
                    "topic": fallback_skill,
                    "difficulty": difficulty
                })

        # Remove duplicates by question text while preserving order
        seen = set()
        unique_questions = []
        for q in questions:
            if q["question"] not in seen:
                seen.add(q["question"])
                unique_questions.append(q)

        # If we don't have enough unique questions, fill with role questions
        while len(unique_questions) < num_questions:
            unique_questions.append({
                "question": f"Please describe your approach to {role} problem-solving.",
                "type": "role_specific",
                "topic": role,
                "difficulty": difficulty
            })

        return unique_questions[:num_questions]
    
    def _extract_role(self, job_description: str) -> str:
        """Extract job role from job description"""
        # Simple pattern matching for common roles
        roles = [
            "software engineer", "developer", "data scientist", "analyst",
            "manager", "designer", "architect", "consultant", "engineer"
        ]
        
        job_desc_lower = job_description.lower()
        for role in roles:
            if role in job_desc_lower:
                return role
        
        return "this position"

    def generate_questions_for_role(
        self,
        role: str,
        num_questions: int = 5,
        years_of_experience: int = 3
    ) -> List[Dict[str, str]]:
        """Return randomized pre-generated questions for a specific role"""
        role_key = role.strip().lower()

        canonical_map = {
            "frontenddev": "frontend developer",
            "frontend developer": "frontend developer",
            "frontend": "frontend developer",
            "backenddev": "backend developer",
            "backend developer": "backend developer",
            "backend": "backend developer",
            "software developer": "software developer",
            "software engineer": "software developer",
            "ai/ml engineer": "ai/ml engineer",
            "ai ml engineer": "ai/ml engineer",
            "ai engineer": "ai/ml engineer",
            "ml engineer": "ai/ml engineer"
        }

        role_key_normalized = canonical_map.get(role_key, role_key)
        if role_key_normalized not in self.role_question_bank:
            raise ValueError(f"Unsupported role: {role}")

        questions_pool = self.role_question_bank[role_key_normalized]
        if not questions_pool:
            raise ValueError(f"No questions available for role: {role_key_normalized}")

        selected_questions = random.sample(
            questions_pool,
            min(num_questions, len(questions_pool))
        )

        # Add difficulty-based metadata for analysis and interview adaptiveness
        difficulty = "beginner"
        if years_of_experience > 1:
            difficulty = "intermediate"
        if years_of_experience > 4:
            difficulty = "advanced"

        formatted = []
        for q in selected_questions:
            formatted.append({
                "question": q,
                "type": "technical" if "software" in q.lower() or "api" in q.lower() else "behavioral",
                "topic": role_key_normalized,
                "difficulty": difficulty
            })

        return formatted    
    async def analyze_answer(
        self, 
        question: Dict[str, str], 
        answer_text: str,
        answer_duration: float
    ) -> Dict[str, any]:
        """
        Analyze candidate's answer and provide scoring
        Uses Gemini API if available, otherwise falls back to rule-based analysis
        
        Returns:
            Dictionary with score, feedback, and metrics
        """
        if self.use_gemini and self.model:
            try:
                return await self._analyze_answer_with_gemini(question, answer_text, answer_duration)
            except Exception as e:
                print(f"⚠ Gemini API error: {e}. Falling back to rule-based analysis.")
                return self._analyze_answer_fallback(question, answer_text, answer_duration)
        else:
            return self._analyze_answer_fallback(question, answer_text, answer_duration)
    
    async def _analyze_answer_with_gemini(
        self, 
        question: Dict[str, str], 
        answer_text: str,
        answer_duration: float
    ) -> Dict[str, any]:
        """Analyze answer using Gemini API"""
        print(f"🤖 Using Gemini API to analyze answer...")
        prompt = f"""You are an expert interviewer evaluating a candidate's answer.

Question: {question['question']}
Question Type: {question.get('type', 'general')}
Topic: {question.get('topic', 'general')}

Candidate's Answer:
{answer_text}

Answer Duration: {answer_duration:.1f} seconds

Evaluate this answer and provide:
1. Overall score (0-100)
2. Relevance score (0-100) - How well does it address the question?
3. Completeness score (0-100) - Is the answer thorough?
4. Clarity score (0-100) - Is it well-articulated?
5. Constructive feedback (2-3 sentences)

Return ONLY a JSON object in this exact format:
{{
  "score": 85,
  "relevance": 90,
  "completeness": 80,
  "clarity": 85,
  "feedback": "Your feedback here."
}}
"""
        
        response = await self.model.generate_content_async(prompt)
        response_text = response.text.strip()
        print(f"✓ Gemini API analyzed answer successfully")
        
        # Extract JSON from response
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        
        analysis = json.loads(response_text)
        
        # Validate scores
        score = max(0, min(100, int(analysis.get("score", 50))))
        relevance = max(0, min(100, int(analysis.get("relevance", 50))))
        completeness = max(0, min(100, int(analysis.get("completeness", 50))))
        clarity = max(0, min(100, int(analysis.get("clarity", 50))))
        
        word_count = len(answer_text.split())
        
        return {
            "score": score,
            "feedback": analysis.get("feedback", "Good effort."),
            "metrics": {
                "relevance": relevance,
                "completeness": completeness,
                "clarity": clarity
            },
            "word_count": word_count
        }
    
    def _analyze_answer_fallback(
        self, 
        question: Dict[str, str], 
        answer_text: str,
        answer_duration: float
    ) -> Dict[str, any]:
        """Fallback rule-based answer analysis"""
        if not answer_text or len(answer_text.strip()) < 10:
            return {
                "score": 0,
                "feedback": "Answer too short or empty",
                "metrics": {
                    "relevance": 0,
                    "completeness": 0,
                    "clarity": 0
                }
            }
        
        # Calculate basic metrics
        word_count = len(answer_text.split())
        sentence_count = len(re.split(r'[.!?]+', answer_text))
        
        # Relevance: Check if answer mentions the topic
        topic = question.get("topic", "")
        relevance_score = self._calculate_relevance(answer_text, topic, question["type"])
        
        # Completeness: Based on answer length and structure
        completeness_score = self._calculate_completeness(word_count, sentence_count, answer_duration)
        
        # Clarity: Based on sentence structure and filler words
        clarity_score = self._calculate_clarity(answer_text, word_count)
        
        # Overall score (0-100)
        overall_score = int((relevance_score + completeness_score + clarity_score) / 3)
        
        # Generate feedback
        feedback = self._generate_feedback(
            overall_score, 
            relevance_score, 
            completeness_score, 
            clarity_score
        )
        
        return {
            "score": overall_score,
            "feedback": feedback,
            "metrics": {
                "relevance": relevance_score,
                "completeness": completeness_score,
                "clarity": clarity_score
            },
            "word_count": word_count
        }
    
    def _calculate_relevance(self, answer: str, topic: str, question_type: str) -> int:
        """Calculate how relevant the answer is to the question"""
        answer_lower = answer.lower()
        score = 50  # Base score
        
        # Check if topic is mentioned
        if topic and topic.lower() in answer_lower:
            score += 30
        
        # Check for type-specific keywords
        if question_type == "technical":
            technical_keywords = ["implemented", "developed", "used", "worked", "experience", "project"]
            matches = sum(1 for kw in technical_keywords if kw in answer_lower)
            score += min(matches * 5, 20)
        
        elif question_type == "behavioral":
            behavioral_keywords = ["situation", "challenge", "team", "result", "learned", "approach"]
            matches = sum(1 for kw in behavioral_keywords if kw in answer_lower)
            score += min(matches * 5, 20)
        
        return min(score, 100)
    
    def _calculate_completeness(self, word_count: int, sentence_count: int, duration: float) -> int:
        """Calculate how complete the answer is"""
        score = 0
        
        # Word count scoring (optimal: 50-150 words)
        if word_count < 20:
            score += 30
        elif word_count < 50:
            score += 60
        elif word_count <= 150:
            score += 100
        else:
            score += 80  # Too long
        
        # Sentence structure (optimal: 3-6 sentences)
        if sentence_count >= 3:
            score += min(sentence_count * 10, 40)
        
        return min(score // 2, 100)
    
    def _calculate_clarity(self, answer: str, word_count: int) -> int:
        """Calculate clarity of the answer"""
        score = 70  # Base score
        
        # Check for filler words
        filler_words = ["um", "uh", "like", "you know", "so", "actually", "basically"]
        filler_count = sum(answer.lower().count(filler) for filler in filler_words)
        filler_ratio = filler_count / word_count if word_count > 0 else 0
        
        # Penalize excessive fillers
        if filler_ratio > 0.1:
            score -= 30
        elif filler_ratio > 0.05:
            score -= 15
        
        # Reward proper sentence structure
        if ". " in answer or "? " in answer:
            score += 15
        
        return max(min(score, 100), 0)
    
    def _generate_feedback(
        self, 
        overall: int, 
        relevance: int, 
        completeness: int, 
        clarity: int
    ) -> str:
        """Generate human-readable feedback"""
        feedback_parts = []
        
        if overall >= 80:
            feedback_parts.append("Excellent answer!")
        elif overall >= 60:
            feedback_parts.append("Good answer.")
        else:
            feedback_parts.append("Answer needs improvement.")
        
        if relevance < 60:
            feedback_parts.append("Try to address the question more directly.")
        
        if completeness < 60:
            feedback_parts.append("Provide more details and examples.")
        
        if clarity < 60:
            feedback_parts.append("Work on reducing filler words and speaking more clearly.")
        
        return " ".join(feedback_parts)
    
    def calculate_overall_knowledge_score(self, answer_results: List[Dict]) -> Dict:
        """
        Calculate overall knowledge score from all answers
        
        Returns:
            Dictionary with overall score and breakdown
        """
        if not answer_results:
            return {
                "overall_score": 0,
                "technical_score": 0,
                "behavioral_score": 0,
                "total_questions": 0,
                "answered_questions": 0
            }
        
        total_score = sum(result["score"] for result in answer_results)
        avg_score = total_score / len(answer_results)
        
        # Calculate category scores
        technical_scores = [r["score"] for r in answer_results if r.get("type") == "technical"]
        behavioral_scores = [r["score"] for r in answer_results if r.get("type") == "behavioral"]
        
        return {
            "overall_score": int(avg_score),
            "technical_score": int(sum(technical_scores) / len(technical_scores)) if technical_scores else 0,
            "behavioral_score": int(sum(behavioral_scores) / len(behavioral_scores)) if behavioral_scores else 0,
            "total_questions": len(answer_results),
            "answered_questions": len([r for r in answer_results if r["score"] > 0])
        }


# Singleton instance
ai_interviewer = AIInterviewer()
