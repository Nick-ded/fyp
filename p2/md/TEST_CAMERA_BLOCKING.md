# Test Camera Blocking Fix - Quick Guide

## Quick Test (2 minutes)

### Setup
```bash
# Terminal 1 - Backend
cd p2/backend
uvicorn main:app --reload

# Terminal 2 - Frontend  
cd p2/frontend
npm run dev

# Browser
http://localhost:5173/live-interview
```

### Test Scenario 1: Blocked Camera ✅

**Steps:**
1. Start interview (upload resume, job description)
2. Click "Start Interview"
3. **Cover camera with your hand**
4. Wait 5 seconds

**Expected Results:**
- ✅ Full-screen RED overlay appears
- ✅ Message: "⚠️ Camera Blocked or No Face Detected"
- ✅ Instructions shown
- ✅ Warning: "Scores will be 0"
- ✅ Detection status: "0% - Poor - Scores will be 0" (RED)
- ✅ Metric circles show 0 or don't update

**Screenshot:**
```
┌────────────────────────────────────────┐
│  [FULL RED OVERLAY COVERING VIDEO]     │
│                                        │
│  ⚠️ Camera Blocked or No Face Detected │
│                                        │
│  Your interview cannot be scored...    │
│                                        │
│  Please ensure:                        │
│  • Camera is not blocked               │
│  • Your face is clearly visible        │
│  ...                                   │
└────────────────────────────────────────┘
```

### Test Scenario 2: Try to Submit with Blocked Camera ✅

**Steps:**
1. Keep camera covered
2. Wait 10 seconds (minimum answer time)
3. Click "Next Question"

**Expected Results:**
- ✅ Alert popup appears
- ✅ Message: "Your face was only detected in 0% of frames"
- ✅ Warning: "This will result in a score of 0"
- ✅ Recommendations listed
- ✅ Options: [Cancel] [Continue]

**Screenshot:**
```
┌────────────────────────────────────────┐
│  ⚠️ WARNING                            │
│                                        │
│  Your face was only detected in 0%    │
│  of frames.                            │
│                                        │
│  This will result in a score of 0     │
│  for this question.                   │
│                                        │
│  [Cancel]         [Continue]          │
└────────────────────────────────────────┘
```

### Test Scenario 3: Unblock Camera ✅

**Steps:**
1. Click "Cancel" on alert
2. **Uncover camera**
3. Wait 2 seconds

**Expected Results:**
- ✅ Red overlay disappears
- ✅ Video feed shows clearly
- ✅ Detection status: "95% - Excellent" (GREEN)
- ✅ Metric circles update with real values
- ✅ No warnings

**Screenshot:**
```
┌────────────────────────────────────────┐
│  [CLEAR VIDEO FEED]                    │
│  Your face visible                     │
│                                        │
│  ◐ 87    ◐ 92    ◐ 85                 │
│                                        │
│  ✓ Face Detection: 95%    Excellent   │
│  [GREEN indicator]                     │
└────────────────────────────────────────┘
```

### Test Scenario 4: Complete with Good Detection ✅

**Steps:**
1. Keep camera unblocked
2. Answer question (30 seconds)
3. Click "Next Question"

**Expected Results:**
- ✅ No alert
- ✅ Proceeds to next question
- ✅ Scores calculated normally
- ✅ Final results show actual scores (not 0)

### Test Scenario 5: Partial Coverage ✅

**Steps:**
1. Start new question
2. **Cover half of camera**
3. Wait 10 seconds

**Expected Results:**
- ✅ Intermittent red overlay
- ✅ Detection status: "30-40% - Poor" (RED)
- ✅ Warning visible
- ✅ Metrics low or 0

## Validation Checklist

After testing, verify:

### Visual Warnings
- [ ] Full-screen red overlay when camera blocked
- [ ] Clear warning message displayed
- [ ] Instructions visible and readable
- [ ] Warning disappears when camera unblocked

