// Interview session data types

export interface QuestionSession {
  questionId: string;
  questionText: string;
  allocatedTime: number; // in seconds
  timeUsed: number; // in seconds
  skipped: boolean;
  audioBlob: Blob | null;
  transcript: string | null;
  transcriptionStatus?: 'pending' | 'success' | 'transcription_failed';
  analysis?: QuestionAnalysis | null;
  analysisStatus?: 'pending' | 'success' | 'analysis_failed';
}

export interface QuestionAnalysis {
  questionId: string;
  scores: {
    relevance: number; // 0-10
    clarity: number; // 0-10
    technicalDepth: number; // 0-10
    confidence: number; // 0-10
    overall: number; // 0-100
  };
  strengths: string[];
  improvements: string[];
  verdict: string;
  status?: 'success' | 'analysis_failed';
  error?: string;
}

export interface InterviewQuestion {
  id?: string;
  question: string;
  type: string;
  allocatedTime?: number; // Default 120 seconds if not specified
}

export interface InterviewConfig {
  strictMode: boolean; // Controls pause/resume functionality
  defaultQuestionTime: number; // Default time per question in seconds
  targetedRole: string; // Role being interviewed for
  yearsOfExperience: number; // Candidate's experience level
}

export interface TimerState {
  timeRemaining: number;
  timeUsed: number;
  isRunning: boolean;
  isPaused: boolean;
  formattedTime: string;
  formattedTimeUsed: string;
}

export interface InterviewResults {
  sessionId: string;
  questionSessions: QuestionSession[];
  overallResults: {
    overall_score: number;
    technical_score: number;
    behavioral_score: number;
    total_questions: number;
    answered_questions: number;
    skipped_questions: number;
    analysis_success_rate: number;
    detailed_scores?: {
      relevance: number;
      clarity: number;
      technicalDepth: number;
      confidence: number;
      overall: number;
    };
  };
  detailed_answers: Array<{
    question: string;
    answer_text: string;
    analysis: QuestionAnalysis;
    timeUsed: number;
    skipped: boolean;
    transcriptionStatus?: string;
    analysisStatus?: string;
  }>;
  sessionSummary?: SessionSummary;
}

export interface SessionSummary {
  overallFeedback: string;
  topStrengths: string[];
  criticalImprovements: string[];
  recommendedFocus: string;
}

export interface InterviewSessionResult {
  sessionId: string;
  userId: string;
  timestamp: Date;
  targetedRole: string;
  totalQuestions: number;
  answeredQuestions: number;
  skippedQuestions: number;
  averageScore: number;
  totalTimeUsed: number;
  questionResults: QuestionAnalysis[];
  overallFeedback: string;
  topStrengths: string[];
  criticalImprovements: string[];
  recommendedFocus: string;
  metadata?: {
    analysisSuccessRate: number;
    averageTimePerQuestion: number;
    completionRate: number;
  };
}

export interface PerformanceInsights {
  performanceLevel: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement' | 'Incomplete';
  readinessAssessment: 'Ready' | 'Nearly Ready' | 'Not Ready';
  nextSteps: string[];
  timeManagement: 'Good' | 'Too Slow' | 'Too Fast';
  consistencyScore: number;
  scoreDistribution?: {
    highest: number;
    lowest: number;
    variance: number;
  };
}