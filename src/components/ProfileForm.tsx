import React, { useState, useEffect } from 'react';
import { User, Activity, TimeOfDay } from '../types';
import { saveUserProfile, getUserProfile } from '../utils/storage';
import { Plus, Trash2, Save } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ProfileFormProps {
  onSave: (user: User) => void;
}

const timeOptions: { value: TimeOfDay; label: string }[] = [
  { value: 'morning', label: '朝' },
  { value: 'afternoon', label: '午後' },
  { value: 'evening', label: '夕方' },
  { value: 'night', label: '夜' },
  { value: 'anytime', label: 'いつでも' },
];

const categories = [
  '運動', '読書', '音楽', 'アート', '学習', 
  '交流', '瞑想', '屋外活動', '料理', 'その他'
];

const ProfileForm: React.FC<ProfileFormProps> = ({ onSave }) => {
  const [user, setUser] = useState<User>({
    name: '',
    escapeActivities: [],
    meaningfulActivities: [],
    aspirations: [],
  });
  
  const [newEscapeActivity, setNewEscapeActivity] = useState<string>('');
  const [newAspiration, setNewAspiration] = useState<string>('');
  const [newMeaningfulActivity, setNewMeaningfulActivity] = useState<Partial<Activity>>({
    name: '',
    category: 'その他',
    timeOfDay: ['anytime'],
    duration: 30,
  });
  
  useEffect(() => {
    const existingUser = getUserProfile();
    if (existingUser) {
      setUser(existingUser);
    }
  }, []);
  
  const handleSaveProfile = () => {
    if (!user.name.trim()) {
      alert('お名前を入力してください');
      return;
    }
    
    if (user.meaningfulActivities.length === 0) {
      alert('少なくとも1つの意味のある活動を追加してください');
      return;
    }
    
    saveUserProfile(user);
    onSave(user);
  };
  
  const addEscapeActivity = () => {
    if (!newEscapeActivity.trim()) return;
    
    const activity: Activity = {
      id: uuidv4(),
      name: newEscapeActivity,
      category: 'Escape',
      timeOfDay: ['anytime'],
      duration: 0,
    };
    
    setUser(prev => ({
      ...prev,
      escapeActivities: [...prev.escapeActivities, activity],
    }));
    
    setNewEscapeActivity('');
  };
  
  const addAspiration = () => {
    if (!newAspiration.trim()) return;
    
    setUser(prev => ({
      ...prev,
      aspirations: [...prev.aspirations, newAspiration],
    }));
    
    setNewAspiration('');
  };
  
  const addMeaningfulActivity = () => {
    if (!newMeaningfulActivity.name?.trim()) return;
    
    const activity: Activity = {
      id: uuidv4(),
      name: newMeaningfulActivity.name,
      category: newMeaningfulActivity.category || 'その他',
      timeOfDay: newMeaningfulActivity.timeOfDay || ['anytime'],
      duration: newMeaningfulActivity.duration || 30,
      description: newMeaningfulActivity.description,
    };
    
    setUser(prev => ({
      ...prev,
      meaningfulActivities: [...prev.meaningfulActivities, activity],
    }));
    
    setNewMeaningfulActivity({
      name: '',
      category: 'その他',
      timeOfDay: ['anytime'],
      duration: 30,
    });
  };
  
  const removeEscapeActivity = (id: string) => {
    setUser(prev => ({
      ...prev,
      escapeActivities: prev.escapeActivities.filter(a => a.id !== id),
    }));
  };
  
  const removeAspiration = (index: number) => {
    setUser(prev => ({
      ...prev,
      aspirations: prev.aspirations.filter((_, i) => i !== index),
    }));
  };
  
  const removeMeaningfulActivity = (id: string) => {
    setUser(prev => ({
      ...prev,
      meaningfulActivities: prev.meaningfulActivities.filter(a => a.id !== id),
    }));
  };
  
  const handleTimeOfDayChange = (time: TimeOfDay) => {
    setNewMeaningfulActivity(prev => {
      const currentTimes = prev.timeOfDay || [];
      const newTimes = currentTimes.includes(time)
        ? currentTimes.filter(t => t !== time)
        : [...currentTimes, time];
      
      return { ...prev, timeOfDay: newTimes };
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">プロフィール設定</h2>
      
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">お名前</label>
        <input
          type="text"
          value={user.name}
          onChange={e => setUser(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="お名前を入力"
        />
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          よく逃げてしまう活動
        </h3>
        <p className="text-gray-600 mb-4">
          減らしたい気晴らしや気を紛らわす行動を入力してください。
        </p>
        
        <div className="flex mb-2">
          <input
            type="text"
            value={newEscapeActivity}
            onChange={e => setNewEscapeActivity(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="例：SNSをスクロール、間食..."
            onKeyPress={e => e.key === 'Enter' && addEscapeActivity()}
          />
          <button
            onClick={addEscapeActivity}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors duration-300"
          >
            <Plus size={18} />
          </button>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-2">
          {user.escapeActivities.map(activity => (
            <div
              key={activity.id}
              className="px-3 py-1 bg-red-100 text-red-800 rounded-full flex items-center"
            >
              <span>{activity.name}</span>
              <button
                onClick={() => removeEscapeActivity(activity.id)}
                className="ml-2 text-red-600 hover:text-red-800"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          あなたの目標
        </h3>
        <p className="text-gray-600 mb-4">
          もっと取り組みたいことや、なりたい自分を入力してください。
        </p>
        
        <div className="flex mb-2">
          <input
            type="text"
            value={newAspiration}
            onChange={e => setNewAspiration(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="例：本をもっと読む、ピアノの練習..."
            onKeyPress={e => e.key === 'Enter' && addAspiration()}
          />
          <button
            onClick={addAspiration}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors duration-300"
          >
            <Plus size={18} />
          </button>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-2">
          {user.aspirations.map((aspiration, index) => (
            <div
              key={index}
              className="px-3 py-1 bg-green-100 text-green-800 rounded-full flex items-center"
            >
              <span>{aspiration}</span>
              <button
                onClick={() => removeAspiration(index)}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          意味のある活動を追加
        </h3>
        <p className="text-gray-600 mb-4">
          本当の充実感をもたらす活動を登録してください。
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">活動名</label>
              <input
                type="text"
                value={newMeaningfulActivity.name || ''}
                onChange={e => setNewMeaningfulActivity(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例：本を読む"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">カテゴリー</label>
              <select
                value={newMeaningfulActivity.category || 'その他'}
                onChange={e => setNewMeaningfulActivity(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">所要時間（分）</label>
              <input
                type="number"
                min="5"
                step="5"
                value={newMeaningfulActivity.duration || 30}
                onChange={e => setNewMeaningfulActivity(prev => ({ 
                  ...prev, 
                  duration: parseInt(e.target.value) || 30 
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">説明（任意）</label>
              <input
                type="text"
                value={newMeaningfulActivity.description || ''}
                onChange={e => setNewMeaningfulActivity(prev => ({ 
                  ...prev, 
                  description: e.target.value 
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="活動の簡単な説明"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">おすすめの時間帯</label>
            <div className="flex flex-wrap gap-2">
              {timeOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleTimeOfDayChange(option.value)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    (newMeaningfulActivity.timeOfDay || []).includes(option.value)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={addMeaningfulActivity}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center"
          >
            <Plus size={18} className="mr-2" />
            活動を追加
          </button>
        </div>
        
        <div className="space-y-3">
          {user.meaningfulActivities.map(activity => (
            <div
              key={activity.id}
              className="p-4 border border-gray-200 rounded-lg flex justify-between items-center"
            >
              <div>
                <div className="font-medium text-gray-800">{activity.name}</div>
                <div className="text-sm text-gray-600">
                  {activity.category} • {activity.duration}分 • 
                  {activity.timeOfDay.map(t => {
                    const option = timeOptions.find(opt => opt.value === t);
                    return option ? ` ${option.label}` : '';
                  }).join('、')}
                </div>
              </div>
              <button
                onClick={() => removeMeaningfulActivity(activity.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <button
        onClick={handleSaveProfile}
        className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center"
      >
        <Save size={18} className="mr-2" />
        プロフィールを保存
      </button>
    </div>
  );
};

export default ProfileForm;