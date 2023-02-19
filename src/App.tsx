import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DialogProvider } from './contexts/DialogContext';
import AppRoutes from './routes';
import { theme } from './styles/theme';

export const App = () => (
  <ChakraProvider theme={theme}>
    <AuthProvider>
      <DialogProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </DialogProvider>
    </AuthProvider>
  </ChakraProvider>
);
