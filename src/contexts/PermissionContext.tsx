import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { key } from "../config/key";
import { OfficeDTO, PermissionByIdDTO } from "../dtos";
import api from "../services/api";
import { useAuth } from "./AuthContext";

type PermissionProviderProps = {
  children: ReactNode;
};

type PermissionContextData = {
  permissionData: PermissionByIdDTO[];
};

export const PermissionContext = createContext({} as PermissionContextData);

export function PermissionProvider({ children }: PermissionProviderProps) {
  const { user, isAuthenticated, permissionsById } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [permissionData, setPermissionData] = useState(
    [] as PermissionByIdDTO[]
  );

  const getPermissions = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/permission/office/${permissionsById}`);

      localStorage.setItem(key.permission, JSON.stringify(response.data));
      setPermissionData(response.data);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getPermissions();
    }
  }, [user, isAuthenticated]);

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
