# EcoTrace: Technical Implementation Guide
## SKILL.md - Development & Architecture Documentation

**Version:** 1.0  
**Last Updated:** Agustus 2026  
**Status:** Development Ready  
**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Prisma, PostgreSQL  
**Target:** Progressive Web App (PWA) dengan Offline Support

---

## 1. Project Setup & Environment

### 1.1 Repository Structure
```
ecotrace/
├── apps/
│   ├── web/                 # Next.js frontend + server components
│   │   ├── app/             # App router pages & layouts
│   │   │   ├── (auth)/      # Auth pages group
│   │   │   ├── (dashboard)/ # Authenticated pages group
│   │   │   ├── api/         # Route handlers
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/      # Reusable React components
│   │   │   ├── ui/          # Shadcn/ui components
│   │   │   ├── features/    # Feature-specific components
│   │   │   └── common/      # Global components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions & helpers
│   │   ├── styles/          # Global styles & Tailwind config
│   │   ├── public/          # Static assets
│   │   ├── next.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── api/                 # Express backend (optional, if separate)
├── packages/
│   ├── db/                  # Prisma schema & migrations
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── types/               # Shared TypeScript types
├── docker-compose.yml       # Local development
├── .github/
│   └── workflows/           # CI/CD pipelines
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT.md
└── README.md
```

### 1.2 Environment Variables

#### Development (.env.local)
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ecotrace_dev"
DIRECT_URL="postgresql://user:password@localhost:5432/ecotrace_dev"

# Next.js
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Authentication
JWT_SECRET="your-super-secret-key-min-32-chars"
JWT_EXPIRATION="24h"

# Email (SendGrid or similar)
SENDGRID_API_KEY="SG.xxxxx"
SENDGRID_FROM_EMAIL="noreply@ecotrace.id"

# Optional: University SSO
UNIVERSITY_SSO_CLIENT_ID="xxxx"
UNIVERSITY_SSO_CLIENT_SECRET="xxxx"

# Analytics & Monitoring
NEXT_PUBLIC_POSTHOG_KEY="xxxx"
SENTRY_DSN="https://xxxxx@sentry.io/xxxxx"
```

#### Production (.env.production)
```bash
# Use managed database service (Supabase, Railway, etc.)
DATABASE_URL="postgresql://xxxx@db.xxx.supabase.co:5432/postgres"
DIRECT_URL="postgresql://xxxx@db.xxx.supabase.co:5432/postgres"

NEXT_PUBLIC_API_URL="https://ecotrace.yourdomain.com"
NEXT_PUBLIC_APP_URL="https://ecotrace.yourdomain.com"

# Production secrets (managed via secrets manager)
JWT_SECRET="xxx"

# Email production
SENDGRID_API_KEY="SG.xxx"

# Optional Vercel KV for caching
KV_URL="redis://xxxx:xxxx@xxx.upstash.io"
KV_REST_API_URL="https://xxx.upstash.io"
KV_REST_API_TOKEN="xxxx"
```

### 1.3 Initial Setup Commands

```bash
# Clone & install
git clone https://github.com/yourusername/ecotrace.git
cd ecotrace/apps/web
npm install

# Setup database
cp .env.example .env.local
# Edit .env.local dengan database credentials lokal
npx prisma migrate dev --name init

# Seed initial data (emission factors, challenges)
npx prisma db seed

