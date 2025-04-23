import React from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ActivitiesPage from './pages/ActivitiesPage';
import { NavigationProvider, useNavigate } from './context/NavigationContext';

const AppContent: React.FC = () => {
  const { currentPage } = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'profile' && <ProfilePage />}
        {currentPage === 'activities' && <ActivitiesPage />}
      </main>
      
      <footer className="bg-gray-800 text-white p-4 text-center text-sm">
        <p>MindfulMe &copy; {new Date().getFullYear()} - マインドフルな活動のお供に</p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}

export default App;