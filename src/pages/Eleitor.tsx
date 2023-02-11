import {
  Button,
  Flex,
  Select,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FormEvent, useCallback, useState } from "react";
import HeaderSideBar from "../components/HeaderSideBar";
import { StateProps } from "../dtos";
import * as Yup from "yup";
import getValidationErrors from "../utils/validationError";
import Input from "../components/Form/Input";

type RegisterFormData = {
  name: string;
  email: string;
  ddd: string;
  cell: string;
  dtNascimento: string;
};

export default function Eleitor() {
  const [values, setValues] = useState<RegisterFormData>(
    {} as RegisterFormData
  );
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleRegister = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      setErrors({});

      setLoading(true);
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required("Nome completo obrigatório"),
          email: Yup.string()
            .email("Email inválido")
            .required("Email obrigatório"),
          ddd: Yup.string().required("DDD obrigatório"),
          cell: Yup.string().required("Contato obrigatório"),
        });

        await schema.validate(values, {
          abortEarly: false,
        });

        // await signIn(values);
        console.log("values", values);

        return toast({
          title: "Cadastrado com sucesso",
          description: "Você cadastrou uma equipe.",
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
              "Ocorreu um erro ao cadastrar a equipe, cheque as credenciais",

            status: "error",
            position: "top-right",
            duration: 3000,
            isClosable: true,
          });
        }
        return toast({
          title: "Ocorreu um erro ao cadastrar a equipe, cheque as credenciais",

          status: "error",
          position: "top-right",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [values]
  );

  return (
    <HeaderSideBar>
      <Text color="gray.500" fontWeight="semibold" fontSize="20px">
        Cadastrar Eleitor
      </Text>
      <Flex alignItems="center" justifyContent="center" as="form">
        <Stack spacing={[5, 10]} mt={["24px", "40px"]} w="852px">
          <Input
            placeholder="Nome completo"
            name="name"
            type="text"
            error={errors?.name}
            value={values.name}
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            borderColor="gray.500"
          />
          <Input
            placeholder="E-mail"
            name="email"
            type="email"
            error={errors?.email}
            value={values.email}
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            borderColor="gray.500"
          />
          <Flex justifyContent={"space-between"}>
            <Input
              name="dtNascimento"
              type="date"
              error={errors?.dtNascimento}
              value={values.dtNascimento}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              placeholder="Data de Nascimento"
              w="160px"
              mr="8px"
              borderColor="gray.500"
              css={{
                "&::-webkit-calendar-picker-indicator": {
                  color: "gray.500",
                },
              }}
              // rightIcon={
              //   <Icon
              //     color="gray.500"
              //     fontSize="20px"
              //     as={IoCalendarNumberOutline}
              //   />
              // }
            />
            <Select
              placeholder="Sexo"
              borderColor="gray.500"
              bg="gray.50"
              w="160px"
              _placeholder={{ color: "gray.500" }}
              color="gray.600"
            >
              <option value="m" style={{ color: "white" }}>
                Masculino
              </option>
              <option value="f">Feminino</option>
            </Select>
            <Flex>
              <Input
                name="ddd"
                type="number"
                error={errors?.ddd}
                value={values.ddd}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                placeholder="DDD"
                w="72px"
                mr="8px"
                borderColor="gray.500"
              />
              <Input
                name="cell"
                type="number"
                error={errors?.cell}
                value={values.cell}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                placeholder="00000-0000"
                w="180px"
                borderColor="gray.500"
              />
            </Flex>
          </Flex>
          <Flex
            w="100%"
            alignItems="center"
            justifyContent="center"
            mt={["40px", "95px"]}
          >
            <Button
              onClick={handleRegister}
              bg={"blue.600"}
              color={"white"}
              alignSelf="center"
              w="280px"
              _hover={{
                bg: "blue.500",
              }}
            >
              {loading ? <Spinner color="white" /> : "Cadastrar"}
            </Button>
          </Flex>
        </Stack>
      </Flex>
    </HeaderSideBar>
  );
}