# Run development server
npm run dev
# Buka http://localhost:3000
```

---

## 2. Architecture Overview

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser/Mobile)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Next.js App (React Components + Server Components) │   │
│  │  - Auth UI (Login/Signup)                            │   │
│  │  - Carbon Logger (Form)                             │   │
│  │  - Dashboard (Charts & Visualizations)              │   │
│  │  - Challenges (Browse & Participate)                │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Service Worker (Offline Support)                    │   │
│  │  - Cache strategy (network first for data)          │   │
│  │  - Background sync queue                            │   │
│  │  - Push notifications                               │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Local Storage / IndexedDB (Client-side DB)         │   │
│  │  - Pending activities queue                         │   │
│  │  - User preferences & cache                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↕ HTTPS/WebSocket
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js + Express)              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Route Handlers / API Endpoints (app/api/*)         │   │
│  │  - POST /api/auth/signup, /login                    │   │
│  │  - POST /api/activities (Create)                    │   │
│  │  - GET /api/activities (List/Filter)                │   │
│  │  - GET /api/dashboard (Personal metrics)            │   │
│  │  - GET /api/community (Leaderboard, aggregates)     │   │
│  │  - POST/GET /api/challenges (Browse, Join)          │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Business Logic Layer                               │   │
│  │  - AuthService (JWT, session management)            │   │
│  │  - ActivityService (Emission calculation)           │   │
│  │  - ChallengeService (Tracking & verification)       │   │
│  │  - CommunityService (Aggregation & leaderboard)     │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Middleware & Cross-Cutting Concerns                │   │
│  │  - Authentication & authorization                   │   │
│  │  - Request validation & sanitization               │   │
│  │  - Error handling & logging                         │   │
│  │  - Rate limiting                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↕ SQL/Prisma
┌─────────────────────────────────────────────────────────────┐
│                   DATA LAYER (PostgreSQL)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Tables:                                             │   │
│  │  - users, profiles, sessions                        │   │
│  │  - activities, emission_factors                     │   │
│  │  - challenges, challenge_participations            │   │
│  │  - activity_aggregates (materialized views)         │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Caching Layer (Redis - Vercel KV)                  │   │
│  │  - Leaderboard cache (1h TTL)                       │   │
│  │  - User dashboard cache (15min TTL)                 │   │
│  │  - Emission factor cache (permanent)                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow Diagram: Activity Logging

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User Input: Carbon Logger Form                           │
│    (Activity type, value, timestamp)                        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Client-side Validation & Calculation                     │
│    (Zod validation, basic unit conversion)                  │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Store in Local Queue (if offline)                        │
│    or POST to API (if online)                               │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. POST /api/activities (Server Route Handler)              │
│    - JWT authentication                                     │
│    - Server-side validation                                 │
│    - Fetch emission factor dari database                   │
│    - Calculate CO2e: value * factor                        │
│    - Store in activities table                             │
│    - Invalidate caches (user dashboard, community)         │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Background Jobs (Optional, untuk scale)                  │
│    - Update leaderboard aggregates (Redis)                 │
│    - Trigger challenge progress check                      │
│    - Send notification if challenge completed              │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Return Response to Client                                │
│    - Activity ID, CO2e calculated, timestamp                │
│    - Refresh React state (TanStack Query invalidation)      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. UI Update: Show confirmation + updated dashboard metrics │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Database Schema (Prisma)

### 3.1 Core Schema Definition

```prisma
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ===== USER & AUTH =====
model User {
  id              String @id @default(cuid())
  email           String @unique
  name            String
  passwordHash    String
  
  // Profile
  cohort          String? // angkatan (e.g., "2022")
  department      String? // jurusan
  avatarUrl       String?
  bio             String?
  
  // Privacy & Settings
  isAnonymous     Boolean @default(true) // Hide name on leaderboard
  privacyLevel    String @default("private") // private, friends, public
  
  // Metadata
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  lastActiveAt    DateTime?
  
  // Relations
  activities      Activity[]
  challenges      ChallengeParticipation[]
  badges          Badge[]
  preferences     UserPreferences?
  
  @@index([email])
  @@index([createdAt])
}

