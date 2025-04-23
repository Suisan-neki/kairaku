import React, { useState, useEffect } from 'react';
import { User, Activity } from '../types';
import { getUserProfile, getCompletedActivities } from '../utils/storage';
import EmptyState from '../components/EmptyState';
import { useNavigate } from '../context/NavigationContext';
import { BarChart, Filter, CheckCircle2 } from 'lucide-react';

const ActivitiesPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [completedActivities, setCompletedActivities] = useState<{ activityId: string; timestamp: string }[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const { navigateTo } = useNavigate();
  
  useEffect(() => {
    const userData = getUserProfile();
    setUser(userData);
    
    const completed = getCompletedActivities();
    setCompletedActivities(completed);
  }, []);
  
  if (!user) {
    return (
      <EmptyState
        title="Create Your Profile First"
        message="You need to set up your profile before tracking activities."
        actionLabel="Create Profile"
        onAction={() => navigateTo('profile')}
      />
    );
  }
  
  const allActivities = [...user.meaningfulActivities];
  
  // Group completed activities by date
  const groupedByDate = completedActivities.reduce((acc, current) => {
    const date = new Date(current.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(current);
    return acc;
  }, {} as Record<string, typeof completedActivities>);
  
  // Filter activities
  const filteredActivities = allActivities.filter(activity => {
    if (filter === 'all') return true;
    return activity.category === filter;
  });
  
  // Get unique categories
  const categories = [...new Set(allActivities.map(a => a.category))];
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Activities</h2>
        <p className="text-gray-600">
          Track and manage your meaningful activities.
        </p>
      </div>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
          <div className="text-blue-700 font-medium">Total Activities</div>
          <div className="text-3xl font-bold text-blue-900 mt-1">
            {allActivities.length}
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 shadow-sm">
          <div className="text-green-700 font-medium">Completed</div>
          <div className="text-3xl font-bold text-green-900 mt-1">
            {completedActivities.length}
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 shadow-sm">
          <div className="text-purple-700 font-medium">Categories</div>
          <div className="text-3xl font-bold text-purple-900 mt-1">
            {categories.length}
          </div>
        </div>
      </div>
      
      {/* Activity Filters */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Filter size={18} className="mr-2 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Filter Activities</h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Activities List */}
      {filteredActivities.length === 0 ? (
        <EmptyState
          title="No Activities Found"
          message={filter === 'all' 
            ? "You haven't added any activities yet." 
            : `No activities found in the ${filter} category.`}
          actionLabel="Add Activities"
          onAction={() => navigateTo('profile')}
        />
      ) : (
        <div className="space-y-4">
          {filteredActivities.map(activity => {
            const completedCount = completedActivities.filter(
              ca => ca.activityId === activity.id
            ).length;
            
            return (
              <div
                key={activity.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium text-gray-800">
                      {activity.name}
                    </h4>
                    <div className="text-sm text-gray-600 mt-1">
                      {activity.category} • {activity.duration} min
                    </div>
                    {activity.description && (
                      <p className="text-gray-700 mt-2">
                        {activity.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <CheckCircle2 size={16} className="mr-1 text-green-500" />
                    <span className="font-medium">
                      {completedCount} times
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Completion History */}
      {Object.keys(groupedByDate).length > 0 && (
        <div className="mt-12">
          <div className="flex items-center mb-4">
            <BarChart size={18} className="mr-2 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Completion History</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(groupedByDate)
              .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
              .map(([date, activities]) => (
                <div key={date} className="bg-gray-50 rounded-lg p-4">
                  <div className="font-medium text-gray-800 mb-2">{date}</div>
                  <div className="space-y-2">
                    {activities.map((completed, index) => {
                      const activity = allActivities.find(a => a.id === completed.activityId);
                      if (!activity) return null;
                      
                      return (
                        <div key={index} className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          <div className="text-gray-800">
                            {activity.name}
                          </div>
                          <div className="text-gray-500 text-sm ml-2">
                            {new Date(completed.timestamp).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesPage;