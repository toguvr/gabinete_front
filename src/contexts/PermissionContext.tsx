import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { key } from "../config/key";
import { Office, PermissionById } from "../dtos";
import api from "../services/api";
import { useAuth } from "./AuthContext";

type PermissionProviderProps = {
  children: ReactNode;
};

type PermissionContextData = {
  permissionData: PermissionById[];
};

export const PermissionContext = createContext({} as PermissionContextData);

export function PermissionProvider({ children }: PermissionProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [permissionData, setPermissionData] = useState([] as PermissionById[]);
  const [officeData, setOfficeData] = useState({} as Office);

  const getOffice = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/office`);

      setOfficeData(response.data);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const getPermissions = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/permission/office/${user?.id}`);

      localStorage.setItem(key.permission, JSON.stringify(response.data));
      setPermissionData(response.data);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getOffice();
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    getPermissions();
  }, []);

  return (
    <PermissionContext.Provider value={{ permissionData }}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermission(): PermissionContextData {
  const context = useContext(PermissionContext);

  return context;
}
