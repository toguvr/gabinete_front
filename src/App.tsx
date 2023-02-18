import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DialogProvider } from "./contexts/DialogContext";
import { PermissionProvider } from "./contexts/PermissionContext";
import AppRoutes from "./routes";
import { theme } from "./styles/theme";

export const App = () => (
  <ChakraProvider theme={theme}>
    <AuthProvider>
      <PermissionProvider>
        <DialogProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </DialogProvider>
      </PermissionProvider>
    </AuthProvider>
  </ChakraProvider>
);
