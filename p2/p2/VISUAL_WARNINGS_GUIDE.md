# Visual Warnings Guide - What Users See

## Camera Blocked Scenario

### 1. Full-Screen Warning (When Camera Blocked)

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│                    [RED OVERLAY]                       │
│                                                        │
│              ⚠️ WARNING ICON (Large)                   │
│                                                        │
│     ⚠️ Camera Blocked or No Face Detected             │
│                                                        │
│   Your interview cannot be scored without             │
│   visible face detection                              │
│                                                        │
│   ┌──────────────────────────────────────┐           │
│   │ Please ensure:                       │           │
│   │ • Camera is not blocked or covered   │           │
│   │ • Your face is clearly visible       │           │
│   │ • Adequate lighting on your face     │           │
│   │ • You are centered in the frame      │           │
│   │ • Camera permissions are granted     │           │
│   └──────────────────────────────────────┘           │
│                                                        │
│   ⚠️ Scores will be 0 if face is not detected        │
│      during recording                                 │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Colors:**
- Background: Dark red (#7f1d1d) with 90% opacity
- Text: White
- Warning text: Yellow (#fcd34d)
- Icon: White, large (80px)

### 2. Face Detection Status Indicator

#### Excellent Detection (≥80%)
```
┌────────────────────────────────────────────────────────┐
│  ✓ Face Detection: 95%              Excellent          │
│  [Green background, green text]                        │
└────────────────────────────────────────────────────────┘
```

#### Fair Detection (50-79%)
```
┌────────────────────────────────────────────────────────┐
│  ⚠ Face Detection: 65%    Fair - Improve positioning   │
│  [Yellow background, yellow text]                      │
└────────────────────────────────────────────────────────┘
```

#### Poor Detection (<50%)
```
┌────────────────────────────────────────────────────────┐
│  ✗ Face Detection: 25%        Poor - Scores will be 0  │
│  [Red background, red text]                            │
└────────────────────────────────────────────────────────┘
```

### 3. Pre-Submission Alert

When user clicks "Next Question" with poor detection:

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│                    ⚠️ WARNING                          │
│                                                        │
│  Your face was only detected in 35% of frames.        │
│                                                        │
│  This will result in a score of 0 for this question.  │
│                                                        │
│  Recommendations:                                      │
│  • Ensure your camera is not blocked                  │
│  • Improve lighting on your face                      │
│  • Position yourself clearly in frame                 │
│  • Check camera permissions                           │
│                                                        │
│  Do you want to continue anyway?                      │
│                                                        │
│         [Cancel]              [Continue]               │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Complete Interview Flow with Warnings

### Step 1: Start Interview (Camera Working)
```
┌────────────────────────────────────────────────────────┐
│  Question 1 of 5                          00:15        │
│  Tell me about yourself and your background.           │
├────────────────────────────────────────────────────────┤
│                                                        │
│              [VIDEO FEED - CLEAR]                      │
│              Your face visible                         │
│              Mirrored view                             │
│                                                        │
├────────────────────────────────────────────────────────┤
│   ◐ 87        ◐ 92        ◐ 85                        │
│ Confidence   Clarity   Engagement                      │
├────────────────────────────────────────────────────────┤
│  ✓ Face Detection: 95%              Excellent          │
│  [Green indicator]                                     │
└────────────────────────────────────────────────────────┘
```

### Step 2: Camera Gets Blocked
```
┌────────────────────────────────────────────────────────┐
│  Question 1 of 5                          00:22        │
│  Tell me about yourself and your background.           │
├────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐ │
│  │                                                  │ │
│  │         [RED OVERLAY COVERS VIDEO]               │ │
│  │                                                  │ │
│  │         ⚠️ Camera Blocked or                     │ │
│  │         No Face Detected                         │ │
│  │                                                  │ │
│  │  Your interview cannot be scored without         │ │
│  │  visible face detection                          │ │
│  │                                                  │ │
│  │  Please ensure:                                  │ │
│  │  • Camera is not blocked                         │ │
│  │  • Your face is clearly visible                  │ │
│  │  • Adequate lighting                             │ │
│  │                                                  │ │
│  │  ⚠️ Scores will be 0 if face not detected       │ │
│  │                                                  │ │
│  └──────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────┤
│   ◐ 0         ◐ 0         ◐ 0                         │
│ Confidence   Clarity   Engagement                      │
│ [Circles empty or not updating]                        │
├────────────────────────────────────────────────────────┤
│  ✗ Face Detection: 15%        Poor - Scores will be 0  │
│  [Red indicator]                                       │
└────────────────────────────────────────────────────────┘
```

### Step 3: Attempt to Finish Question
```
┌────────────────────────────────────────────────────────┐
│                    Browser Alert                       │
│                                                        │
│  ⚠️ WARNING: Your face was only detected in 15%       │
│  of frames.                                            │
│                                                        │
│  This will result in a score of 0 for this question.  │
│                                                        │
│  Recommendations:                                      │
│  • Ensure your camera is not blocked                  │
│  • Improve lighting on your face                      │
│  • Position yourself clearly in frame                 │
│  • Check camera permissions                           │
│                                                        │
│  Do you want to continue anyway?                      │
│                                                        │
│         [Cancel]              [OK]                     │
└────────────────────────────────────────────────────────┘
```

### Step 4: Final Results (Poor Detection)
```
┌────────────────────────────────────────────────────────┐
│  🎉 Interview Complete!                                │
├────────────────────────────────────────────────────────┤
│     0          0          0                            │
│  Overall   Technical  Behavioral                       │
├────────────────────────────────────────────────────────┤
│  Detailed Feedback                                     │
│                                                        │
│  Q1: Tell me about yourself                            │
│  Your answer: [transcription]                          │
│  Score: 0/100                                          │
│                                                        │
│  Feedback:                                             │
│  ⚠️ CRITICAL: Your face was only detected in 15%      │
│  of frames. Ensure your camera is not blocked,        │
│  improve lighting, and position yourself clearly      │
│  in frame. Without proper face detection, visual      │
│  metrics cannot be accurately assessed.               │
│                                                        │
│  Focus on improving camera visibility for your        │
│  next attempt.                                        │
└────────────────────────────────────────────────────────┘
```

## Color Coding System

### Detection Status Colors

#### Excellent (≥80%)
- Background: `#ecfdf5` (light green)
- Border: `#a7f3d0` (green)
- Text: `#065f46` (dark green)
- Icon: `#10b981` (green)

#### Fair (50-79%)
- Background: `#fef3c7` (light yellow)
- Border: `#fcd34d` (yellow)
- Text: `#92400e` (dark yellow)
- Icon: `#f59e0b` (yellow)

#### Poor (<50%)
- Background: `#fee2e2` (light red)
- Border: `#fca5a5` (red)
- Text: `#991b1b` (dark red)
- Icon: `#ef4444` (red)

### Warning Overlay
- Background: `#7f1d1d` (dark red) with 90% opacity
- Text: `#ffffff` (white)
- Warning text: `#fcd34d` (yellow)
- Border: `#dc2626` (red)

## Responsive Behavior

### Desktop (>1024px)
```
┌────────────────────────────────────────────────────────┐
│  Full-width warning overlay                            │
│  Large icons (80px)                                    │
│  Detailed text                                         │
│  Spacious layout                                       │
└────────────────────────────────────────────────────────┘
```

### Mobile (<768px)
```
┌──────────────────────────────┐
│  Full-screen warning         │
│  Medium icons (60px)         │
│  Condensed text              │
│  Vertical layout             │
└──────────────────────────────┘
```

## Animation Details

### Warning Appearance
```
Entry: Fade in (0.3s)
Effect: Opacity 0 → 0.9
Timing: ease-in-out
```

### Detection Status Update
```
Transition: Color change (0.3s)
Effect: Smooth color fade
Update: Every 150ms
```

### Metrics Update
```
Transition: Number change (0.3s)
Effect: Smooth count animation
Update: Real-time
```

## User Experience Flow

### Good Detection Path
```
1. Start Interview
   ↓
2. Video shows clearly
   ↓
3. Green indicator: "95% - Excellent"
   ↓
4. Metrics update smoothly
   ↓
5. Finish question (no alert)
   ↓
6. Full scores received
```

### Poor Detection Path
```
1. Start Interview
   ↓
2. Camera blocked/poor lighting
   ↓
3. Red warning overlay appears
   ↓
4. Red indicator: "15% - Poor - Scores will be 0"
   ↓
5. Metrics show 0 or don't update
   ↓
6. Try to finish question
   ↓
7. Alert: "Face only detected in 15%"
   ↓
8. User can cancel to re-record
   ↓
9. If continue: Score = 0
   ↓
10. Feedback explains issue
```

## Accessibility

### Screen Reader Announcements
```
"Warning: Camera blocked or no face detected"
"Face detection at 15 percent, poor quality"
"Scores will be zero without face detection"
```

### Keyboard Navigation
```
Tab: Navigate through warning elements
Enter: Dismiss warning (if dismissible)
Esc: Cancel action
```

### High Contrast Mode
```
All warnings maintain 4.5:1 contrast ratio
Icons have clear outlines
Text is readable in all modes
```

## Summary

Users will see:
1. **Immediate visual feedback** when camera is blocked (full-screen red overlay)
2. **Real-time detection percentage** with color-coded status
3. **Pre-submission warning** if detection is poor
4. **Clear explanation** in final feedback
5. **Actionable guidance** on how to fix issues

**Result:** No confusion about why scores are low, and clear path to improvement.
