import { Button as ChakraButton, ButtonProps } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useAuth } from "../../contexts/AuthContext";
import convert from "color-convert";

interface ChakraButtonProps extends ButtonProps {
  children: ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
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

  const rgbColor = convert.hex.rgb(officeColor);
  const transparentRgbColor = rgbColor.concat(opacity * 1);
  const rgbaColor = `rgba(${transparentRgbColor.join(",")})`;

  return (
    <ChakraButton
      bg={bgColor ? bgColor : office?.primary_color}
      color={color ? color : office?.secondary_color}
      w={width ? width : "100%"}
      _hover={{
        bg: rgbaColor,
      }}
      {...rest}
    >
      {children}
    </ChakraButton>
  );
}