model UserPreferences {
  id              String @id @default(cuid())
  userId          String @unique
  user            User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Notifications
  emailNotifications Boolean @default(true)
  pushNotifications Boolean @default(true)
  weeklyBriefing    Boolean @default(true)
  challengeReminders Boolean @default(true)
  
  // Defaults
  defaultTransportMode String? // e.g., "bus"
  dailyLogTarget      Int @default(5) // Number of activities per day
  
  // Units
  distanceUnit    String @default("km") // km or mi
  weightUnit      String @default("kg") // kg or lb
  energyUnit      String @default("kwh") // kwh or btu
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// ===== ACTIVITIES & CARBON =====
model ActivityCategory {
  id              String @id @default(cuid())
  name            String @unique // "transport", "energy", "food", "waste"
  label           String // Display name
  icon            String // Icon name (lucide-react)
  description     String?
  order           Int @default(0)
  
  activities      ActivityType[]
  factors         EmissionFactor[]
  
  createdAt       DateTime @default(now())
}

model ActivityType {
  id              String @id @default(cuid())
  categoryId      String
  category        ActivityCategory @relation(fields: [categoryId], references: [id])
  
  name            String // e.g., "bus_commute", "meat_consumption"
  label           String // Display name
  icon            String?
  description     String?
  unit            String // km, hour, kg, etc
  order           Int @default(0)
  
  activities      Activity[]
  factors         EmissionFactor[]
  
  @@unique([categoryId, name])
  @@index([categoryId])
}

model Activity {
  id              String @id @default(cuid())
  userId          String
  user            User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  activityTypeId  String
  activityType    ActivityType @relation(fields: [activityTypeId], references: [id])
  
  value           Float // Numeric value (km, hour, kg)
  unit            String // For flexibility
  co2Equivalent   Float // Calculated CO2e in kg
  
  // Metadata
  timestamp       DateTime @default(now()) // When activity occurred
  metadata        Json? // Additional data (e.g., {vehicle_type: "bus", passengers: 1})
  notes           String?
  
  // Verification
  verified        Boolean @default(false)
  verificationNote String?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([userId])
  @@index([timestamp])
  @@index([activityTypeId])
  @@index([createdAt])
}

model EmissionFactor {
  id              String @id @default(cuid())
  
  activityTypeId  String
  activityType    ActivityType @relation(fields: [activityTypeId], references: [id])
  
  categoryId      String
  category        ActivityCategory @relation(fields: [categoryId], references: [id])
  
  // Factor: value * factor = CO2e (kg)
  factor          Float // e.g., 0.195 for motorcycle
  unit            String // Per what unit (km, hour, kg)
  
  // Source & validity
  source          String? // "EPA 2023", "IPCC AR6"
  version         String // Date-based (e.g., "2023-01")
  validFrom       DateTime @default(now())
  validUntil      DateTime?
  
  // Metadata
  confidence      String @default("medium") // low, medium, high
  notes           String?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@unique([activityTypeId, version])
  @@index([activityTypeId])
  @@index([categoryId])
}

// ===== CHALLENGES & GAMIFICATION =====
model Challenge {
  id              String @id @default(cuid())
  title           String
  description     String
  descriptionLong String?
  
  // Categorization
  category        String // "reduction", "adoption", "community"
  activityCategory String? // e.g., "transport", "food" (null for multi-category)
  difficulty      String @default("medium") // easy, medium, hard
  
  // Timeline
  startDate       DateTime
  endDate         DateTime
  isActive        Boolean @default(true)
  
  // Target & reward
  targetReduction Float? // e.g., 10 (percent)
  rewardPoints    Int @default(25)
  rewardDescription String?
  
  // Visual & engagement
  icon            String?
  imageUrl        String?
  
  // Participation tracking
  maxParticipants Int? // null = unlimited
  
  // Metadata
  author          String? // Admin name
  notes           String?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  participations  ChallengeParticipation[]
  
  @@index([startDate])
  @@index([endDate])
  @@index([category])
  @@index([isActive])
}

model ChallengeParticipation {
  id              String @id @default(cuid())
  userId          String
  user            User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  challengeId     String
  challenge       Challenge @relation(fields: [challengeId], references: [id], onDelete: Cascade)
  
  // Tracking
  progress        Float @default(0) // 0-1 (0% - 100%)
  status          String @default("active") // active, completed, abandoned
  
  // Completion
  completedAt     DateTime?
  rewardClaimed   Boolean @default(false)
  rewardClaimedAt DateTime?
  
  // Metadata
  notes           String?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@unique([userId, challengeId])
  @@index([userId])
  @@index([challengeId])
  @@index([status])
}

// ===== GAMIFICATION & REWARDS =====
model Badge {
  id              String @id @default(cuid())
  name            String @unique
  label           String
  description     String?
  
  // Visual
  icon            String
  color           String?
  
  // Criteria
  criteria        Json? // e.g., {type: "activities_count", value: 100}
  
  // Achievement
  awardedCount    Int @default(0)
  
  users           User[]
  
  createdAt       DateTime @default(now())
}

model Leaderboard {
  id              String @id @default(cuid())
  userId          String
  
  // Emission totals (weekly, monthly, all-time)
  totalEmissionWeek   Float
  totalEmissionMonth  Float
  totalEmissionAllTime Float
  
  // Rankings
  rankLowestWeek      Int?
  rankMostImprovedMonth Int?
  rankMostEngagedMonth Int?
  
  // Update tracking
  updatedAt       DateTime @updatedAt
  
  @@index([userId])
  @@index([totalEmissionWeek])
  @@index([rankLowestWeek])
}

// ===== SESSIONS =====
model Session {
  id              String @id @default(cuid())
  userId          String
  token           String @unique
  expiresAt       DateTime
  createdAt       DateTime @default(now())
}
```

### 3.2 Key Indexes & Query Optimization

```sql
-- Indexes for common queries
CREATE INDEX idx_activities_user_timestamp ON activities(user_id, timestamp DESC);
CREATE INDEX idx_activities_category ON activities(activity_type_id);
CREATE INDEX idx_challenges_active ON challenges(is_active, start_date);
CREATE INDEX idx_participation_user_status ON challenge_participations(user_id, status);
CREATE INDEX idx_leaderboard_rank_week ON leaderboard(rank_lowest_week);

-- Materialized view untuk leaderboard (update setiap jam)
CREATE MATERIALIZED VIEW leaderboard_v AS
SELECT 
  u.id as user_id,
  COUNT(a.id) as activity_count,
  SUM(a.co2_equivalent) as total_emission,
  SUM(CASE WHEN a.timestamp > NOW() - INTERVAL '7 days' THEN a.co2_equivalent ELSE 0 END) as emission_week,
  ROW_NUMBER() OVER (ORDER BY SUM(CASE WHEN a.timestamp > NOW() - INTERVAL '7 days' THEN a.co2_equivalent ELSE 0 END) ASC) as rank_lowest_week
FROM users u
LEFT JOIN activities a ON u.id = a.user_id
GROUP BY u.id;

CREATE INDEX idx_leaderboard_rank ON leaderboard_v(rank_lowest_week);
```

---

## 4. Component Architecture

### 4.1 Component Structure

```
components/
├── ui/                          # Shadcn/ui base components
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── chart.tsx
│   └── ...
│
├── features/
│   ├── auth/
│   │   ├── SignupForm.tsx
│   │   ├── LoginForm.tsx
│   │   └── PasswordReset.tsx
│   │
│   ├── carbon-logger/
│   │   ├── ActivityForm.tsx         # Main form
│   │   ├── ActivityCategorySelector.tsx
│   │   ├── ActivityTypeSelector.tsx
│   │   ├── ValueInput.tsx           # Value + unit input
│   │   ├── QuickPresets.tsx         # Favorite activities
│   │   └── SubmissionConfirmation.tsx
│   │
│   ├── dashboard/
│   │   ├── PersonalMetricsCard.tsx  # Today, week, month, year
│   │   ├── EmissionTrendChart.tsx   # Line chart
│   │   ├── CategoryBreakdown.tsx    # Pie chart
│   │   ├── GoalProgress.tsx         # Goal tracker
│   │   └── RecentActivities.tsx     # Activity history
│   │
│   ├── community/
│   │   ├── CommunityDashboard.tsx   # Main view
│   │   ├── Leaderboard.tsx          # Rankings
│   │   ├── EmissionStats.tsx        # Community aggregates
│   │   ├── ChallengeWidget.tsx      # Active challenges
│   │   └── AnonymousToggle.tsx      # Privacy control
│   │
│   ├── challenges/
│   │   ├── ChallengeBrowser.tsx     # Browse & filter
│   │   ├── ChallengeCard.tsx        # Single challenge
│   │   ├── ChallengeDetail.tsx      # Detail view
│   │   ├── ProgressBar.tsx          # Progress indicator
│   │   ├── JoinButton.tsx           # Call-to-action
│   │   └── ChallengeLeaderboard.tsx # Per-challenge ranking
│   │
│   ├── user/
│   │   ├── ProfileCard.tsx          # User profile
│   │   ├── SettingsPanel.tsx        # Preferences
│   │   ├── NotificationSettings.tsx
│   │   └── PrivacySettings.tsx
│   │
│   └── analytics/
│       ├── AdminDashboard.tsx       # Admin view
│       ├── ReportGenerator.tsx      # Export reports
│       └── InsightWidget.tsx        # Key insights
│
└── common/
    ├── Navigation/
    │   ├── Navbar.tsx              # Top navigation
    │   ├── BottomTabBar.tsx        # Mobile bottom nav
    │   └── Sidebar.tsx             # Desktop sidebar
    ├── Modals/
    │   ├── EmissionModal.tsx
    │   └── ConfirmDialog.tsx
    ├── Charts/
    │   ├── LineChart.tsx
    │   ├── PieChart.tsx
    │   └── BarChart.tsx
    ├── Loading/
    │   ├── Skeleton.tsx
    │   ├── Spinner.tsx
    │   └── LoadingState.tsx
    ├── Error/
    │   ├── ErrorBoundary.tsx
    │   ├── ErrorCard.tsx
    │   └── NetworkError.tsx
    └── Empty/
        └── EmptyState.tsx
```

### 4.2 Component Examples

#### ActivityForm Component
```typescript
// components/features/carbon-logger/ActivityForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// Validation schema
const activitySchema = z.object({
  activityTypeId: z.string().min(1, 'Select activity type'),
  value: z.number().positive('Value must be positive'),
  unit: z.string(),
  timestamp: z.date().default(() => new Date()),
  notes: z.string().optional(),
});

type ActivityFormData = z.infer<typeof activitySchema>;

export function ActivityForm() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetch('/api/categories').then(r => r.json()),
  });

  const { data: activityTypes } = useQuery({
    queryKey: ['activity-types', selectedCategory],
    queryFn: () => 
      fetch(`/api/activity-types?category=${selectedCategory}`)
        .then(r => r.json()),
    enabled: !!selectedCategory,
  });

  const { register, handleSubmit, formState: { errors }, watch } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
  });

  const { mutate: submitActivity, isPending } = useMutation({
    mutationFn: (data: ActivityFormData) =>
      fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onSuccess: () => {
      // Show confirmation, reset form
      // Invalidate queries
    },
  });

  const onSubmit = (data: ActivityFormData) => {
    submitActivity(data);
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Log Your Activity</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Category Selector */}
        <div className="grid grid-cols-2 gap-2">
          {categories?.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-3 rounded-lg border-2 ${
                selectedCategory === cat.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <p className="text-sm font-medium">{cat.label}</p>
            </button>
          ))}
        </div>

        {/* Activity Type Selector */}
        {selectedCategory && (
          <select {...register('activityTypeId')} className="input">
            <option value="">Select activity type</option>
            {activityTypes?.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        )}

        {/* Value Input */}
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Value"
            {...register('value', { valueAsNumber: true })}
          />
          <select {...register('unit')} className="input flex-shrink-0">
            <option>km</option>
            <option>hour</option>
            <option>kg</option>
          </select>
        </div>

        {/* Notes */}
        <Input
          placeholder="Optional notes"
          {...register('notes')}
        />

        {/* Submit */}
        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full"
        >
          {isPending ? 'Saving...' : 'Log Activity'}
        </Button>
      </form>
    </Card>
  );
}
```

#### PersonalDashboard Component
```typescript
// components/features/dashboard/PersonalDashboard.tsx
'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PersonalMetricsCard } from './PersonalMetricsCard';
import { EmissionTrendChart } from './EmissionTrendChart';
import { CategoryBreakdown } from './CategoryBreakdown';

