import {
  Input as ChakraInput,
  FormControl,
  FormLabel,
  InputProps as ChakraInputProps,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { ChangeEvent, ReactNode } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface InputProps extends ChakraInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  borderColor?: string;
  labelColor?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string | null;
  value?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  type = "text",
  leftIcon,
  rightIcon,
  borderColor,
  value,
  placeholder,
  labelColor,
  onChange,
  name,
  label,
  disabled,
  error = null,
  ...rest
}: InputProps) {
  const { office } = useAuth();
  return (
    <FormControl {...rest} isInvalid={!!error}>
      {label && (
        <FormLabel
          color={labelColor ? labelColor : "gray.500"}
          fontWeight="400"
          htmlFor={name}
          margin="0"
          white-space="nowrap"
          overflow="hidden"
          text-overflow="ellipsis"
        >
          {label}
        </FormLabel>
      )}
      <InputGroup size="md">
        {leftIcon && (
          <InputLeftElement
            pointerEvents="none"
            color={office?.primary_color}
            fontSize="20px"
            children={leftIcon}
          />
        )}
        <ChakraInput
          bgColor="gray.50"
          borderColor={borderColor}
          name={name}
          disabled={disabled}
          value={value}
          onChange={onChange}
          color="gray.700"
          fontSize="16px"
          fontWeight="400"
          focusBorderColor={office?.primary_color}
          type={type}
          placeholder={placeholder}
          id={name}
          _placeholder={{ color: "gray.500" }}
        />
        {rightIcon && <InputRightElement>{rightIcon}</InputRightElement>}
      </InputGroup>

      {!!error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
}
