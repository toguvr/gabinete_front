import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
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
  office: string[];
};

export default function Equipe() {
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
        Cadastrar Equipe
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
          <Accordion
            defaultIndex={[0]}
            allowMultiple
            bgColor="gray.50"
            color="gray.500"
          >
            <AccordionItem
              borderColor="gray.500"
              borderRightWidth="1px"
              borderLeftWidth="1px"
              borderRadius="md"
            >
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    Cargo
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
                    <Checkbox value="parlamentar" borderColor="gray.400">
                      Parlamentar
                    </Checkbox>
                    <Checkbox value="acessoradm" borderColor="gray.400">
                      Acessor administrativo
                    </Checkbox>
                    <Checkbox value="acessormark" borderColor="gray.400">
                      Acessor marketing
                    </Checkbox>
                    <Checkbox value="acessorfina" borderColor="gray.400">
                      Acessor financeiro
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