export function PersonalDashboard() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: () => fetch('/api/dashboard').then(r => r.json()),
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <PersonalMetricsCard
          label="Today"
          value={metrics.emissionToday}
          unit="kg CO₂e"
          icon="📊"
        />
        <PersonalMetricsCard
          label="This Week"
          value={metrics.emissionWeek}
          unit="kg CO₂e"
          change={metrics.weekChange}
        />
        <PersonalMetricsCard
          label="This Month"
          value={metrics.emissionMonth}
          unit="kg CO₂e"
          change={metrics.monthChange}
        />
        <PersonalMetricsCard
          label="This Year"
          value={metrics.emissionYear}
          unit="kg CO₂e"
          change={metrics.yearChange}
        />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <EmissionTrendChart data={metrics.trendData} />
        </div>
        <CategoryBreakdown data={metrics.categoryBreakdown} />
      </div>

      {/* Recent Activities */}
      <RecentActivitiesList />
    </div>
  );
}
```

---

## 5. API Route Handlers

### 5.1 Authentication Routes

```typescript
// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
  cohort: z.string().optional(),
  department: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = signupSchema.parse(body);

    // Check existing user
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create user
    const passwordHash = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash,
        cohort: data.cohort,
        department: data.department,
        preferences: {
          create: {}, // Create default preferences
        },
      },
    });

    // Create session token
    const token = generateJWT({
      userId: user.id,
      email: user.email,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof z.ZodError ? error.errors : 'Internal error' },
      { status: 500 }
    );
  }
}
```

```typescript
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, generateJWT } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !await verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = generateJWT({
      userId: user.id,
      email: user.email,
    });

    // Update lastActiveAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

