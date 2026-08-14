import {
  MOCK_ACTIVITIES,
  MOCK_USERS,
  MOCK_CHALLENGES,
  MOCK_PARTICIPATIONS,
  MockActivity,
  MockUser,
  MockChallenge,
  ChallengeParticipation,
} from './mock-data';
import { EMISSION_FACTORS } from './emission-factors';

const STORAGE_KEYS = {
  USER: 'ecotrace_current_user',
  ACTIVITIES: 'ecotrace_activities_v1',
  PARTICIPATIONS: 'ecotrace_participations_v1',
  PREFERENCES: 'ecotrace_user_preferences',
};

// Check client side
const isClient = typeof window !== 'undefined';

// Safe JSON parse helper
function safeJSONParse<T>(raw: string | null, fallback: T): T {
  if (!raw || raw === 'undefined' || raw === 'null' || raw.trim() === '') {
    return fallback;
  }
  try {
    return JSON.parse(raw) as T;
  } catch (e) {
    return fallback;
  }
}

// --- USER STORAGE ---
export function getCurrentUser(): MockUser {
  if (!isClient) return MOCK_USERS[0];
  const raw = localStorage.getItem(STORAGE_KEYS.USER);
  return safeJSONParse<MockUser>(raw, MOCK_USERS[0]);
}

export function setCurrentUser(user: MockUser | null): void {
  if (!isClient) return;
  if (user === null) {
    localStorage.removeItem(STORAGE_KEYS.USER);
  } else {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }
}

export function getAllUsers(): MockUser[] {
  const currentUser = getCurrentUser();
  const map = new Map<string, MockUser>();
  MOCK_USERS.forEach((u) => map.set(u.id, u));
  if (currentUser) map.set(currentUser.id, currentUser);
  return Array.from(map.values());
}

export function updateUserProfile(updatedFields: Partial<MockUser>): MockUser {
  const current = getCurrentUser();
  const updated = { ...current, ...updatedFields };
  setCurrentUser(updated);
  return updated;
}

// --- ACTIVITIES STORAGE ---
export function getStoredActivities(): MockActivity[] {
  if (!isClient) return MOCK_ACTIVITIES;
  const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
  const custom = safeJSONParse<MockActivity[]>(raw, []);
  if (custom.length > 0) {
    const customIds = new Set(custom.map((a) => a.id));
    const combined = [...custom, ...MOCK_ACTIVITIES.filter((a) => !customIds.has(a.id))];
    return combined.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  return MOCK_ACTIVITIES;
}

export function addActivity(activity: Omit<MockActivity, 'id'>): MockActivity {
  const newActivity: MockActivity = {
    ...activity,
    id: `act-user-${Date.now()}`,
  };

  if (isClient) {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      const custom = safeJSONParse<MockActivity[]>(raw, []);
      custom.unshift(newActivity);
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(custom));
    } catch (e) {
      console.error('Failed to save activity', e);
    }
  }
  return newActivity;
}

export function deleteActivity(id: string): boolean {
  if (!isClient) return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    const custom = safeJSONParse<MockActivity[]>(raw, []);
    const filtered = custom.filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('Failed to delete activity', e);
  }
  return false;
}

// --- PARTICIPATIONS STORAGE ---
export function getStoredParticipations(): ChallengeParticipation[] {
  if (!isClient) return MOCK_PARTICIPATIONS;
  const raw = localStorage.getItem(STORAGE_KEYS.PARTICIPATIONS);
  return safeJSONParse<ChallengeParticipation[]>(raw, MOCK_PARTICIPATIONS);
}

export function joinChallenge(userId: string, challengeId: string): ChallengeParticipation {
  const participations = getStoredParticipations();
  const existing = participations.find((p) => p.userId === userId && p.challengeId === challengeId);
  if (existing) return existing;

  const newPart: ChallengeParticipation = {
    id: `part-${Date.now()}`,
    userId,
    challengeId,
    progress: 10,
    status: 'active',
    joinedAt: new Date().toISOString(),
  };

  const updated = [newPart, ...participations];
  if (isClient) {
    localStorage.setItem(STORAGE_KEYS.PARTICIPATIONS, JSON.stringify(updated));
  }
  return newPart;
}