### Detection Status
- [ ] Shows percentage (0-100%)
- [ ] Color-coded: Red (<50%), Yellow (50-79%), Green (≥80%)
- [ ] Updates in real-time
- [ ] Accurate to actual detection

### Alerts
- [ ] Alert appears when trying to submit with <50% detection
- [ ] Shows exact percentage
- [ ] Provides recommendations
- [ ] Allows cancel to re-record

### Scoring
- [ ] Score = 0 when face detected <50%
- [ ] Score penalized when detected 50-89%
- [ ] Full score when detected ≥90%
- [ ] Feedback mentions detection issues

### Metrics Display
- [ ] Circles show 0 when no face
- [ ] Circles update when face detected
- [ ] Smooth transitions
- [ ] Accurate values

## Expected Behavior Summary

| Camera State | Detection % | Warning | Alert on Submit | Final Score |
|--------------|-------------|---------|-----------------|-------------|
| Blocked | 0% | Red overlay | Yes | 0 |
| Half covered | 20-40% | Red overlay | Yes | 0 |
| Poor lighting | 40-60% | Yellow indicator | Maybe | Penalized |
| Good | 80-95% | Green indicator | No | Minor penalty |
| Excellent | 95-100% | Green indicator | No | Full score |

## Common Issues & Solutions

### Issue: Warning doesn't appear
**Check:**
- WebSocket connection (should see "Camera Active")
- Browser console for errors
- Backend logs for face detection

### Issue: Detection always 0%
**Check:**
- Camera permissions granted
- Adequate lighting
- Face clearly visible
- Camera not in use by another app

### Issue: Alert doesn't show
**Check:**
- Detection percentage calculation
- Browser allows alerts
- JavaScript console for errors

## Success Criteria

Test is successful if:

1. ✅ Camera blocked → Red overlay + 0% detection
2. ✅ Try to submit → Alert with warning
3. ✅ Unblock camera → Warning disappears
4. ✅ Good detection → Green indicator
5. ✅ Final score = 0 when blocked
6. ✅ Final score > 0 when unblocked
7. ✅ Feedback mentions detection issues

## Quick Verification Commands

### Check Backend Logs:
```bash
# Should see:
"Face presence: X%"
"WARNING: Insufficient face detection" (if <50%)
"Confidence calculation: face_presence=X%"
```

### Check Browser Console:
```javascript
// Should see WebSocket messages:
{type: "metrics", data: {eye_contact: 0, no_face: true}}
{type: "metrics", data: {eye_contact: 0.87, ...}}
```

### Check Network Tab:
```
WebSocket connection to ws://localhost:8000/api/live
Status: 101 Switching Protocols
Messages: Sending/receiving every 150ms
```

## Performance Check

### Frame Processing:
- Frames sent: Every 150ms
- Frames processed: Every 3rd frame
- Detection latency: <50ms
- UI update: Real-time

### Resource Usage:
- CPU: 15-25% (normal)
- Memory: +10MB (acceptable)
- Network: ~50KB/s (efficient)

## Final Verification

Run all 5 test scenarios in sequence:
1. ✅ Blocked camera → Score 0
2. ✅ Alert on submit
3. ✅ Unblock → Warning clears
4. ✅ Complete with good detection
5. ✅ Partial coverage → Low score

**If all pass: System is working correctly! ✅**

## Troubleshooting

### Red overlay stuck
**Solution:** Refresh page, check camera

### Detection always 100%
**Solution:** Check face detection logic, verify WebSocket data

### No metrics updating
**Solution:** Check WebSocket connection, verify backend running

### Alert not showing
**Solution:** Check browser console, verify detection tracking

## Next Steps

After successful testing:
1. Document any edge cases found
2. Adjust thresholds if needed
3. Gather user feedback
4. Monitor production metrics
5. Iterate based on data

---

**Ready to test? Follow the 5 scenarios above and verify all checkboxes!**