### 5.2 Activity Routes

```typescript
// app/api/activities/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { calculateEmission } from '@/lib/emissions';
import { z } from 'zod';

const activitySchema = z.object({
  activityTypeId: z.string(),
  value: z.number().positive(),
  unit: z.string(),
  timestamp: z.string().datetime(),
  notes: z.string().optional(),
});

// POST /api/activities - Create new activity
export async function POST(req: NextRequest) {
  try {
    const userId = verifyAuth(req);
    const body = await req.json();
    const data = activitySchema.parse(body);

    // Get emission factor
    const activityType = await prisma.activityType.findUniqueOrThrow({
      where: { id: data.activityTypeId },
      include: {
        factors: {
          where: { validUntil: null },
          orderBy: { validFrom: 'desc' },
          take: 1,
        },
      },
    });

    const factor = activityType.factors[0];
    if (!factor) {
      return NextResponse.json(
        { error: 'No emission factor available' },
        { status: 400 }
      );
    }

    // Calculate CO2e
    const co2Equivalent = data.value * factor.factor;

    // Create activity
    const activity = await prisma.activity.create({
      data: {
        userId,
        activityTypeId: data.activityTypeId,
        value: data.value,
        unit: data.unit,
        co2Equivalent,
        timestamp: new Date(data.timestamp),
        notes: data.notes,
      },
    });

    // Invalidate caches
    await invalidateUserCache(userId);

    return NextResponse.json({
      activity,
      co2Equivalent: co2Equivalent.toFixed(2),
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// GET /api/activities?period=week&category=transport
export async function GET(req: NextRequest) {
  try {
    const userId = verifyAuth(req);
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'month';
    const category = searchParams.get('category');

    const dateFrom = getPeriodDateFrom(period);

    const activities = await prisma.activity.findMany({
      where: {
        userId,
        timestamp: { gte: dateFrom },
        ...(category && {
          activityType: { category: { name: category } },
        }),
      },
      include: { activityType: true },
      orderBy: { timestamp: 'desc' },
    });

    return NextResponse.json({ activities });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
```

### 5.3 Dashboard & Community Routes