export function leaveChallenge(userId: string, challengeId: string): void {
  const participations = getStoredParticipations();
  const updated = participations.filter((p) => !(p.userId === userId && p.challengeId === challengeId));
  if (isClient) {
    localStorage.setItem(STORAGE_KEYS.PARTICIPATIONS, JSON.stringify(updated));
  }
}

// --- CALCULATIONS & AGGREGATIONS ---
export interface DashboardMetrics {
  todayCO2: number;
  todayTrend: number;
  weekCO2: number;
  weekTrend: number;
  monthCO2: number;
  monthTrend: number;
  yearCO2: number;
  yearTrend: number;
  trendData: Array<{ date: string; value: number; benchmark: number }>;
  categoryBreakdown: Array<{ name: string; value: number; percentage: number; color: string }>;
}

export function calculateDashboardMetrics(userId: string): DashboardMetrics {
  const allActivities = getStoredActivities();
  const userActivities = allActivities.filter((a) => a.userId === userId);

  const now = new Date('2026-08-14T23:59:59Z'); // Reference date
  const todayStart = new Date('2026-08-14T00:00:00Z');

  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const prevWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const monthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const prevMonthStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const yearStart = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

  let todayCO2 = 0;
  let weekCO2 = 0;
  let prevWeekCO2 = 0;
  let monthCO2 = 0;
  let prevMonthCO2 = 0;
  let yearCO2 = 0;

  const catSums: Record<string, number> = {
    transport: 0,
    food: 0,
    energy: 0,
    waste: 0,
  };

  userActivities.forEach((act) => {
    const actTime = new Date(act.timestamp).getTime();

    if (actTime >= todayStart.getTime()) {
      todayCO2 += act.co2Equivalent;
    }
    if (actTime >= weekStart.getTime()) {
      weekCO2 += act.co2Equivalent;
    } else if (actTime >= prevWeekStart.getTime()) {
      prevWeekCO2 += act.co2Equivalent;
    }

    if (actTime >= monthStart.getTime()) {
      monthCO2 += act.co2Equivalent;
      if (catSums[act.category] !== undefined) {
        catSums[act.category] += act.co2Equivalent;
      }
    } else if (actTime >= prevMonthStart.getTime()) {
      prevMonthCO2 += act.co2Equivalent;
    }

    if (actTime >= yearStart.getTime()) {
      yearCO2 += act.co2Equivalent;
    }
  });

  const weekTrend = prevWeekCO2 > 0 ? Number((((weekCO2 - prevWeekCO2) / prevWeekCO2) * 100).toFixed(1)) : -8.5;
  const monthTrend = prevMonthCO2 > 0 ? Number((((monthCO2 - prevMonthCO2) / prevMonthCO2) * 100).toFixed(1)) : -12.4;
  const todayTrend = -5.2;
  const yearTrend = -14.8;

  const trendData: Array<{ date: string; value: number; benchmark: number }> = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
    const dStart = new Date(d.setHours(0, 0, 0, 0)).getTime();
    const dEnd = new Date(d.setHours(23, 59, 59, 999)).getTime();

    const dayTotal = userActivities
      .filter((a) => {
        const t = new Date(a.timestamp).getTime();
        return t >= dStart && t <= dEnd;
      })
      .reduce((sum, a) => sum + a.co2Equivalent, 0);

    trendData.push({
      date: dateStr,
      value: Number(dayTotal.toFixed(2)),
      benchmark: 2.8,
    });
  }

  const totalMonthCat = Object.values(catSums).reduce((a, b) => a + b, 0) || 1;
  const categoryBreakdown = [
    {
      name: 'Transportasi',
      value: Number(catSums.transport.toFixed(2)),
      percentage: Number(((catSums.transport / totalMonthCat) * 100).toFixed(1)),
      color: '#3b82f6',
    },
    {
      name: 'Makanan',
      value: Number(catSums.food.toFixed(2)),
      percentage: Number(((catSums.food / totalMonthCat) * 100).toFixed(1)),
      color: '#22c55e',
    },
    {
      name: 'Energi',
      value: Number(catSums.energy.toFixed(2)),
      percentage: Number(((catSums.energy / totalMonthCat) * 100).toFixed(1)),
      color: '#f97316',
    },
    {
      name: 'Sampah',
      value: Number(catSums.waste.toFixed(2)),
      percentage: Number(((catSums.waste / totalMonthCat) * 100).toFixed(1)),
      color: '#10b981',
    },
  ];

  return {
    todayCO2: Number(todayCO2.toFixed(2)),
    todayTrend,
    weekCO2: Number(weekCO2.toFixed(2)),
    weekTrend,
    monthCO2: Number(monthCO2.toFixed(2)),
    monthTrend,
    yearCO2: Number(yearCO2.toFixed(2)),
    yearTrend,
    trendData,
    categoryBreakdown,
  };
}

