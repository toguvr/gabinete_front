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

interface InputProps extends ChakraInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  borderColor?: string;
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
  onChange,
  name,
  label,
  disabled,
  error = null,
  ...rest
}: InputProps) {
  return (
    <FormControl {...rest} isInvalid={!!error}>
      {label && (
        <FormLabel color="gray.700" fontWeight="400" mb="1" htmlFor={name}>
          {label}
        </FormLabel>
      )}
      <InputGroup size="md">
        {leftIcon && (
          <InputLeftElement
            pointerEvents="none"
            color="blue.600"
            fontSize="20px"
            children={leftIcon}
          />
        )}
        <ChakraInput
          bgColor="gray.50"
          name={name}
          disabled={disabled}
          value={value}
          onChange={onChange}
          color="gray.700"
          fontSize="16px"
          fontWeight="400"
          focusBorderColor="blue.600"
          type={type}
          placeholder={placeholder}
          id={name}
        />
        {rightIcon && <InputRightElement>{rightIcon}</InputRightElement>}
      </InputGroup>

      {!!error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
}
