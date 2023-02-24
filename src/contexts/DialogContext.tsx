import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
interface DialogProviderProps {
  children: ReactNode;
}

type DialogContextData = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const DialogContext = createContext({} as DialogContextData);

export function DialogProvider({ children }: DialogProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  return (
    <DialogContext.Provider value={{ isOpen, onOpen, onClose }}>
      {children}
    </DialogContext.Provider>
  );
}

export const useDialog = () => useContext(DialogContext);
