import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Stack,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { FormEvent, useCallback, useState } from "react";
import LogoWhite from "../assets/logoWhite.png";
import {
  IoEyeOffOutline,
  IoEyeOutline,
  IoLockClosedOutline,
  IoMailOutline,
} from "react-icons/io5";
import Input from "../components/Form/Input";
import { StateProps } from "../dtos";
import * as Yup from "yup";
import getValidationErrors from "../utils/validationError";
import { useAuth } from "../contexts/AuthContext";

type SignInFormData = {
  email: string;
  password: string;
};

export default function Signin() {
  const [values, setValues] = useState<SignInFormData>({} as SignInFormData);
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleViewPassword = () => setShowPassword(!showPassword);

  const handleSignIn = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setErrors({});

      setLoading(true);
      try {
        const schema = Yup.object().shape({
          email: Yup.string()
            .email("Email inválido")
            .required("Email obrigatório"),
          password: Yup.string().required("Senha obrigatória"),
        });

        await schema.validate(values, {
          abortEarly: false,
        });

        await signIn(values);

        return toast({
          title: "Autenticado com sucesso",
          description: "Você conseguiu se autenticar.",
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
              "Ocorreu um erro ao fazer login, cheque as credenciais",

            status: "error",
            position: "top-right",
            duration: 3000,
            isClosable: true,
          });
        }
        return toast({
          title: "Ocorreu um erro ao fazer login, cheque os credenciais",

          status: "error",
          position: "top-right",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [signIn, values]
  );

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
          <Stack spacing={4}>
            <Input
              name="email"
              type="email"
              error={errors?.email}
              value={values.email}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              leftIcon={<Icon as={IoMailOutline} />}
              placeholder="E-mail"
            />
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
            <Stack spacing={6}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Link href="/esqueci-senha" color={"blue.600"}>
                  Esqueci senha
                </Link>
              </Stack>
              <Button
                onClick={handleSignIn}
                bg={"blue.600"}
                color={"white"}
                _hover={{
                  bg: "blue.700",
                }}
              >
                {loading ? <Spinner color="white" /> : "Entrar"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