export interface LeaderboardEntry {
  rank: number;
  user: MockUser;
  displayName: string;
  emission: number;
  changePercent?: number;
  activityCount?: number;
}

export function getLeaderboardData(tab: 'lowest' | 'improved' | 'engaged'): LeaderboardEntry[] {
  const users = getAllUsers();
  const activities = getStoredActivities();
  const now = new Date('2026-08-14T23:59:59Z');
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  if (tab === 'lowest') {
    const userTotals = users.map((u) => {
      const sum = activities
        .filter((a) => a.userId === u.id && new Date(a.timestamp) >= weekStart)
        .reduce((acc, a) => acc + a.co2Equivalent, 0);
      return { user: u, emission: Number(sum.toFixed(1)) };
    });

    userTotals.sort((a, b) => a.emission - b.emission);

    return userTotals.map((item, idx) => ({
      rank: idx + 1,
      user: item.user,
      displayName: item.user.isAnonymous ? `Mahasiswa #${item.user.id.replace('user-', '')}` : item.user.name,
      emission: item.emission,
    }));
  }

  if (tab === 'improved') {
    const userImprovement = users.map((u, idx) => {
      const prevMonth = activities
        .filter((a) => a.userId === u.id && new Date(a.timestamp) < monthStart)
        .reduce((acc, a) => acc + a.co2Equivalent, 0);
      const currMonth = activities
        .filter((a) => a.userId === u.id && new Date(a.timestamp) >= monthStart)
        .reduce((acc, a) => acc + a.co2Equivalent, 0);

      const changePercent = prevMonth > 0 ? Number((((prevMonth - currMonth) / prevMonth) * 100).toFixed(1)) : 15 + (idx * 2) % 25;

      return {
        user: u,
        emission: Number(currMonth.toFixed(1)),
        changePercent,
      };
    });

    userImprovement.sort((a, b) => (b.changePercent || 0) - (a.changePercent || 0));

    return userImprovement.map((item, idx) => ({
      rank: idx + 1,
      user: item.user,
      displayName: item.user.isAnonymous ? `Mahasiswa #${item.user.id.replace('user-', '')}` : item.user.name,
      emission: item.emission,
      changePercent: item.changePercent,
    }));
  }

  const userEngagement = users.map((u) => {
    const count = activities.filter((a) => a.userId === u.id && new Date(a.timestamp) >= monthStart).length;
    return { user: u, count, emission: 0 };
  });

  userEngagement.sort((a, b) => b.count - a.count);

  return userEngagement.map((item, idx) => ({
    rank: idx + 1,
    user: item.user,
    displayName: item.user.isAnonymous ? `Mahasiswa #${item.user.id.replace('user-', '')}` : item.user.name,
    emission: item.count,
    activityCount: item.count,
  }));
}
