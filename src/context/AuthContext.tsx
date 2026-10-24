import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  login: (username: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'ems_corporate_auth_token';
const AUTH_USER_KEY = 'ems_corporate_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem(AUTH_STORAGE_KEY);
      const savedUser = localStorage.getItem(AUTH_USER_KEY);
      if (token && savedUser) {
        setIsAuthenticated(true);
        setUser(savedUser);
      }
    } catch {
      // Ignore storage errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (usernameInput: string, passwordInput: string) => {
    // Strictly user=Admin, password=Admin@123
    const trimmedUser = usernameInput.trim();
    if (trimmedUser === 'Admin' && passwordInput === 'Admin@123') {
      setIsAuthenticated(true);
      setUser('Admin');
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, 'ems_session_' + Date.now());
        localStorage.setItem(AUTH_USER_KEY, 'Admin');
      } catch {
        // Storage fallback
      }
      return { success: true };
    }
    return { success: false, message: 'Invalid enterprise credentials. Please check your username and password.' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    } catch {
      // Storage fallback
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Initializing Enterprise Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