```typescript
// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { kv } from '@vercel/kv';

export async function GET(req: NextRequest) {
  try {
    const userId = verifyAuth(req);

    // Try to get from cache first (15min TTL)
    const cachedData = await kv.get(`dashboard:${userId}`);
    if (cachedData) return NextResponse.json(cachedData);

    // Calculate metrics
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

    const [today, week, month, year] = await Promise.all([
      prisma.activity.aggregate({
        where: {
          userId,
          timestamp: {
            gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          },
        },
        _sum: { co2Equivalent: true },
      }),
      prisma.activity.aggregate({
        where: { userId, timestamp: { gte: weekAgo } },
        _sum: { co2Equivalent: true },
      }),
      prisma.activity.aggregate({
        where: { userId, timestamp: { gte: monthAgo } },
        _sum: { co2Equivalent: true },
      }),
      prisma.activity.aggregate({
        where: { userId, timestamp: { gte: yearAgo } },
        _sum: { co2Equivalent: true },
      }),
    ]);

    // Trend data for chart
    const trendData = await getTrendData(userId, 'week');

    // Category breakdown
    const categoryBreakdown = await getCategoryBreakdown(userId, 'month');

    const dashboardData = {
      emissionToday: today._sum.co2Equivalent || 0,
      emissionWeek: week._sum.co2Equivalent || 0,
      emissionMonth: month._sum.co2Equivalent || 0,
      emissionYear: year._sum.co2Equivalent || 0,
      trendData,
      categoryBreakdown,
      lastUpdated: new Date(),
    };

    // Cache for 15 minutes
    await kv.setex(`dashboard:${userId}`, 900, dashboardData);

    return NextResponse.json(dashboardData);
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
```

```typescript
// app/api/community/leaderboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { kv } from '@vercel/kv';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || 'lowest'; // lowest, most_improved, most_engaged
  const period = searchParams.get('period') || 'week';

  // Check cache (1h TTL)
  const cacheKey = `leaderboard:${category}:${period}`;
  const cached = await kv.get(cacheKey);
  if (cached) return NextResponse.json(cached);

  const dateFrom = getPeriodDateFrom(period);

  let query;
  if (category === 'lowest') {
    query = await prisma.activity.groupBy({
      by: ['userId'],
      where: { timestamp: { gte: dateFrom } },
      _sum: { co2Equivalent: true },
      orderBy: { _sum: { co2Equivalent: 'asc' } },
      take: 20,
    });
  } else if (category === 'most_improved') {
    // Compare current period with previous period
    query = await getMostImprovedLeaderboard(dateFrom);
  }

  // Enrich with user data (respect privacy settings)
  const leaderboard = await Promise.all(
    query.map(async (entry) => {
      const user = await prisma.user.findUnique({
        where: { id: entry.userId },
        select: {
          id: true,
          name: entry.isAnonymous ? false : true,
          avatarUrl: entry.isAnonymous ? false : true,
          isAnonymous: true,
        },
      });

      return {
        rank: query.indexOf(entry) + 1,
        user: {
          id: user?.id,
          name: user?.isAnonymous ? 'Anonymous' : user?.name,
          avatar: user?.isAnonymous ? null : user?.avatarUrl,
        },
        emission: entry._sum.co2Equivalent,
      };
    })
  );

  // Cache
  await kv.setex(cacheKey, 3600, { leaderboard, updatedAt: new Date() });

  return NextResponse.json({ leaderboard });
}
```

### 5.4 Challenge Routes

```typescript
// app/api/challenges/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

// GET /api/challenges?status=active&category=transport
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || 'active';
  const category = searchParams.get('category');

  const challenges = await prisma.challenge.findMany({
    where: {
      isActive: status === 'active',
      ...(category && { activityCategory: category }),
      startDate: { lte: new Date() },
      endDate: { gte: new Date() },
    },
    include: {
      _count: { select: { participations: true } },
    },
    orderBy: { startDate: 'asc' },
  });

  return NextResponse.json({ challenges });
}

// POST /api/challenges/:id/join
export async function POST(req: NextRequest) {
  const userId = verifyAuth(req);
  const challengeId = req.nextUrl.pathname.split('/').pop();

  const challenge = await prisma.challenge.findUniqueOrThrow({
    where: { id: challengeId },
  });

  // Check if already joined
  const existing = await prisma.challengeParticipation.findUnique({
    where: { userId_challengeId: { userId, challengeId } },
  });

  if (existing) {
    return NextResponse.json(
      { error: 'Already joined this challenge' },
      { status: 400 }
    );
  }

  const participation = await prisma.challengeParticipation.create({
    data: { userId, challengeId },
  });

  // Send welcome notification
  // await sendNotification(userId, `Welcome to ${challenge.title}!`);

  return NextResponse.json({ participation }, { status: 201 });
}
```

---

## 6. State Management & Hooks

### 6.1 TanStack Query Setup

```typescript
// lib/query-client.ts
import {
  QueryClient,
  DefaultOptions,
} from '@tanstack/react-query';

const queryConfig: DefaultOptions = {
  queries: {
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });
```

```typescript
// app/layout.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

### 6.2 Custom Hooks

```typescript
// hooks/useAuth.ts
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsLoading(false);
      return;
    }

    // Verify token
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setUser(data.user))
      .catch((err) => {
        setError(err.message);
        localStorage.removeItem('authToken');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    localStorage.setItem('authToken', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    router.push('/login');
  };

  return { user, isLoading, error, login, logout };
}
```

```typescript
// hooks/useEmissionData.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useEmissionData(period: 'day' | 'week' | 'month' = 'week') {
  return useQuery({
    queryKey: ['emissions', period],
    queryFn: () =>
      fetch(`/api/dashboard?period=${period}`).then((r) => r.json()),
  });
}

