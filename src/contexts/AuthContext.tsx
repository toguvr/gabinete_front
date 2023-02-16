import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { User } from "../dtos";
import api from "../services/api";
import { key } from "../config/key";

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  user: User;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState<User>(() => {
    const token = localStorage.getItem(key.token);
    const user = localStorage.getItem(key.user);

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return JSON.parse(user);
    }

    return {} as User;
  });
  const isAuthenticated = !!user?.id;

  async function signOut() {
    localStorage.removeItem(key.refreshToken);
    localStorage.removeItem(key.token);
    localStorage.removeItem(key.user);

    setUser({} as User);
    // return window.location.reload();
  }

  useEffect(() => {
    api.registerInterceptTokenManager(signOut);
  }, [signOut]);

  async function loadStorageData(): Promise<void> {
    try {
      setLoadingUser(true);
      const [token, user] = await localStorage.multiGet([key.token, key.user]);

      if (token[1] && user[1]) {
        api.defaults.headers.authorization = `Bearer ${token[1]}`;
        setUser(JSON.parse(user[1]));
      }
    } catch (err) {
    } finally {
      setLoadingUser(false);
    }
  }

  useEffect(() => {
    loadStorageData();
  }, [user?.id]);

  const signIn = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      const response = {
        data: {
          user: {
            id: "1234",
            name: "otavio",
          },
          token: "123",
        },
      };
      // await api.post("/sessions/limit", {
      //   email,
      //   password,
      // });

      const { token, user } = response.data;

      localStorage.setItem(key.token, token);
      localStorage.setItem(key.user, JSON.stringify(user));

      api.defaults.headers.authorization = `Bearer ${token}`;

      setUser(user);
    },
    []
  );

  const updateUser = async (user: User) => {
    setUser(user);
    localStorage.setItem(key.user, JSON.stringify(user));
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        isAuthenticated,
        user,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export { AuthProvider, useAuth };
