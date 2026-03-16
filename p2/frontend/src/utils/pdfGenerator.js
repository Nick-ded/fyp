/**
 * Generate a simple PDF report from interview results
 * This is a basic implementation - for production, consider using libraries like jsPDF or Puppeteer
 */

export function generatePDFReport(sessionResult) {
  if (!sessionResult) {
    throw new Error('No session result provided')
  }

  // Create a formatted text report
  const reportContent = `
INTERVIEW RESULTS REPORT
========================

Session Information:
- Session ID: ${sessionResult.sessionId}
- Date: ${new Date(sessionResult.timestamp).toLocaleDateString()}
- Targeted Role: ${sessionResult.targetedRole}
- Total Questions: ${sessionResult.totalQuestions}
- Questions Answered: ${sessionResult.answeredQuestions}
- Questions Skipped: ${sessionResult.skippedQuestions}

Overall Performance:
- Average Score: ${sessionResult.averageScore}/100
- Total Time Used: ${Math.floor(sessionResult.totalTimeUsed / 60)}:${(sessionResult.totalTimeUsed % 60).toString().padStart(2, '0')}

Performance Metrics:
- Analysis Success Rate: ${sessionResult.metadata?.analysisSuccessRate || 0}%
- Average Time Per Question: ${sessionResult.metadata?.averageTimePerQuestion || 0}s
- Completion Rate: ${sessionResult.metadata?.completionRate || 0}%

COACHING SUMMARY
================

Overall Feedback:
${sessionResult.overallFeedback}

Top Strengths:
${sessionResult.topStrengths.map((strength, index) => `${index + 1}. ${strength}`).join('\n')}

Critical Improvements:
${sessionResult.criticalImprovements.map((improvement, index) => `${index + 1}. ${improvement}`).join('\n')}

Recommended Focus:
${sessionResult.recommendedFocus}

DETAILED QUESTION ANALYSIS
===========================

${sessionResult.questionResults.map((result, index) => `
Question ${index + 1}:
${result.questionId ? `ID: ${result.questionId}` : ''}

Scores:
- Relevance: ${result.scores?.relevance || 0}/10
- Clarity: ${result.scores?.clarity || 0}/10
- Technical Depth: ${result.scores?.technicalDepth || 0}/10
- Confidence: ${result.scores?.confidence || 0}/10
- Overall: ${result.scores?.overall || 0}/100

Assessment: ${result.verdict || 'No assessment available'}

Strengths:
${result.strengths?.map(s => `- ${s}`).join('\n') || '- None identified'}

Areas for Improvement:
${result.improvements?.map(i => `- ${i}`).join('\n') || '- None identified'}

${'='.repeat(50)}
`).join('\n')}

Report generated on: ${new Date().toLocaleString()}
Powered by AI Interview Analyzer
  `.trim()

  return reportContent
}

/**
 * Download report as text file (fallback for PDF)
 */
export function downloadTextReport(sessionResult, filename = null) {
  try {
    const reportContent = generatePDFReport(sessionResult)
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    
    const defaultFilename = `interview-report-${new Date().toISOString().split('T')[0]}.txt`
    const finalFilename = filename || defaultFilename
    
    const link = document.createElement('a')
    link.href = url
    link.download = finalFilename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up the URL object
    URL.revokeObjectURL(url)
    
    return true
  } catch (error) {
    console.error('Error generating report:', error)
    return false
  }
}

/**
 * Download report as JSON (for data backup)
 */
