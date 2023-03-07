import {
  Box,
  Flex,
  Select,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import HeaderSideBar from "../components/HeaderSideBar";
import { StateProps } from "../dtos";
import * as Yup from "yup";
import getValidationErrors from "../utils/validationError";
import Input from "../components/Form/Input";
import axios from "axios";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useLocation, useNavigate, useParams } from "react-router";
import Button from "../components/Form/Button";
import { getFormatDate } from "../utils/date";
import { parse } from "date-fns";
import { PatternFormat } from "react-number-format";

export default function VoterEdit() {
  const { id } = useParams();
  const [values, setValues] = useState({} as StateProps);
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const toast = useToast();
  const { office } = useAuth();
  const navigate = useNavigate();

  const handleUpdateVoter = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      setErrors({});

      setLoading(true);
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required("Nome completo obrigatório"),
        });

        await schema.validate(values, {
          abortEarly: false,
        });

        const {
          name,
          email,
          address_number,
          birthdate,
          city,
          gender,
          neighborhood,
          complement,
          reference,
          state,
          street,
          zip,
          document,
        } = values;

        const body = {
          name,
          cellphone: values.ddd + values.cellphone,
          email,
          office_id: office?.id,
          address_number,
          birthdate,
          city,
          gender,
          neighborhood,
          reference,
          complement,
          state,
          street,
          zip,
          document,
          voter_id: id,
        };

        await api.put("/voter", body);

        toast({
          title: "Eleitor atualizado com sucesso",
          description: "Você atualizou o eleitor.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        return navigate("/eleitor");
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          setErrors(getValidationErrors(err));

          return;
        }
        if (err.response) {
          return toast({
            title:
              err.response.data.message ||
              "Ocorreu um erro ao atualizar o eleitor, cheque as credenciais",

            status: "error",
            position: "top-right",
            duration: 3000,
            isClosable: true,
          });
        }
        return toast({
          title:
            "Ocorreu um erro ao atualizar o eleitor, cheque as credenciais",

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

  const getCep = async () => {
    setCepLoading(true);
    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${values?.zip}/json/`
      );

      const { bairro, localidade, logradouro, uf } = response.data;

      setValues({
        ...values,
        street: logradouro,
        neighborhood: bairro,
        city: localidade,
        state: uf,
      });
    } catch (err) {
      return toast({
        title: "Ocorreu um erro ao buscar o cep, tente novamente",
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setCepLoading(false);
    }
  };

  const getVoterById = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/voter/${id}`);

      setValues({
        dddMask: response?.data?.cellphone.slice(0, 2),
        cellphoneMask: response?.data?.cellphone.slice(2),
        name: response?.data?.name,
        email: response?.data?.email,
        office_id: office.id,
        address_number: response?.data?.address_number,
        birthdate: response?.data?.birthdate,
        city: response?.data?.city,
        gender: response?.data?.gender,
        neighborhood: response?.data?.neighborhood,
        complement: response?.data?.complement,
        state: response?.data?.state,
        street: response?.data?.street,
        zipMask: response?.data?.zip,
        documentMask: response?.data?.document,
        voter_id: response?.data?.id,
      });
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVoterById();
  }, []);

  return (
    <HeaderSideBar backRoute={true}>
      <Text color="gray.500" fontWeight="semibold" fontSize="20px">
        Editar Eleitor
      </Text>
      <Flex alignItems="center" justifyContent="center" as="form">
        <Stack spacing={[5, 8]} mt={["24px", "40px"]} w="852px">
          <Flex flexDir={"column"}>
            <Text color="gray.500" fontWeight="400" margin="0">
              Telefone*:
            </Text>
            <Flex>
              <PatternFormat
                customInput={Input}
                name="ddd"
                type="text"
                error={errors?.ddd}
                value={values?.dddMask}
                onValueChange={(value) => {
                  setValues({
                    ...values,
                    ddd: value?.value,
                    dddMask: value?.formattedValue,
                  });
                }}
                placeholder="DDD"
                w="72px"
                mr="8px"
                borderColor="gray.500"
                format="##"
                mask="_"
              />

              <PatternFormat
                customInput={Input}
                format="#####-####"
                mask="_"
                name="cellphone"
                type="tel"
                error={errors?.cellphone}
                value={values?.cellphoneMask}
                onValueChange={(value) => {
                  setValues({
                    ...values,
                    cellphone: value?.value,
                    cellphoneMask: value?.formattedValue,
                  });
                }}
                placeholder="00000-0000"
                w={["100%", "180px"]}
                borderColor="gray.500"
              />
            </Flex>
          </Flex>

          <Input
            label="Nome*:"
            placeholder="Nome completo"
            name="name"
            type="text"
            error={errors?.name}
            value={values?.name}
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            borderColor="gray.500"
          />
          <Input
            label="E-mail:"
            placeholder="E-mail"
            name="email"
            type="email"
            error={errors?.email}
            value={values?.email}
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            borderColor="gray.500"
          />
          <Box>
            <Flex
              justifyContent={["flex-start", "space-between"]}
              alignItems={["flex-start", "flex-end"]}
              flexDirection={["column", "row"]}
              gap={[5, "48px"]}
            >
              <Input
                label="Data de nascimento:"
                name="birthdate"
                type="date"
                error={errors?.birthdate}
                value={values?.birthdate}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                placeholder="Data de Nascimento"
                borderColor="gray.500"
                css={{
                  "&::-webkit-calendar-picker-indicator": {
                    color: "gray.500",
                  },
                }}
              />
              <PatternFormat
                customInput={Input}
                type="text"
                label="CPF:"
                format="###.###.###-##"
                mask="_"
                name="document"
                error={errors?.document}
                value={values?.documentMask}
                onValueChange={(value) => {
                  setValues({
                    ...values,
                    document: value?.value,
                    documentMask: value?.formattedValue,
                  });
                }}
                borderColor="gray.500"
                placeholder="CPF"
              />
              {/* <Input
                label="CPF:"
                name="document"
                type="number"
                error={errors?.document}
                value={values?.document}
                onChange={(e) =>
                  setValues({
                    ...values,
                    [e.target.name]: Math.max(0, parseInt(e.target.value))
                      .toString()
                      .slice(0, 11),
                  })
                }
                placeholder="CPF"
                borderColor="gray.500"
              /> */}

              <Box w="100%">
                <Text color="gray.500" fontWeight="400" margin="0">
                  Gênero:
                </Text>
                <Select
                  placeholder="Gênero"
                  borderColor="gray.500"
                  bg="gray.50"
                  _placeholder={{ color: "gray.500" }}
                  color="gray.600"
                  value={values?.gender}
                  name="gender"
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                >
                  <option value="MALE">Masculino</option>
                  <option value="FEMALE">Feminino</option>
                </Select>
              </Box>
            </Flex>
          </Box>
          <Box>
            <Flex>
              <Text color="gray.500" fontWeight="400" margin="0">
                Endereço:
              </Text>
              {cepLoading && (
                <Spinner color={office?.primary_color} size="sm" />
              )}
            </Flex>
            <Flex
              mb="24px"
              justifyContent={["flex-start", "space-between"]}
              alignItems={["flex-start", "flex-end"]}
              flexDirection={["column", "row"]}
              gap={[5, "44px"]}
            >
              <PatternFormat
                customInput={Input}
                type="text"
                format="#####-###"
                mask="_"
                name="zip"
                error={errors?.zip}
                value={values?.zipMask}
                onValueChange={(value) => {
                  setValues({
                    ...values,
                    zip: value?.value,
                    zipMask: value?.formattedValue,
                  });
                }}
                borderColor="gray.500"
                onBlur={getCep}
                w={["100%", "200px"]}
                placeholder="CEP"
              />

              <Input
                placeholder="Rua"
                name="street"
                type="text"
                error={errors?.street}
                value={values?.street}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                borderColor="gray.500"
                flex={1}
              />
            </Flex>
            <Flex
              mb="24px"
              justifyContent={["flex-start", "space-between"]}
              alignItems={["flex-start", "flex-end"]}
              flexDirection={["column", "row"]}
              gap={[5, "44px"]}
            >
              <Input
                placeholder="Bairro"
                name="neighborhood"
                type="text"
                error={errors?.neighborhood}
                value={values?.neighborhood}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                borderColor="gray.500"
                flex={1}
              />
              <Input
                name="address_number"
                type="number"
                error={errors?.address_number}
                value={values?.address_number}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                placeholder="Numero"
                w={["100%", "200px"]}
                borderColor="gray.500"
              />
            </Flex>
            <Flex
              mb="24px"
              justifyContent={["flex-start", "space-between"]}
              alignItems={["flex-start", "flex-end"]}
              flexDirection={["column", "row"]}
              gap={[5, "44px"]}
            >
              <Input
                placeholder="Complemento"
                name="complement"
                type="text"
                error={errors?.complement}
                value={values?.complement}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                borderColor="gray.500"
              />
              <Input
                placeholder="Cidade"
                name="city"
                type="text"
                error={errors?.city}
                value={values?.city}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                borderColor="gray.500"
              />
              <Input
                placeholder="UF"
                name="state"
                type="text"
                error={errors?.state}
                value={values?.state}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                borderColor="gray.500"
              />
            </Flex>
          </Box>

          <Flex
            w="100%"
            alignItems="center"
            justifyContent="center"
            mt={["40px", "95px"]}
          >
            <Button onClick={handleUpdateVoter} w="280px">
              {loading ? <Spinner color="white" /> : "Atualizar"}
            </Button>
          </Flex>
        </Stack>
      </Flex>
    </HeaderSideBar>
  );
}
