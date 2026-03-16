# Testing the Enhanced Live Interview Feature

## Quick Start Testing Guide

### 1. Start the Application

#### Backend:
```bash
cd p2/backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Frontend:
```bash
cd p2/frontend
npm install
npm run dev
```

### 2. Access Live Interview
- Navigate to: `http://localhost:5173`
- Click on "Live Interview" in the navigation
- Or go directly to: `http://localhost:5173/live-interview`

### 3. Test the Enhanced Features

#### A. Video Quality Test
**What to Check:**
- [ ] Video displays in high resolution (should be crisp and clear)
- [ ] Video is mirrored (your right hand appears on the right side)
- [ ] Video has slight brightness/contrast enhancement
- [ ] Frame is larger (480px height vs 400px before)

**Expected Result:** Professional-looking video feed with natural mirroring

#### B. Face Detection Test
**What to Check:**
- [ ] Face detected immediately when in frame
- [ ] Works in various lighting conditions
- [ ] Detects face even when slightly off-center
- [ ] Shows "No face detected" warning when you move out of frame

**Expected Result:** Reliable face detection with helpful warnings

#### C. Confidence Metrics Test
**Test Scenarios:**

1. **Eye Contact (Blue Circle)**
   - Look directly at camera → Should show 80-100%
   - Look away → Should drop to 30-70%
   - Close eyes → Should drop significantly

2. **Clarity/Composure (Purple Circle)**
   - Stay still and centered → Should show 70-100%
   - Move head around → Should drop
   - Move off-center → Should decrease

3. **Engagement (Green Circle)**
   - Smile naturally → Should increase
   - Stay centered in frame → Should be high
   - Move too close or far → Should decrease
   - Neutral expression → Should be moderate

**Expected Result:** Metrics respond accurately to your actions

#### D. Real-time Coaching Test
**What to Check:**
- [ ] "Look at the camera" tip appears when eye contact < 50%
- [ ] "Center yourself in frame" tip appears when off-center
- [ ] Tips disappear when you correct the issue

**Expected Result:** Helpful, contextual tips that guide improvement

#### E. Complete Interview Test
**Steps:**
1. Upload a resume (PDF, DOCX, or TXT)
2. Paste a job description
3. Select number of questions (3, 5, or 7)
4. Click "Start Live Interview"
5. Click "Start Interview" when ready
6. Answer each question (minimum 5 seconds)
7. Click "Next Question" after each answer
8. Review final results

**What to Check:**
- [ ] Questions are relevant to resume/job description
- [ ] Video recording works smoothly
- [ ] Metrics update in real-time
- [ ] Timer counts up correctly
- [ ] Can't proceed until 5 seconds elapsed
- [ ] Final results show detailed scores
- [ ] Feedback is specific and actionable

**Expected Result:** Smooth interview flow with accurate scoring

### 4. Verify Accuracy Improvements

#### Confidence Score Components (20 points each)
Test each component individually:

1. **Eye Contact (20%)** - Look at camera consistently
2. **Head Stability (15%)** - Stay still and composed
3. **Engagement (15%)** - Show natural expressions, stay centered
4. **Speech Rate (15%)** - Speak at 120-160 words per minute
5. **Filler Words (15%)** - Minimize "um", "uh", "like"
6. **Energy Stability (10%)** - Maintain consistent volume
7. **Clarity (10%)** - Speak clearly with steady pitch

#### Test Matrix

| Test Case | Eye Contact | Composure | Engagement | Expected Score |
|-----------|-------------|-----------|------------|----------------|
| Perfect Performance | 100% | 100% | 100% | 90-100 |
| Good Performance | 70-80% | 70-80% | 70-80% | 70-85 |
| Average Performance | 50-60% | 50-60% | 50-60% | 50-65 |
| Needs Improvement | <50% | <50% | <50% | <50 |

### 5. Edge Cases to Test

#### Lighting Conditions
- [ ] Bright front lighting (optimal)
- [ ] Dim lighting (should still detect with histogram equalization)
- [ ] Backlit (challenging but should work)
- [ ] Side lighting (should work)

