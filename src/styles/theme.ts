import { extendTheme } from '@chakra-ui/react';
import '@fontsource/inter';

export const theme = extendTheme({
  colors: {
    blue: {
      primary: '#0066AA',
    },
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
});
