import { ButtonProps, Button as ChakraButton } from '@chakra-ui/react';
import convert from 'color-convert';
import { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface ChakraButtonProps extends ButtonProps {
  children: ReactNode;
  width?: string;
  bgColor?: string;
  color?: string;
}

export default function Button({
  children,
  width,
  bgColor,
  color,
  ...rest
}: ChakraButtonProps) {
  const { office } = useAuth();
  const officeColor = office?.primary_color;
  const opacity = 0.9;

  let rgbaColor: string | undefined;

  if (officeColor) {
    const rgbColor = convert.hex.rgb(officeColor);
    const transparentRgbColor = rgbColor.concat(opacity * 1);
    rgbaColor = `rgba(${transparentRgbColor.join(',')})`;
  }

  return (
    <ChakraButton
      bg={bgColor ? bgColor : office?.primary_color}
      color={color ? color : office?.secondary_color}
      w={width ? width : '100%'}
      _hover={{
        bg: rgbaColor,
      }}
      {...rest}
    >
      {children}
    </ChakraButton>
  );
}
