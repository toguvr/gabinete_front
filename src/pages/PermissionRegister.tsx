import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Checkbox,
  CheckboxGroup,
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
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import Button from "../components/Form/Button";

type RegisterFormData = {
  name: string;
  cellphone: string;
  email: string;
  office_id: string;
  role_id: string;
  ddd: string;
  gender: string;
};

export default function PermissionRegister() {
  const [values, setValues] = useState<RegisterFormData>(
    {} as RegisterFormData
  );
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { role } = useAuth();
  const [verify, setVerify] = useState(false);

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
        });

        await schema.validate(values, {
          abortEarly: false,
        });

        const body = {
          name: values.name,
          cellphone: values.ddd + values.cellphone,
          email: values.email,
          office_id: values.email,
          role_id: values.role_id,
        };

        await api.post("/permission", body);

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

  const verifyPermission = async () => {
    setLoading(true);

    try {
      const schema = Yup.object().shape({
        ddd: Yup.string().required("Obrigatório"),
        cellphone: Yup.string().required("E-mail obrigatório"),
      });

      await schema.validate(values, {
        abortEarly: false,
      });

      const response = await api.get(
        `/invite/check/office/${role?.office_id}/email/${values.email}`
      );

      if (response.data.isVoterExist === false) {
        setVerify(true);
      }
    } catch (err: any) {
      return toast({
        title:
          err?.response?.data?.message || "Eleitor registrado no gabinete.",
        status: "warning",
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
      <Text color="gray.500" fontWeight="semibold" fontSize="20px">
        Cadastrar Equipe
      </Text>
      <Flex alignItems="center" justifyContent="center" as="form">
        <Stack spacing={[5, 10]} mt={["24px", "40px"]} w="852px">
          <Flex display={"flex"} alignItems={"flex-end"} gap={["20px", "40px"]}>
            <Input
              color={verify ? "gray.300" : "gray.500"}
              label="E-mail:"
              placeholder="E-mail"
              name="email"
              type="email"
              error={errors?.email}
              value={values.email}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              borderColor="gray.500"
              w="100%"
              disabled={verify}
            />

            <Button onClick={verifyPermission} w="200px" isDisabled={verify}>
              {loading ? <Spinner color="white" /> : "Verificar"}
            </Button>
          </Flex>
          <Input
            labelColor={!verify ? "gray.300" : "gray.500"}
            label="Nome:"
            placeholder="Nome completo"
            name="name"
            type="text"
            error={errors?.name}
            value={values.name}
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            borderColor="gray.500"
            disabled={!verify}
          />
          <Box w="100%">
            <Text
              color={!verify ? "gray.300" : "gray.500"}
              fontWeight="400"
              margin="0"
            >
              Gênero:
            </Text>
            <Select
              placeholder="Gênero"
              borderColor="gray.500"
              bg="gray.50"
              _placeholder={{ color: "gray.500" }}
              color="gray.600"
              disabled={!verify}
              name="gender"
              value={values?.gender}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
            >
              <option value="Male">Masculino</option>
              <option value="Female">Feminino</option>
            </Select>
          </Box>
          <Flex flexDir={"column"}>
            <Text color={!verify ? "gray.300" : "gray.500"}>Telefone:</Text>
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
                isDisabled={!verify}
              />
              <Input
                name="cellphone"
                type="number"
                error={errors?.cellphone}
                value={values.cellphone}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                placeholder="00000-0000"
                w="180px"
                borderColor="gray.500"
                isDisabled={!verify}
              />
            </Flex>
          </Flex>
          <Accordion allowMultiple color="gray.500">
            <Text color={!verify ? "gray.300" : "gray.500"}>Cargo:</Text>
            <AccordionItem
              borderColor={!verify ? "gray.300" : "gray.500"}
              borderRightWidth="1px"
              borderLeftWidth="1px"
              borderRadius="md"
              isDisabled={!verify}
              bgColor={!verify ? "white" : "gray.50"}
            >
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    Acessos
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} display="flex" flexDirection="column">
                <CheckboxGroup colorScheme="blue" defaultValue={[]}>
                  <Stack
                    spacing={[1, 2]}
                    maxH={["80px", "120px"]}
                    overflow="auto"
                    sx={{
                      "::-webkit-scrollbar": {
                        bg: "gray.50",
                        width: "12px",
                      },
                      "&::-webkit-scrollbar-track": {
                        width: "2px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "gray.500",
                        borderRadius: "8px",
                      },
                    }}
                  >
                    <Flex>
                      <Checkbox value="parlamentar" borderColor="gray.400">
                        Equipe
                      </Checkbox>
                      <Select bg="gray.50" w="120px" ml="20px">
                        <option value="">Ler</option>
                        <option value="">Editar</option>
                        <option value="">Excluir</option>
                      </Select>
                    </Flex>
                    <Checkbox value="acessoradm" borderColor="gray.400">
                      Eleitores
                    </Checkbox>
                    <Checkbox value="acessormark" borderColor="gray.400">
                      Demandas
                    </Checkbox>
                  </Stack>
                </CheckboxGroup>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
          <Flex
            w="100%"
            alignItems="center"
            justifyContent="center"
            mt={["40px", "95px"]}
          >
            <Button onClick={handleRegister} width="280px" isDisabled={!verify}>
              {loading ? <Spinner color="white" /> : "Cadastrar"}
            </Button>
          </Flex>
        </Stack>
      </Flex>
    </HeaderSideBar>
  );
}
