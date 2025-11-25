# 🎮 Gamification & Leveling System

## Overview

Transform your app into an addictive, game-like experience with a comprehensive leveling system!

---

## 📊 Points System

### Point Calculation Formula

```typescript
Points = Base Points × Difficulty Multiplier × Duration Multiplier × Star Multiplier
```

### Base Points by Difficulty:
- **Easy**: 10 points
- **Intermediate**: 20 points  
- **Drop**: 30 points (special category!)
- **Advanced**: 40 points

### Duration Multiplier:
- 0-30 seconds: ×1.0
- 31-60 seconds: ×1.5
- 61-120 seconds: ×2.0
- 121+ seconds: ×2.5

### Star Multiplier:
- 1 Star: ×1.0
- 2 Stars: ×1.3

### Examples:
1. **Easy 1-star, 30 seconds**: 10 × 1.0 × 1.0 = **10 points**
2. **Easy 2-star, 30 seconds**: 10 × 1.3 × 1.0 = **13 points**
3. **Intermediate 1-star, 45 seconds**: 20 × 1.0 × 1.5 = **30 points**
4. **Drop 2-star, 90 seconds**: 30 × 1.3 × 2.0 = **78 points**
5. **Advanced 2-star, 150 seconds**: 40 × 1.3 × 2.5 = **130 points**

---

## 🎯 Level Progression System

### Level Structure:

```
Level 1: Easy 1⭐ (Beginner)
Level 2: Easy 2⭐ (Beginner+)
Level 3: Intermediate 1⭐ (Intermediate)
Level 4: Intermediate 2⭐ (Intermediate+)
Level 5: Drop 1⭐ (Drop Beginner)
Level 6: Drop 2⭐ (Drop Pro)
Level 7: Advanced 1⭐ (Advanced)
Level 8: Advanced 2⭐ (Master)
```

### Points Required Per Level:

```typescript
const LEVEL_THRESHOLDS = {
  1: 0,       // Starting level
  2: 100,     // ~7 easy 1-star tutorials
  3: 250,     // ~5 easy 2-star tutorials
  4: 450,     // ~7 intermediate 1-star tutorials
  5: 700,     // ~6 intermediate 2-star tutorials
  6: 1000,    // ~7 drop 1-star tutorials
  7: 1400,    // ~6 drop 2-star tutorials
  8: 1900,    // ~7 advanced 1-star tutorials
  9: 2500,    // ~5 advanced 2-star tutorials (MASTER level)
}
```

This ensures users need 5-7 tutorials per level (as requested!)

---

## 🗄️ Database Schema

### New Table: `user_levels`

```sql
CREATE TABLE user_levels (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  current_level INTEGER DEFAULT 1 NOT NULL,
  total_points INTEGER DEFAULT 0 NOT NULL,
  points_to_next_level INTEGER NOT NULL,
  streak_days INTEGER DEFAULT 0 NOT NULL,
  longest_streak INTEGER DEFAULT 0 NOT NULL,
  last_activity_date DATE,
  total_tutorials_completed INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_levels ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own level"
  ON user_levels FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own level"
  ON user_levels FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own level"
  ON user_levels FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Update `user_progress` Table:

```sql
ALTER TABLE user_progress
ADD COLUMN points_earned INTEGER DEFAULT 0;
```

---

## 💻 Implementation

### 1. Points Calculation Function

Create: `lib/gamification/points.ts`

```typescript
export function calculatePoints(
  difficulty: 'easy' | 'intermediate' | 'advanced' | 'drop',
  difficultyStars: number,
  durationMinutes: number | null
): number {
  // Base points
  const basePoints = {
    easy: 10,
    intermediate: 20,
    drop: 30,
    advanced: 40,
  }[difficulty]

  // Duration multiplier (convert minutes to seconds)
  const durationSeconds = (durationMinutes || 0.5) * 60
  let durationMultiplier = 1.0
  if (durationSeconds > 30 && durationSeconds <= 60) {
    durationMultiplier = 1.5
  } else if (durationSeconds > 60 && durationSeconds <= 120) {
    durationMultiplier = 2.0
  } else if (durationSeconds > 120) {
    durationMultiplier = 2.5
  }

  // Star multiplier
  const starMultiplier = difficultyStars === 2 ? 1.3 : 1.0

  const totalPoints = Math.round(basePoints * durationMultiplier * starMultiplier)
  return totalPoints
}

export function calculateLevelFromPoints(totalPoints: number): {
  currentLevel: number
  pointsToNextLevel: number
  progressPercentage: number
} {
  const thresholds = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500]
  
  let currentLevel = 1
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (totalPoints >= thresholds[i]) {
      currentLevel = i + 1
      break
    }
  }

  const isMaxLevel = currentLevel >= thresholds.length
  const pointsToNextLevel = isMaxLevel ? 0 : thresholds[currentLevel] - totalPoints
  
  // Calculate progress percentage
  let progressPercentage = 0
  if (!isMaxLevel) {
    const currentThreshold = thresholds[currentLevel - 1]
    const nextThreshold = thresholds[currentLevel]
    const pointsIntoLevel = totalPoints - currentThreshold
    const totalPointsNeeded = nextThreshold - currentThreshold
    progressPercentage = Math.round((pointsIntoLevel / totalPointsNeeded) * 100)
  } else {
    progressPercentage = 100
  }

  return {
    currentLevel,
    pointsToNextLevel,
    progressPercentage,
  }
}