export function useLogActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activity) =>
      fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity),
      }).then((r) => r.json()),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['emissions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });
}
```

---

## 7. Design Tokens & Styling

### 7.1 Tailwind CSS Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary: Green (Eco/Environmental)
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Main
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#145231',
        },
        // Secondary: Blue (Trust, Action)
        secondary: {
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // Accent: Orange (Urgency, Challenge)
        accent: {
          500: '#f97316',
          600: '#ea580c',
        },
        // Status colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#06b6d4',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: '0.75rem',      // 12px
        sm: '0.875rem',     // 14px
        base: '1rem',       // 16px
        lg: '1.125rem',     // 18px
        xl: '1.25rem',      // 20px
        '2xl': '1.5rem',    // 24px
        '3xl': '1.875rem',  // 30px
      },
      spacing: {
        'safe-top': 'max(1rem, env(safe-area-inset-top))',
        'safe-bottom': 'max(1rem, env(safe-area-inset-bottom))',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};

export default config;
```

### 7.2 Component Styling Examples

```typescript
// components/features/carbon-logger/ActivityForm.tsx excerpt
// Using Tailwind + custom classes for consistency

export function ActivityForm() {
  return (
    <Card className="p-6 space-y-4">
      {/* Icon Grid for Categories */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={clsx(
              'group relative p-4 rounded-xl border-2 transition-all',
              'hover:border-primary-300 hover:shadow-md',
              selectedCategory === cat.id
                ? 'border-primary-500 bg-primary-50 shadow-lg'
                : 'border-gray-200 bg-white'
            )}
          >
            <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">
              {cat.icon}
            </span>
            <p className="text-xs font-semibold text-gray-700">{cat.label}</p>
          </button>
        ))}
      </div>

      {/* Input Fields with Icons */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            icon="📏"
            placeholder="Distance (km)"
            className="flex-1"
          />
          <select className="px-3 py-2 rounded-lg border-2 border-gray-200">
            <option>km</option>
            <option>mi</option>
          </select>
        </div>
      </div>

      {/* Submit Button with Loading State */}
      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="w-full"
        variant={isPending ? 'ghost' : 'default'}
      >
        {isPending ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Saving...
          </>
        ) : (
          'Log Activity'
        )}
      </Button>
    </Card>
  );
}
```

---

## 8. Offline Functionality & Service Worker

### 8.1 Service Worker Implementation

```typescript
// public/sw.js
const CACHE_NAME = 'ecotrace-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/_next/static/chunks/main.js',
  '/_next/static/css/main.css',
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
  if (event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, response.clone());
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => {
            return cached || caches.match('/offline.html');
          });
        })
    );
  } else if (event.request.method === 'POST') {
    // For POST requests, queue them for later sync
    event.respondWith(queueOfflineRequest(event.request));
  }
});

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-activities') {
    event.waitUntil(syncPendingActivities());
  }
});

async function syncPendingActivities() {
  const db = await openDB();
  const pending = await db.getAll('pendingActivities');
  
  for (const activity of pending) {
    try {
      await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity),
      });
      await db.delete('pendingActivities', activity.id);
    } catch (error) {
      console.error('Failed to sync:', error);
    }
  }
}
```

### 8.2 PWA Configuration

```typescript
// next.config.ts
import withPWA from 'next-pwa';

const withPWAConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\./i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 5 * 60,
        },
      },
    },
  ],
});

export default withPWAConfig({
  // other Next.js config
});
```

```json
// public/manifest.json
{
  "name": "EcoTrace - Carbon Footprint Tracker",
  "short_name": "EcoTrace",
  "description": "Track and reduce your carbon footprint with your campus community",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#22c55e",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-192-maskable.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/1.png",
      "sizes": "540x720",
      "type": "image/png"
    }
  ]
}
```

---

## 9. Testing Strategy

### 9.1 Unit Tests (Vitest)

```typescript
// __tests__/lib/emissions.test.ts
import { describe, it, expect } from 'vitest';
import { calculateEmission } from '@/lib/emissions';

describe('calculateEmission', () => {
  it('calculates emission correctly for bus commute', () => {
    const emission = calculateEmission({
      activityType: 'bus_commute',
      value: 10,
      factor: 0.086,
    });
    expect(emission).toBeCloseTo(0.86, 2);
  });

  it('handles different units', () => {
    const emission = calculateEmission({
      activityType: 'meat_consumption',
      value: 200,
      unit: 'g',
      factor: 21,
    });
    expect(emission).toBeCloseTo(4.2, 1);
  });
});
```

