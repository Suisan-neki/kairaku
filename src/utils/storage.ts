import { User, Activity } from '../types';

// Local storage keys
const USER_KEY = 'mindful_app_user';
const ACTIVITIES_KEY = 'mindful_app_activities';
const COMPLETED_ACTIVITIES_KEY = 'mindful_app_completed';

// Save user profile to local storage
export const saveUserProfile = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Get user profile from local storage
export const getUserProfile = (): User | null => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

// Save activities to local storage
export const saveActivities = (activities: Activity[]): void => {
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
};

// Get activities from local storage
export const getActivities = (): Activity[] => {
  const activitiesData = localStorage.getItem(ACTIVITIES_KEY);
  return activitiesData ? JSON.parse(activitiesData) : [];
};

// Record a completed activity
export const recordCompletedActivity = (activityId: string): void => {
  const now = new Date();
  const completed = getCompletedActivities();
  
  completed.push({
    activityId,
    timestamp: now.toISOString(),
  });
  
  localStorage.setItem(COMPLETED_ACTIVITIES_KEY, JSON.stringify(completed));
};

// Get completed activities
export const getCompletedActivities = (): { activityId: string; timestamp: string }[] => {
  const completedData = localStorage.getItem(COMPLETED_ACTIVITIES_KEY);
  return completedData ? JSON.parse(completedData) : [];
};

// Clear all data (for testing or reset)
export const clearAllData = (): void => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ACTIVITIES_KEY);
  localStorage.removeItem(COMPLETED_ACTIVITIES_KEY);
};