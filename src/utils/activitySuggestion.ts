import { Activity, ActivitySuggestion, TimeOfDay, User } from '../types';

// Get current time of day
export const getCurrentTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
};

// Get suitable activities for current time
export const getSuitableActivities = (
  activities: Activity[],
  timeOfDay: TimeOfDay
): Activity[] => {
  return activities.filter(activity => 
    activity.timeOfDay.includes(timeOfDay) || activity.timeOfDay.includes('anytime')
  );
};

// Generate activity suggestions based on user profile and time
export const generateSuggestions = (
  user: User,
  timeOfDay: TimeOfDay = getCurrentTimeOfDay(),
  count: number = 3
): ActivitySuggestion[] => {
  if (!user || !user.meaningfulActivities || user.meaningfulActivities.length === 0) {
    return [];
  }
  
  // Get activities suitable for current time
  const suitableActivities = getSuitableActivities(user.meaningfulActivities, timeOfDay);
  
  if (suitableActivities.length === 0) return [];
  
  // Randomly select activities
  const shuffled = [...suitableActivities].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));
  
  // Create suggestions with reasons
  return selected.map(activity => {
    const reason = getReasonForSuggestion(activity, user, timeOfDay);
    return { activity, reason };
  });
};

// Generate a personalized reason for suggesting this activity
const getReasonForSuggestion = (
  activity: Activity,
  user: User,
  timeOfDay: TimeOfDay
): string => {
  const reasons = [
    `${activity.name} aligns with your aspiration to ${getRandomItem(user.aspirations)}.`,
    `This is a perfect ${timeOfDay} activity to replace ${getRandomEscapeActivity(user)}.`,
    `You've mentioned that ${activity.name} brings you genuine fulfillment.`,
    `This activity helps build the habits you really want.`,
    `${activity.name} is a great use of your time right now.`,
  ];
  
  return getRandomItem(reasons);
};

// Helper function to get random item from array
const getRandomItem = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

// Helper function to get random escape activity
const getRandomEscapeActivity = (user: User): string => {
  if (!user.escapeActivities || user.escapeActivities.length === 0) {
    return "unhelpful habits";
  }
  return user.escapeActivities[Math.floor(Math.random() * user.escapeActivities.length)].name;
};