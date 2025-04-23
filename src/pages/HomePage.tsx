import React, { useEffect, useState } from 'react';
import { ActivitySuggestion, User } from '../types';
import { getUserProfile } from '../utils/storage';
import { generateSuggestions, getCurrentTimeOfDay } from '../utils/activitySuggestion';
import ActivityCard from '../components/ActivityCard';
import EmptyState from '../components/EmptyState';
import { useNavigate } from '../context/NavigationContext';
import { RefreshCw, Clock } from 'lucide-react';

const timeOfDayInJapanese = {
  morning: '朝',
  afternoon: '午後',
  evening: '夕方',
  night: '夜',
  anytime: 'いつでも'
};

const HomePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [suggestions, setSuggestions] = useState<ActivitySuggestion[]>([]);
  const [timeOfDay, setTimeOfDay] = useState(getCurrentTimeOfDay());
  const [loading, setLoading] = useState(true);
  const { navigateTo } = useNavigate();
  
  useEffect(() => {
    const loadUserAndSuggestions = () => {
      const userData = getUserProfile();
      setUser(userData);
      
      if (userData) {
        const newSuggestions = generateSuggestions(userData);
        setSuggestions(newSuggestions);
      }
      
      setLoading(false);
    };
    
    loadUserAndSuggestions();
    
    const intervalId = setInterval(() => {
      const newTimeOfDay = getCurrentTimeOfDay();
      if (newTimeOfDay !== timeOfDay) {
        setTimeOfDay(newTimeOfDay);
      }
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [timeOfDay]);
  
  const handleRefreshSuggestions = () => {
    if (user) {
      const newSuggestions = generateSuggestions(user);
      setSuggestions(newSuggestions);
    }
  };
  
  const handleActivityComplete = () => {
    handleRefreshSuggestions();
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <EmptyState
        title="Kairakuへようこそ"
        message="人生はメリハリだ！"
        actionLabel="プロフィールを作成"
        onAction={() => navigateTo('profile')}
      />
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            こんにちは、{user.name}さん
          </h2>
          <div className="flex items-center text-gray-600 mt-1">
            <Clock size={16} className="mr-1" />
            <span>
              {timeOfDayInJapanese[timeOfDay]}のおすすめ活動
            </span>
          </div>
        </div>
        
        <button
          onClick={handleRefreshSuggestions}
          className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-300"
          aria-label="提案を更新"
        >
          <RefreshCw size={20} />
        </button>
      </div>
      
      {suggestions.length === 0 ? (
        <EmptyState
          title="活動が見つかりません"
          message="取り組みたい活動を追加して、おすすめを表示しましょう。"
          actionLabel="活動を追加"
          onAction={() => navigateTo('profile')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.map((suggestion, index) => (
            <ActivityCard
              key={`${suggestion.activity.id}-${index}`}
              suggestion={suggestion}
              onComplete={handleActivityComplete}
            />
          ))}
        </div>
      )}
      
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-blue-800 mb-3">
          目標を忘れずに
        </h3>
        <p className="text-blue-700 mb-4">
          一時的な快楽に逃げたらのちに後悔するんや…：
        </p>
        
        <ul className="list-disc pl-5 text-blue-700 space-y-1">
          {user.aspirations.slice(0, 3).map((aspiration, index) => (
            <li key={index}>{aspiration}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
