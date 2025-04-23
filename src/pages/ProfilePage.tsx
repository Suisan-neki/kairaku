import React from 'react';
import ProfileForm from '../components/ProfileForm';
import { User } from '../types';
import { useNavigate } from '../context/NavigationContext';

const ProfilePage: React.FC = () => {
  const { navigateTo } = useNavigate();
  
  const handleProfileSave = (user: User) => {
    navigateTo('home');
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">プロフィール設定</h2>
      <ProfileForm onSave={handleProfileSave} />
    </div>
  );
};

export default ProfilePage;