### 9.2 Integration Tests (Playwright)

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can sign up and log in', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('text=Sign Up');
  
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('text=Welcome')).toBeVisible();
});
```

### 9.3 Test Coverage Targets

- **Unit Tests:** 70%+ coverage for business logic
- **Integration Tests:** Core user flows (auth, logging, challenges)
- **E2E Tests:** Critical paths (signup → log activity → view dashboard → join challenge)

---

## 10. Deployment & DevOps

### 10.1 GitHub Actions CI/CD

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/ecotrace_test

      - name: Run linter
        run: npm run lint

      - name: Build
        run: npm run build

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  deploy:
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    needs: test

    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### 10.2 Vercel Deployment

```bash
# Deploy to Vercel
vercel deploy --prod

# Or via GitHub (auto-deploy on main branch)
# Configure in Vercel dashboard:
# - Connect GitHub repo
# - Set environment variables
# - Configure preview deployments
```

### 10.3 Database Migrations

```bash
# Create migration
npx prisma migrate dev --name add_emission_factors

# Apply migrations in production
npx prisma migrate deploy

# Seed initial data
npx prisma db seed
```

---

## 11. Performance Optimization

### 11.1 Image Optimization

```typescript
// components/common/OptimizedImage.tsx
import Image from 'next/image';

export function OptimizedImage({ src, alt, ...props }) {
  return (
    <Image
      src={src}
      alt={alt}
      quality={75}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      {...props}
    />
  );
}
```

### 11.2 Code Splitting & Lazy Loading

```typescript
import dynamic from 'next/dynamic';

const AdminDashboard = dynamic(
  () => import('@/components/AdminDashboard'),
  { loading: () => <LoadingSkeleton />, ssr: false }
);
```

### 11.3 API Response Caching

```typescript
// lib/cache.ts
export async function getCachedData(key: string, ttlSeconds: number = 300) {
  const cached = await kv.get(key);
  if (cached) return cached;

  // Fetch fresh data
  const data = await fetchData(key);
  await kv.setex(key, ttlSeconds, data);
  return data;
}
```

---

## 12. Security Best Practices

### 12.1 Input Validation & Sanitization

```typescript
// lib/validation.ts
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

export const activitySchema = z.object({
  value: z.number().positive(),
  notes: z.string().optional().transform(s => DOMPurify.sanitize(s || '')),
});
```

### 12.2 Rate Limiting

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'),
});

export async function checkRateLimit(identifier: string) {
  const { success } = await ratelimit.limit(identifier);
  return success;
}

// Usage in route handler
if (!(await checkRateLimit(userId))) {
  return NextResponse.json({ error: 'Rate limited' }, { status: 429 });
}
```

### 12.3 CORS & Security Headers

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|favicon.ico).*)'],
};
```

---

## 13. Monitoring & Logging

### 13.1 Sentry Configuration

```typescript
// instrument.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  beforeSend(event) {
    if (event.exception) {
      return event;
    }
    return null;
  },
});
```

### 13.2 Analytics

```typescript
// lib/analytics.ts
import PostHog from 'posthog-js';

export function initAnalytics() {
  if (typeof window !== 'undefined') {
    PostHog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: 'https://app.posthog.com',
    });
  }
}

export function trackEvent(name: string, properties?: Record<string, any>) {
  PostHog.capture(name, properties);
}

// Usage
trackEvent('activity_logged', { category: 'transport', emission: 0.5 });
trackEvent('challenge_completed', { challengeId: '123' });
```

---

## 14. Documentation Standards

### 14.1 Code Comments

```typescript
/**
 * Calculate CO2 equivalent emission for an activity
 *
 * @param activityType - Type of activity (e.g., "bus_commute")
 * @param value - Numeric value of the activity
 * @param factor - Emission factor in kg CO2e per unit
 * @returns Calculated CO2e in kg
 *
 * @example
 * const emission = calculateEmission('bus_commute', 10, 0.086);
 * // => 0.86 kg CO2e
 */
export function calculateEmission(
  activityType: string,
  value: number,
  factor: number
): number {
  return value * factor;
}
```

### 14.2 API Documentation (OpenAPI/Swagger)

```typescript
// lib/swagger.ts
/**
 * @swagger
 * /api/activities:
 *   post:
 *     summary: Log a new activity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Activity'
 *     responses:
 *       201:
 *         description: Activity created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActivityResponse'
 */
```

---

## 15. Troubleshooting & Common Issues

### Issue: Service Worker not updating
**Solution:** Use `skipWaiting: true` in PWA config, implement manual refresh prompt

### Issue: Database query timeout
**Solution:** Add indexes on frequently queried columns, use pagination for large result sets

### Issue: Offline sync fails
**Solution:** Implement retry logic with exponential backoff, queue management

---

## Appendix: Quick Start Checklist

- [ ] Clone repository
- [ ] Install Node 20+
- [ ] Copy `.env.example` to `.env.local`
- [ ] Install dependencies: `npm install`
- [ ] Setup PostgreSQL locally (Docker: `docker-compose up`)
- [ ] Run migrations: `npx prisma migrate dev`
- [ ] Seed data: `npx prisma db seed`
- [ ] Start dev server: `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Run tests: `npm test`
- [ ] Build for production: `npm run build`

---

**Document End**
