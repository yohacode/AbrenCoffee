import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavVisibilityContextProps {
  showNav: boolean;
  setShowNav: (visible: boolean) => void;
  showFooter: boolean;
  setShowFooter: (value: boolean) => void;
}

const NavVisibilityContext = createContext<NavVisibilityContextProps | undefined>(undefined);

export const NavVisibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showNav, setShowNav] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  return (
    <NavVisibilityContext.Provider value={{ showNav, setShowNav, showFooter, setShowFooter }}>
      {children}
    </NavVisibilityContext.Provider>
  );
};

export const useNavVisibility = (): NavVisibilityContextProps => {
  const context = useContext(NavVisibilityContext);
  if (!context) {
    throw new Error('useNavVisibility must be used within a NavVisibilityProvider');
  }
  return context;
};