#### Positioning
- [ ] Centered (optimal)
- [ ] Off to left/right (should give feedback)
- [ ] Too close (should reduce engagement score)
- [ ] Too far (should reduce engagement score)

#### Facial Expressions
- [ ] Neutral face (baseline)
- [ ] Smiling (increases engagement)
- [ ] Looking away (decreases eye contact)
- [ ] Moving head (decreases stability)

#### Audio Quality
- [ ] Clear speech (optimal)
- [ ] Fast speech (>180 WPM - should flag)
- [ ] Slow speech (<100 WPM - should flag)
- [ ] Many filler words (should reduce clarity score)

### 6. Performance Testing

#### Frame Rate
- [ ] Video appears smooth (30 fps)
- [ ] No lag in metric updates
- [ ] WebSocket connection stable
- [ ] Metrics update every 150ms

#### Browser Compatibility
- [ ] Chrome (recommended)
- [ ] Firefox
- [ ] Edge
- [ ] Safari

### 7. Expected Improvements Over Previous Version

| Feature | Before | After | Improvement |
|---------|--------|-------|-------------|
| Video Resolution | 1280x720 | 1920x1080 | +50% pixels |
| Frame Processing | Every 5th frame | Every 3rd frame | +67% accuracy |
| Metrics Tracked | 3 (eye, stability, smile) | 6 (+ engagement, centering, clarity) | +100% data |
| Scoring Components | 6 factors | 7 factors | More comprehensive |
| Face Detection | Basic | Enhanced with histogram eq. | Better in low light |
| Eye Contact Scoring | Binary | Three-tier | More nuanced |
| Engagement Scoring | Smile only | Multi-factor | More accurate |
| Real-time Tips | None | Contextual coaching | Better UX |
| Video Display | Standard | Mirrored + enhanced | More natural |

### 8. Common Issues & Solutions

#### Issue: "No face detected" constantly
**Solutions:**
- Ensure adequate lighting
- Move closer to camera
- Center yourself in frame
- Check camera permissions

#### Issue: Low eye contact score despite looking at camera
**Solutions:**
- Look directly at camera lens (not screen)
- Ensure eyes are clearly visible
- Remove glasses if causing glare
- Improve lighting on face

#### Issue: Low engagement score
**Solutions:**
- Center yourself in frame
- Maintain appropriate distance (2-3 feet)
- Show natural facial expressions
- Avoid being too close or too far

#### Issue: Low clarity score
**Solutions:**
- Speak at moderate pace (120-160 WPM)
- Reduce filler words
- Maintain consistent volume
- Speak clearly and deliberately

### 9. Validation Checklist

Before considering testing complete, verify:

- [ ] All three metric circles display correctly
- [ ] Scores update in real-time
- [ ] Video is mirrored and high quality
- [ ] Face detection works in various conditions
- [ ] Real-time tips appear appropriately
- [ ] Final results are detailed and accurate
- [ ] Feedback is specific and actionable
- [ ] No console errors in browser
- [ ] No errors in backend logs
- [ ] WebSocket connection stable throughout

### 10. Success Criteria

The enhanced live interview feature is working correctly if:

1. **Accuracy**: Metrics accurately reflect candidate performance
2. **Responsiveness**: Real-time updates with <200ms latency
3. **Reliability**: Face detection works in 90%+ of normal conditions
4. **Usability**: Clear feedback helps candidates improve
5. **Quality**: Video is professional-looking and smooth
6. **Stability**: No crashes or disconnections during interview

## Reporting Issues

If you encounter issues, please note:
- Browser and version
- Lighting conditions
- Camera specifications
- Error messages (console and backend)
- Steps to reproduce
- Expected vs actual behavior

## Next Steps After Testing

1. Review the detailed scores and feedback
2. Compare with previous version (if available)
3. Verify improvements are noticeable
4. Test with multiple users for consistency
5. Gather feedback on accuracy and usability
