export interface User {
  name: string;
  escapeActivities: Activity[];
  meaningfulActivities: Activity[];
  aspirations: string[];
}

export interface Activity {
  id: string;
  name: string;
  category: string;
  timeOfDay: TimeOfDay[];
  duration: number; // in minutes
  description?: string;
}

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night' | 'anytime';

export interface ActivitySuggestion {
  activity: Activity;
  reason: string;
}