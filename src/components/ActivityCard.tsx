import React from 'react';
import { Activity, ActivitySuggestion } from '../types';
import { Clock, Award } from 'lucide-react';
import { recordCompletedActivity } from '../utils/storage';

interface ActivityCardProps {
  suggestion: ActivitySuggestion;
  onComplete: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ suggestion, onComplete }) => {
  const { activity, reason } = suggestion;
  
  const handleCompleteActivity = () => {
    recordCompletedActivity(activity.id);
    onComplete();
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="bg-gradient-to-r from-blue-400 to-teal-400 h-2"></div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{activity.name}</h3>
        <p className="text-gray-600 mb-4">{activity.description || reason}</p>
        
        <div className="flex items-center text-gray-500 mb-4">
          <Clock size={16} className="mr-1" />
          <span>{activity.duration}分</span>
          <span className="mx-2">•</span>
          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
            {activity.category}
          </span>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <button 
            className="px-4 py-2 bg-teal-500 text-white rounded-full shadow-md hover:bg-teal-600 transition-colors duration-300 flex items-center"
            onClick={handleCompleteActivity}
          >
            <Award size={16} className="mr-2" />
            完了
          </button>
          
          <button className="text-gray-400 hover:text-gray-600 transition-colors duration-300">
            後で通知
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;