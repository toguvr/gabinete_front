import { ChakraProvider } from '@chakra-ui/react';
import 'primereact/resources/primereact.min.css';
import { HelmetProvider } from 'react-helmet-async';
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
          <HelmetProvider>
            <AppRoutes />
          </HelmetProvider>
        </BrowserRouter>
      </DialogProvider>
    </AuthProvider>
  </ChakraProvider>
);
