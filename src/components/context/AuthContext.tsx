import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "../types";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../services/authService";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload extends LoginPayload {
  name: string;
}

interface AuthContextType {
  token: string | null;
  currentUser: User | null;
  authReady: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshCurrentUser: () => Promise<User | null>;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("toybox-token")
  );
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const refreshCurrentUser = async () => {
    if (!token) {
      setCurrentUser(null);
      return null;
    }

    try {
      const user = await getCurrentUser(token);
      setCurrentUser(user);
      return user;
    } catch (error) {
      setToken(null);
      setCurrentUser(null);
      localStorage.removeItem("toybox-token");
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setCurrentUser(null);
        setAuthReady(true);
        return;
      }

      localStorage.setItem("toybox-token", token);
      await refreshCurrentUser();
      setAuthReady(true);
    };

    initAuth();
  }, [token]);

  const login = async (payload: LoginPayload) => {
    const data = await loginUser(payload);
    setToken(data.token);
  };

  const register = async (payload: RegisterPayload) => {
    const data = await registerUser(payload);
    setToken(data.token);
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem("toybox-token");
  };

  const value = useMemo(
    () => ({
      token,
      currentUser,
      authReady,
      login,
      register,
      logout,
      refreshCurrentUser,
      setCurrentUser,
    }),
    [token, currentUser, authReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};