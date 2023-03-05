import { ChangeEvent, useCallback, useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  Icon,
  Select,
  Spinner,
  Stack,
  Text,
  useToast,
  Button as ChakraButton,
} from "@chakra-ui/react";
import HeaderSideBar from "../components/HeaderSideBar";
import { StateProps, UserDTO } from "../dtos";
import Input from "../components/Form/Input";
import { useAuth } from "../contexts/AuthContext";
import {
  IoCamera,
  IoEyeOffOutline,
  IoEyeOutline,
  IoLockClosedOutline,
} from "react-icons/io5";
import resize from "../components/Resize";
import api from "../services/api";
import Button from "../components/Form/Button";
import * as Yup from "yup";
import getValidationErrors from "../utils/validationError";

interface UserPassword extends UserDTO {
  old_password: string;
  password: string;
  password_confirmation: string;
}

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const { user, updateUser, office } = useAuth();
  const toast = useToast();
  const [values, setValues] = useState({
    ...user,
  } as UserPassword);
  const [showPassword, setShowPassword] = useState(false);

  const handleViewPassword = () => setShowPassword(!showPassword);

  const updatePassword = async () => {
    setLoading(true);

    setErrors({} as StateProps);

    try {
      const schema = Yup.object().shape({
        old_password: Yup.string().required("Senha obrigatória"),
        password: Yup.string()
          .required("Nova senha é obrigatória")
          .min(6, "Nova senha deve ter no mínimo 6 caracteres"),
        password_confirmation: Yup.string()
          .required("Confirmação de senha é obrigatória")
          .oneOf([Yup.ref("password")], "As senhas devem ser iguais"),
      });

      await schema.validate(values, {
        abortEarly: false,
      });

      const formData = {
        ...user,
        ...(values.old_password
          ? {
              old_password: values?.old_password,
              password: values?.password,
            }
          : {}),
      };

      delete formData.id;
      delete formData.avatar;
      delete formData.avatar_url;
      delete formData.need_update_password;
      delete formData.created_at;
      delete formData.updated_at;

      const response = await api.put("/profile", formData);

      updateUser(response.data);

      toast({
        title: "Senha atualizada",

        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
      setValues({
        ...user,
        old_password: "",
        password: "",
        password_confirmation: "",
      });
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));

        return;
      }
      if (err.response) {
        return toast({
          title:
            err.response.data.message ||
            "Ocorreu um erro ao atualizar sua senha, tente novamente",

          status: "error",
          position: "top-right",
          duration: 3000,
          isClosable: true,
        });
      }
      return toast({
        title: "Ocorreu um erro ao atualizar sua senha, tente novamente",

        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <HeaderSideBar backRoute={true}>
      <Text
        color="gray.500"
        fontWeight="semibold"
        fontSize="20px"
        ml={[0, "28px"]}
      >
        Trocar senha
        {loading && <Spinner color={office?.primary_color} ml="4" size="sm" />}
      </Text>

      <Flex alignItems="center" justifyContent="center" as="form">
        <Stack spacing={[5, 10]} mt={["24px", "40px"]} w="852px">
          <Input
            label="Senha anterior:"
            mt="6"
            mb="2"
            name="old_password"
            value={values?.old_password}
            error={errors?.old_password}
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            type={showPassword ? "text" : "password"}
            leftIcon={<Icon as={IoLockClosedOutline} />}
            rightIcon={
              <ChakraButton
                _focus={{ outline: "none" }}
                size="sm"
                variant="ghost"
                onClick={handleViewPassword}
              >
                {showPassword ? (
                  <Icon color="blue.600" fontSize="20px" as={IoEyeOffOutline} />
                ) : (
                  <Icon color="blue.600" fontSize="20px" as={IoEyeOutline} />
                )}
              </ChakraButton>
            }
            placeholder="Senha antiga"
          />
          <Input
            label="Nova senha:"
            mt="6"
            mb="2"
            name="password"
            value={values?.password}
            error={errors?.password}
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            type={showPassword ? "text" : "password"}
            leftIcon={<Icon as={IoLockClosedOutline} />}
            rightIcon={
              <ChakraButton
                _focus={{ outline: "none" }}
                size="sm"
                variant="ghost"
                onClick={handleViewPassword}
              >
                {showPassword ? (
                  <Icon color="blue.600" fontSize="20px" as={IoEyeOffOutline} />
                ) : (
                  <Icon color="blue.600" fontSize="20px" as={IoEyeOutline} />
                )}
              </ChakraButton>
            }
            placeholder="Nova Senha"
          />
          <Input
            label="Confirmar senha:"
            mt="6"
            mb="2"
            name="password_confirmation"
            value={values?.password_confirmation}
            error={errors?.password_confirmation}
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            type={showPassword ? "text" : "password"}
            leftIcon={<Icon as={IoLockClosedOutline} />}
            rightIcon={
              <ChakraButton
                _focus={{ outline: "none" }}
                size="sm"
                variant="ghost"
                onClick={handleViewPassword}
              >
                {showPassword ? (
                  <Icon color="blue.600" fontSize="20px" as={IoEyeOffOutline} />
                ) : (
                  <Icon color="blue.600" fontSize="20px" as={IoEyeOutline} />
                )}
              </ChakraButton>
            }
            placeholder="Confirmar Senha"
          />

          <Button onClick={updatePassword} w="280px" alignSelf={"center"}>
            Salvar nova senha
          </Button>
        </Stack>
      </Flex>
    </HeaderSideBar>
  );
}
