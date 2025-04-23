import React, { createContext, useContext, useState, ReactNode } from 'react';

type PageType = 'home' | 'profile' | 'activities';

interface NavigationContextType {
  currentPage: PageType;
  navigateTo: (page: PageType) => void;
}

const NavigationContext = createContext<NavigationContextType>({
  currentPage: 'home',
  navigateTo: () => {},
});

export const useNavigate = () => useContext(NavigationContext);

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  
  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
  };
  
  return (
    <NavigationContext.Provider value={{ currentPage, navigateTo }}>
      {children}
    </NavigationContext.Provider>
  );
};