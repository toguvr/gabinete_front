import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { OfficeDTO, PermissionByIdDTO, UserDTO } from '../dtos';
import api from '../services/api';
import { key } from '../config/key';
import { RoleDTO } from '../dtos/index';
import Office from '../pages/Office';

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  updateUser: (user: UserDTO) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  user: UserDTO;
  role: RoleDTO;
  office: OfficeDTO;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState<UserDTO>(() => {
    const token = localStorage.getItem(key.token);
    const user = localStorage.getItem(key.user);

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return JSON.parse(user);
    }

    return {} as UserDTO;
  });

  const [office, setOffice] = useState<OfficeDTO>(() => {
    const currentOffice = localStorage.getItem(key.office);

    if (currentOffice) {
      return JSON.parse(currentOffice);
    }
    return {} as OfficeDTO;
  });

  const [role, setRole] = useState<RoleDTO>(() => {
    const currentRole = localStorage.getItem(key.role);

    if (currentRole) {
      return JSON.parse(currentRole);
    }
    return {} as RoleDTO;
  });

  const isAuthenticated = !!user?.id;

  async function signOut() {
    localStorage.removeItem(key.refreshToken);
    localStorage.removeItem(key.token);
    localStorage.removeItem(key.user);
    localStorage.removeItem(key.office);
    localStorage.removeItem(key.role);

    setUser({} as UserDTO);
    setRole({} as RoleDTO);
    setOffice({} as OfficeDTO);
    // return window.location.reload();
  }

  useEffect(() => {
    api.registerInterceptTokenManager(signOut);
  }, [signOut]);

  // async function loadStorageData(): Promise<void> {
  //   try {
  //     setLoadingUser(true);
  //     const [token, user] = await localStorage.multiGet([key.token, key.user]);

  //     if (token[1] && user[1]) {
  //       api.defaults.headers.authorization = `Bearer ${token[1]}`;
  //       setUser(JSON.parse(user[1]));
  //     }
  //   } catch (err) {
  //   } finally {
  //     setLoadingUser(false);
  //   }
  // }

  // useEffect(() => {
  //   loadStorageData();
  // }, [user?.id]);

  const signIn = useCallback(async ({ email, password }: { email: string; password: string }) => {
    const response = await api.post('/sessions', {
      email,
      password,
    });

    const { token, user, permissions } = response.data;

    localStorage.setItem(key.token, token);
    localStorage.setItem(key.user, JSON.stringify(user));
    if (permissions.length > 0) {
      localStorage.setItem(key.office, JSON.stringify(permissions[0]?.office));
      localStorage.setItem(key.role, JSON.stringify(permissions[0]?.role));
      setRole(permissions[0]?.office);
      setOffice(permissions[0]?.role);
    }

    api.defaults.headers.authorization = `Bearer ${token}`;

    setUser(user);
  }, []);

  const updateUser = async (user: UserDTO) => {
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
        role,
        office,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
