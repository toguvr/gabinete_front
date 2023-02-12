import {
  Button,
  FormControl,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
  Box,
  Image,
  Icon,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { FormEvent, useCallback, useState } from "react";
import {
  IoEyeOffOutline,
  IoEyeOutline,
  IoLockClosedOutline,
  IoMailOutline,
} from "react-icons/io5";
import LogoWhite from "../assets/logoWhite.png";
import { StateProps } from "../dtos";
import * as Yup from "yup";
import getValidationErrors from "../utils/validationError";
import Input from "../components/Form/Input";

type RedefineFormInputs = {
  password: string;
};

export default function RedefinePassword() {
  const [values, setValues] = useState<RedefineFormInputs>(
    {} as RedefineFormInputs
  );
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const handleResetPassword = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setErrors({});

      setLoading(true);
      try {
        const schema = Yup.object().shape({
          password: Yup.string()
            .required("Senha obrigatória")
            .min(6, "Mínimo de 6 dígitos"),
        });

        await schema.validate(values, {
          abortEarly: false,
        });

        // await signIn(values);
        console.log("values", values);

        return toast({
          title: "Senha redefinida com sucesso",
          description: "Você inseriu uma nova senha.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
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
              "Ocorreu um erro ao redefinir senha, cheque as credenciais",

            status: "error",
            position: "top-right",
            duration: 3000,
            isClosable: true,
          });
        }
        return toast({
          title: "Ocorreu um erro ao redefinir senha, cheque as credenciais",

          status: "error",
          position: "top-right",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    },
    // [signIn, values]
    [values]
  );

  const handleViewPassword = () => setShowPassword(!showPassword);

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      padding={"0 0 40px 0"}
      flexDirection={"column"}
      bg="linear-gradient(180deg, #0084DE 0%, #004279 100%)"
    >
      <Box height="40px" margin={"0 4px 40px 0"}>
        <Image src={LogoWhite} alt="Logo" />
      </Box>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Box
          rounded={"lg"}
          bg="white"
          boxShadow={"lg"}
          p={["20px", "104px 80px 88px"]}
        >
          <Heading color="gray.600" size="md">
            Insira uma nova senha
          </Heading>
          <Text color="gray.600" mt="16px" fontSize="sm">
            Digite uma nova senha e clique em confirmar para redefinição de
            senha.
          </Text>
          <Stack spacing={6} mt="24px">
            <Input
              mt="6"
              mb="2"
              name="password"
              value={values.password}
              error={errors?.password}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              type={showPassword ? "text" : "password"}
              leftIcon={<Icon as={IoLockClosedOutline} />}
              rightIcon={
                <Button
                  _focus={{ outline: "none" }}
                  size="sm"
                  variant="ghost"
                  onClick={handleViewPassword}
                >
                  {showPassword ? (
                    <Icon
                      color="blue.600"
                      fontSize="20px"
                      as={IoEyeOffOutline}
                    />
                  ) : (
                    <Icon color="blue.600" fontSize="20px" as={IoEyeOutline} />
                  )}
                </Button>
              }
              placeholder="Senha"
            />
            <Button
              onClick={handleResetPassword}
              bg={"blue.600"}
              color={"white"}
              _hover={{
                bg: "blue.700",
              }}
            >
              {loading ? <Spinner color="white" /> : "Confirmar"}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}