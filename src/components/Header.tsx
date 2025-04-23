import React from 'react';
import { BookOpen } from 'lucide-react';
import { useNavigate } from '../context/NavigationContext';

const Header: React.FC = () => {
  const { navigateTo, currentPage } = useNavigate();
  
  return (
    <header className="bg-gradient-to-r from-teal-500 to-blue-500 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => navigateTo('home')}
        >
          <BookOpen size={24} />
          <h1 className="text-xl font-bold">MindfulMe</h1>
        </div>
        
        <nav className="flex gap-4">
          <button 
            className={`px-3 py-1 rounded-full transition-all duration-300 ${
              currentPage === 'home' 
                ? 'bg-white text-teal-600 shadow-sm' 
                : 'text-white hover:bg-white/20'
            }`}
            onClick={() => navigateTo('home')}
          >
            ホーム
          </button>
          <button 
            className={`px-3 py-1 rounded-full transition-all duration-300 ${
              currentPage === 'profile' 
                ? 'bg-white text-teal-600 shadow-sm' 
                : 'text-white hover:bg-white/20'
            }`}
            onClick={() => navigateTo('profile')}
          >
            プロフィール
          </button>
          <button 
            className={`px-3 py-1 rounded-full transition-all duration-300 ${
              currentPage === 'activities' 
                ? 'bg-white text-teal-600 shadow-sm' 
                : 'text-white hover:bg-white/20'
            }`}
            onClick={() => navigateTo('activities')}
          >
            活動記録
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;