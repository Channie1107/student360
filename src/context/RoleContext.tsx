'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Role = 'principal' | 'teacher';

interface RoleContextProps {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextProps | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRoleState] = useState<Role>('principal');

  useEffect(() => {
    const savedRole = localStorage.getItem('app_role') as Role;
    if (savedRole === 'principal' || savedRole === 'teacher') {
      setRoleState(savedRole);
    } else {
      setRoleState('principal');
      localStorage.setItem('app_role', 'principal');
    }
  }, []);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem('app_role', newRole);
  };

  // Prevent hydration mismatch by rendering nothing until client-side hydration is done, 
  // or just render with default role since it's inside layout. 
  // We'll render it as-is, but the role change will take effect right away if we use it mostly in client components.

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
