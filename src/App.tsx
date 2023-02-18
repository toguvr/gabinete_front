import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PermissionProvider } from "./contexts/PermissionContext";
import AppRoutes from "./routes";
import { theme } from "./styles/theme";

export const App = () => (
  <ChakraProvider theme={theme}>
    <AuthProvider>
      <PermissionProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </PermissionProvider>
    </AuthProvider>
  </ChakraProvider>
);