export function getLevelName(level: number): string {
  const names = [
    'Beginner',           // Level 1
    'Beginner+',          // Level 2
    'Intermediate',       // Level 3
    'Intermediate+',      // Level 4
    'Drop Beginner',      // Level 5
    'Drop Pro',           // Level 6
    'Advanced',           // Level 7
    'Advanced+',          // Level 8
    'Master',             // Level 9
  ]
  return names[level - 1] || 'Master'
}

export function getLevelIcon(level: number): string {
  const icons = ['🌱', '🌿', '🌸', '🌺', '💫', '⭐', '🔥', '💎', '👑']
  return icons[level - 1] || '👑'
}
```

### 2. Level Progress Component

Create: `components/level-progress-bar.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getLevelName, getLevelIcon, calculateLevelFromPoints } from '@/lib/gamification/points'
import { Trophy, TrendingUp } from 'lucide-react'

export function LevelProgressBar() {
  const [levelData, setLevelData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchLevelData()
  }, [])

  const fetchLevelData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('user_levels')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data) {
        const levelInfo = calculateLevelFromPoints(data.total_points)
        setLevelData({ ...data, ...levelInfo })
      }
    } catch (error) {
      console.error('Error fetching level data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !levelData) return null

  return (
    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4 shadow-lg text-white">
      {/* Level Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{getLevelIcon(levelData.current_level)}</div>
          <div>
            <div className="text-xs opacity-90">Level {levelData.current_level}</div>
            <div className="font-bold text-lg">{getLevelName(levelData.current_level)}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            <span className="font-bold text-lg">{levelData.total_points}</span>
          </div>
          <div className="text-xs opacity-90">Total Points</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="h-full bg-white rounded-full transition-all duration-500 ease-out shadow-lg"
            style={{ width: `${levelData.progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2 text-xs">
          <span className="opacity-90">
            {levelData.progressPercentage}% to next level
          </span>
          <span className="font-semibold">
            {levelData.pointsToNextLevel} points needed
          </span>
        </div>
      </div>

      {/* Streak Info */}
      {levelData.streak_days > 0 && (
        <div className="mt-3 flex items-center justify-center gap-2 bg-white/10 rounded-lg py-2 px-3 backdrop-blur-sm">
          <div className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-orange-300" />
            <span className="font-bold">{levelData.streak_days} day streak!</span>
          </div>
        </div>
      )}
    </div>
  )
}
```

### 3. Award Points When Tutorial Completed

Update progress tracking to award points:

```typescript
// In your tutorial completion function
async function completeTutorial(tutorialId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // Get tutorial details
  const { data: tutorial } = await supabase
    .from('tutorials')
    .select('difficulty, difficulty_stars, duration_minutes')
    .eq('id', tutorialId)
    .single()

  if (!tutorial) return

  // Calculate points
  const pointsEarned = calculatePoints(
    tutorial.difficulty,
    tutorial.difficulty_stars || 1,
    tutorial.duration_minutes
  )

  // Update user_progress with points
  await supabase
    .from('user_progress')
    .update({
      completed: true,
      completed_at: new Date().toISOString(),
      points_earned: pointsEarned,
    })
    .eq('user_id', user.id)
    .eq('tutorial_id', tutorialId)

  // Update user_levels
  const { data: levelData } = await supabase
    .from('user_levels')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (levelData) {
    const newTotalPoints = levelData.total_points + pointsEarned
    const { currentLevel, pointsToNextLevel } = calculateLevelFromPoints(newTotalPoints)
    
    const wasLevelUp = currentLevel > levelData.current_level

    await supabase
      .from('user_levels')
      .update({
        total_points: newTotalPoints,
        current_level: currentLevel,
        points_to_next_level: pointsToNextLevel,
        total_tutorials_completed: levelData.total_tutorials_completed + 1,
        last_activity_date: new Date().toDateString(),
      })
      .eq('user_id', user.id)

    // Show level up celebration!
    if (wasLevelUp) {
      showLevelUpModal(currentLevel)
    }
  }
}
```

---

## 🎊 Level Up Celebration

Create a beautiful modal that shows when user levels up!

---

## 📈 Leaderboard (Optional)

Add a leaderboard to make it more competitive:

```sql
CREATE TABLE leaderboard (
  user_id UUID REFERENCES auth.users(id),
  username TEXT,
  total_points INTEGER,
  current_level INTEGER,
  rank INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔥 Additional Gamification Features

### 1. **Daily Streaks**
- Track consecutive days of practice
- Bonus points for maintaining streaks
- 7-day streak: +50 bonus points
- 30-day streak: +200 bonus points

### 2. **Achievements/Badges**
- First tutorial completed
- 10 tutorials completed
- Reach level 5
- Complete all tutorials in a collection
- 7-day streak
- 30-day streak

### 3. **Daily Challenges**
- "Complete 3 intermediate tutorials today"
- "Practice for 15 minutes"
- Extra points for completing challenges

### 4. **Social Features**
- Share achievements
- Follow friends
- Compare progress
- Weekly challenges with friends

---

## 🚀 Implementation Priority

1. **Phase 1** (Essential):
   - Points system
   - Level progression
   - Progress bar

2. **Phase 2** (High Value):
   - Streaks
   - Level up celebrations
   - Basic achievements

3. **Phase 3** (Nice to Have):
   - Leaderboard
   - Daily challenges
   - Social features

---

## ✅ To Implement:

1. Run the SQL to create `user_levels` table
2. Create `lib/gamification/points.ts`
3. Create `components/level-progress-bar.tsx`
4. Update tutorial completion logic to award points
5. Add LevelProgressBar to home page and profile

**Want me to implement this now?** Just say the word! 🚀