export function downloadJSONReport(sessionResult, filename = null) {
  try {
    const jsonContent = JSON.stringify(sessionResult, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    
    const defaultFilename = `interview-data-${new Date().toISOString().split('T')[0]}.json`
    const finalFilename = filename || defaultFilename
    
    const link = document.createElement('a')
    link.href = url
    link.download = finalFilename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up the URL object
    URL.revokeObjectURL(url)
    
    return true
  } catch (error) {
    console.error('Error generating JSON report:', error)
    return false
  }
}

/**
 * Generate HTML report for better formatting
 */
export function generateHTMLReport(sessionResult) {
  if (!sessionResult) {
    throw new Error('No session result provided')
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interview Results Report</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #007bff; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
        .score-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .score-card { background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; }
        .score-value { font-size: 2em; font-weight: bold; color: #007bff; }
        .question-card { background: #f8f9fa; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #007bff; }
        .strengths { color: #28a745; }
        .improvements { color: #ffc107; }
        .list-item { margin: 5px 0; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Interview Results Report</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
    </div>

    <div class="section">
        <h2>Session Overview</h2>
        <div class="score-grid">
            <div class="score-card">
                <div class="score-value">${sessionResult.averageScore}</div>
                <div>Average Score</div>
            </div>
            <div class="score-card">
                <div class="score-value">${sessionResult.answeredQuestions}</div>
                <div>Questions Answered</div>
            </div>
            <div class="score-card">
                <div class="score-value">${sessionResult.totalQuestions}</div>
                <div>Total Questions</div>
            </div>
            <div class="score-card">
                <div class="score-value">${Math.floor(sessionResult.totalTimeUsed / 60)}:${(sessionResult.totalTimeUsed % 60).toString().padStart(2, '0')}</div>
                <div>Total Time</div>
            </div>
        </div>
        <p><strong>Targeted Role:</strong> ${sessionResult.targetedRole}</p>
        <p><strong>Session ID:</strong> ${sessionResult.sessionId}</p>
    </div>

    <div class="section">
        <h2>Coaching Summary</h2>
        <p><strong>Overall Feedback:</strong> ${sessionResult.overallFeedback}</p>
        
        <h3 class="strengths">Top Strengths</h3>
        <ul>
            ${sessionResult.topStrengths.map(strength => `<li class="list-item">${strength}</li>`).join('')}
        </ul>
        
        <h3 class="improvements">Critical Improvements</h3>
        <ul>
            ${sessionResult.criticalImprovements.map(improvement => `<li class="list-item">${improvement}</li>`).join('')}
        </ul>
        
        <p><strong>Recommended Focus:</strong> ${sessionResult.recommendedFocus}</p>
    </div>

    <div class="section">
        <h2>Question Analysis</h2>
        ${sessionResult.questionResults.map((result, index) => `
            <div class="question-card">
                <h3>Question ${index + 1}</h3>
                <div class="score-grid">
                    <div class="score-card">
                        <div class="score-value">${result.scores?.overall || 0}</div>
                        <div>Overall Score</div>
                    </div>
                    <div class="score-card">
                        <div class="score-value">${result.scores?.relevance || 0}</div>
                        <div>Relevance</div>
                    </div>
                    <div class="score-card">
                        <div class="score-value">${result.scores?.clarity || 0}</div>
                        <div>Clarity</div>
                    </div>
                    <div class="score-card">
                        <div class="score-value">${result.scores?.technicalDepth || 0}</div>
                        <div>Technical Depth</div>
                    </div>
                </div>
                <p><strong>Assessment:</strong> ${result.verdict || 'No assessment available'}</p>
                ${result.strengths && result.strengths.length > 0 ? `
                    <p class="strengths"><strong>Strengths:</strong></p>
                    <ul>${result.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
                ` : ''}
                ${result.improvements && result.improvements.length > 0 ? `
                    <p class="improvements"><strong>Areas for Improvement:</strong></p>
                    <ul>${result.improvements.map(i => `<li>${i}</li>`).join('')}</ul>
                ` : ''}
            </div>
        `).join('')}
    </div>

    <div class="footer">
        <p>Report generated by AI Interview Analyzer</p>
        <p>Powered by Gemini AI</p>
    </div>
</body>
</html>
  `.trim()

  return html
}

/**
 * Download HTML report
 */
export function downloadHTMLReport(sessionResult, filename = null) {
  try {
    const htmlContent = generateHTMLReport(sessionResult)
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    
    const defaultFilename = `interview-report-${new Date().toISOString().split('T')[0]}.html`
    const finalFilename = filename || defaultFilename
    
    const link = document.createElement('a')
    link.href = url
    link.download = finalFilename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up the URL object
    URL.revokeObjectURL(url)
    
    return true
  } catch (error) {
    console.error('Error generating HTML report:', error)
    return false
  }
}