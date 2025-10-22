import {
  Box,
  Flex,
  Select,
  Spinner,
  Stack,
  Text,
  useToast,
  VStack,
  Icon,
  Container,
  Heading,
} from '@chakra-ui/react';
import axios from 'axios';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { PatternFormat } from 'react-number-format';
import { useLocation, useParams } from 'react-router';
import * as Yup from 'yup';
import Button from '../components/Form/Button';
import Input from '../components/Form/Input';
import { StateProps } from '../dtos';
import getValidationErrors from '../utils/validationError';
import { IoCheckmarkCircle } from 'react-icons/io5';

const MUNIR_NETO_OFFICE_ID = '3bcc2bae-15ec-438f-a710-c9a60cc58e0d';

export default function VoterSelfRegister() {
  const [values, setValues] = useState({} as StateProps);
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const toast = useToast();
  const { officeId } = useParams();
  const location = useLocation();
  const isKnownOffice = officeId === MUNIR_NETO_OFFICE_ID;
  const officeName = isKnownOffice ? 'Gabinete Deputado Munir Neto' : '';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const nameParam = params.get('name');
    const cellphoneParam = params.get('cellphone');

    if (nameParam || cellphoneParam) {
      let ddd = '';
      let cellphone = '';
      let cellphoneMask = '';

      if (cellphoneParam) {
        const digits = cellphoneParam.replace(/\D/g, '');
        ddd = digits.slice(0, 2);
        cellphone = digits.slice(2);
        cellphoneMask =
          cellphone.length === 9
            ? `${cellphone.slice(0, 5)}-${cellphone.slice(5)}`
            : `${cellphone.slice(0, 4)}-${cellphone.slice(4)}`;
      }

      setValues((prev) => ({
        ...prev,
        name: nameParam || prev.name,
        ddd,
        dddMask: ddd,
        cellphone,
        cellphoneMask,
      }));
    }
  }, [location.search]);

  const handleRegister = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      setErrors({});
      setLoading(true);

      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome completo obrigatório'),
          ddd: Yup.string()
            .required('DDD obrigatório')
            .min(2, 'DDD deve ter 2 números')
            .max(2, 'DDD deve ter 2 números'),
          cellphone: Yup.string()
            .required('Telefone obrigatório')
            .min(8, 'Mínimo de 8 números')
            .max(9, 'Máximo de 9 números'),
        });

        await schema.validate(values, {
          abortEarly: false,
        });

        const {
          name,
          email,
          address_number,
          birthdate,
          complement,
          city,
          gender,
          neighborhood,
          reference,
          state,
          zip,
          street,
        } = values;

        const body = {
          name,
          cellphone: values.ddd + values.cellphone,
          email: email || undefined,
          office_id: officeId,
          address_number: address_number || undefined,
          birthdate: birthdate || undefined,
          city: city || undefined,
          complement: complement || undefined,
          gender: gender || undefined,
          neighborhood: neighborhood || undefined,
          reference: reference || undefined,
          state: state || undefined,
          street: street || undefined,
          zip: zip || undefined,
        };

        await axios.post(
          `${process.env.REACT_APP_API}/voter/self-create`,
          body
        );

        setSuccess(true);

        // Redirect after 3 seconds
        setTimeout(() => {
          window.location.href =
            'https://www.instagram.com/munirneto_?igsh=MTVoeXppZWE1NWMxaA==';
        }, 3000);
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          setErrors(getValidationErrors(err));
          return;
        }

        const errorMessage =
          err?.response?.data?.message ||
          'Ocorreu um erro ao realizar o cadastro. Tente novamente.';

        toast({
          title: 'Erro no cadastro',
          description: errorMessage,
          status: 'error',
          position: 'top',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [values, officeId, toast]
  );

  const getCep = async () => {
    if (!values?.zip || values?.zip.length < 8) {
      toast({
        title: 'CEP inválido',
        description: 'Por favor, digite um CEP válido.',
        status: 'warning',
        position: 'top',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setCepLoading(true);
    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${values?.zip}/json/`
      );

      if (response.data.erro) {
        setValues({
          ...values,
          street: '',
          neighborhood: '',
          city: '',
          state: '',
        });
        return toast({
          title: 'CEP não encontrado',
          description: 'Verifique o CEP digitado e tente novamente.',
          status: 'error',
          position: 'top',
          duration: 3000,
          isClosable: true,
        });
      }

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
        title: 'Erro ao buscar CEP',
        description: 'Não foi possível buscar as informações do CEP.',
        status: 'error',
        position: 'top',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setCepLoading(false);
    }
  };

  // Show error if no office ID provided
  if (!officeId) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="gray.50" px="16px">
        <Container maxW="container.sm">
          <VStack spacing={4} bg="white" p={8} borderRadius="lg" boxShadow="md">
            <Text fontSize="lg" color="gray.600" textAlign="center">
              Link de cadastro inválido
            </Text>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              Este link está incompleto. Por favor, use o link completo enviado
              para você.
            </Text>
          </VStack>
        </Container>
      </Flex>
    );
  }

  if (success) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="gray.50" px="16px">
        <Container maxW="container.sm">
          <VStack
            spacing={6}
            bg="white"
            p={8}
            borderRadius="lg"
            boxShadow="md"
            textAlign="center"
          >
            <Icon as={IoCheckmarkCircle} w={20} h={20} color="green.500" />
            <Heading size="lg" color="gray.700">
              Cadastro realizado com sucesso!
            </Heading>
            <Text color="gray.600" fontSize="md">
              Obrigado por se cadastrar como apoiador
              {isKnownOffice ? ` de ${officeName}` : ''}.
            </Text>
            <Text color="gray.500" fontSize="sm">
              Você será redirecionado em instantes...
            </Text>
          </VStack>
        </Container>
      </Flex>
    );
  }

  return (
    <Flex minH="100vh" bg="gray.50" direction="column">
      {isKnownOffice && (
        <Box bg="blue.600" py={4} px={4} boxShadow="sm">
          <Container maxW="container.sm">
            <VStack spacing={2}>
              <Heading size="sm" color="white" textAlign="center">
                {officeName}
              </Heading>
              <Text color="whiteAlpha.900" fontSize="xs" textAlign="center">
                Cadastro de Apoiador
              </Text>
            </VStack>
          </Container>
        </Box>
      )}

      <Container maxW="container.sm" py={6} px={4}>
        <Box bg="white" borderRadius="lg" boxShadow="md" p={6}>
          <form onSubmit={handleRegister}>
            <Stack spacing={5}>
              <Text color="gray.600" fontSize="sm" textAlign="center">
                Preencha seus dados para se cadastrar como apoiador
              </Text>

              <Box>
                <Text color="gray.700" fontWeight="500" mb={2} fontSize="sm">
                  Nome completo*
                </Text>
                <Input
                  placeholder="Digite seu nome completo"
                  name="name"
                  type="text"
                  error={errors?.name}
                  value={values.name}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                  borderColor="gray.300"
                />
              </Box>

              <Box>
                <Text color="gray.700" fontWeight="500" mb={2} fontSize="sm">
                  Telefone*
                </Text>
                <Flex gap={2}>
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
                    w="80px"
                    borderColor="gray.300"
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
                    flex={1}
                    borderColor="gray.300"
                  />
                </Flex>
              </Box>

              <Box>
                <Text color="gray.700" fontWeight="500" mb={2} fontSize="sm">
                  E-mail
                </Text>
                <Input
                  placeholder="seu@email.com"
                  name="email"
                  type="email"
                  error={errors?.email}
                  value={values.email}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                  borderColor="gray.300"
                />
              </Box>

              <Box>
                <Text color="gray.700" fontWeight="500" mb={2} fontSize="sm">
                  Referência
                </Text>
                <Input
                  placeholder="Quem indicou você?"
                  name="reference"
                  type="text"
                  error={errors?.reference}
                  value={values.reference}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                  borderColor="gray.300"
                />
              </Box>

              <Flex gap={3}>
                <Box flex={1}>
                  <Text color="gray.700" fontWeight="500" mb={2} fontSize="sm">
                    Data de nascimento
                  </Text>
                  <Input
                    name="birthdate"
                    type="date"
                    error={errors?.birthdate}
                    value={values.birthdate}
                    onChange={(e) =>
                      setValues({ ...values, [e.target.name]: e.target.value })
                    }
                    borderColor="gray.300"
                  />
                </Box>

                <Box flex={1}>
                  <Text color="gray.700" fontWeight="500" mb={2} fontSize="sm">
                    Gênero
                  </Text>
                  <Select
                    placeholder="Selecione"
                    borderColor="gray.300"
                    bg="white"
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

              <Box>
                <Flex align="center" gap={2} mb={2}>
                  <Text color="gray.700" fontWeight="500" fontSize="sm">
                    Endereço (opcional)
                  </Text>
                  {cepLoading && <Spinner size="sm" color="blue.500" />}
                </Flex>

                <Stack spacing={3}>
                  <Flex gap={2}>
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
                      borderColor="gray.300"
                      placeholder="CEP"
                      flex={1}
                    />
                    <Button
                      onClick={getCep}
                      type="button"
                      w="100px"
                      size="md"
                      isDisabled={!values?.zip || values?.zip.length < 8}
                      bgColor="blue.600"
                      color="white"
                    >
                      Buscar
                    </Button>
                  </Flex>

                  <Input
                    placeholder="Rua"
                    name="street"
                    type="text"
                    error={errors?.street}
                    value={values.street}
                    onChange={(e) =>
                      setValues({ ...values, [e.target.name]: e.target.value })
                    }
                    borderColor="gray.300"
                  />

                  <Flex gap={2}>
                    <Input
                      placeholder="Número"
                      name="address_number"
                      type="number"
                      error={errors?.address_number}
                      value={values.address_number}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          [e.target.name]: e.target.value,
                        })
                      }
                      borderColor="gray.300"
                      w="100px"
                    />
                    <Input
                      placeholder="Bairro"
                      name="neighborhood"
                      type="text"
                      error={errors?.neighborhood}
                      value={values.neighborhood}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          [e.target.name]: e.target.value,
                        })
                      }
                      borderColor="gray.300"
                      flex={1}
                    />
                  </Flex>

                  <Input
                    placeholder="Complemento"
                    name="complement"
                    type="text"
                    error={errors?.complement}
                    value={values.complement}
                    onChange={(e) =>
                      setValues({ ...values, [e.target.name]: e.target.value })
                    }
                    borderColor="gray.300"
                  />

                  <Flex gap={2}>
                    <Input
                      placeholder="Cidade"
                      name="city"
                      type="text"
                      error={errors?.city}
                      value={values.city}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          [e.target.name]: e.target.value,
                        })
                      }
                      borderColor="gray.300"
                      flex={1}
                    />
                    <Input
                      placeholder="UF"
                      name="state"
                      type="text"
                      error={errors?.state}
                      value={values.state}
                      maxLength={2}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          [e.target.name]: e.target.value.toUpperCase(),
                        })
                      }
                      borderColor="gray.300"
                      w="70px"
                    />
                  </Flex>
                </Stack>
              </Box>

              <Button
                type="submit"
                w="100%"
                mt={4}
                isLoading={loading}
                bgColor="blue.600"
                color="white"
              >
                Cadastrar
              </Button>

              <Text color="gray.500" fontSize="xs" textAlign="center">
                * Campos obrigatórios
              </Text>
            </Stack>
          </form>
        </Box>

        <Text color="gray.500" fontSize="xs" textAlign="center" mt={4}>
          Powered by Nosso Gabinete
        </Text>
      </Container>
    </Flex>
  );
}
