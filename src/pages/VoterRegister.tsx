import {
  Box,
  Flex,
  Select,
  Spinner,
  Stack,
  Text,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  useDisclosure,
  Button as ChakraButton,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import axios from 'axios';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { PatternFormat } from 'react-number-format';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import Button from '../components/Form/Button';
import Input from '../components/Form/Input';
import HeaderSideBar from '../components/HeaderSideBar';
import { useAuth } from '../contexts/AuthContext';
import { StateProps, VoterDTO } from '../dtos';
import api from '../services/api';
import getValidationErrors from '../utils/validationError';

export default function VoterRegister() {
  const [values, setValues] = useState({} as StateProps);
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [verify, setVerify] = useState(false);
  const { office } = useAuth();
  const navigate = useNavigate();
  const [cepLoading, setCepLoading] = useState(false);
  const { id } = useParams();
  const cancelRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleRegister = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      setErrors({});

      setLoading(true);
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome completo obrigatório'),
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
          email,
          office_id: office.id,
          address_number,
          birthdate,
          city,
          complement,
          gender,
          neighborhood,
          reference,
          state,
          street,
          zip,
        };
        await api.post('/voter', body);

        toast({
          title: 'Apoiador cadastrado com sucesso',
          description: 'Você cadastrou um apoiador.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });

        return onOpen();
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          setErrors(getValidationErrors(err));

          return;
        }
        if (err.response) {
          return toast({
            title:
              err.response.data.message ||
              'Ocorreu um erro ao cadastrar o apoiador, cheque as credenciais',

            status: 'error',
            position: 'top-right',
            duration: 3000,
            isClosable: true,
          });
        }
        return toast({
          title:
            'Ocorreu um erro ao cadastrar o apoiador, cheque as credenciais',

          status: 'error',
          position: 'top-right',
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

      if (response.data.erro) {
        setValues({
          ...values,
          street: '',
          neighborhood: '',
          city: '',
          state: '',
        });
        return toast({
          title: 'Cep não encontrado, tente novamente',
          status: 'error',
          position: 'top-right',
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
        title: 'Ocorreu um erro ao buscar o cep, tente novamente',
        status: 'error',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setCepLoading(false);
    }
  };

  const verifyVoter = async () => {
    setErrors({});

    setLoading(true);

    try {
      const verifySchema = Yup.object().shape({
        ddd: Yup.string()
          .required('DDD')
          .min(2, 'Dois números.')
          .max(2, 'Dois números.'),
        cellphone: Yup.string()
          .required('Contato')
          .min(8, 'Mínimo de oito números.')
          .max(9, 'Máximo de nove números.'),
      });

      await verifySchema.validate(values, {
        abortEarly: false,
      });

      const response = await api.get(
        `/voter/check/office/${office.id}/cellphone/${values.ddd}${values.cellphone}`
      );

      if (response.data.isVoterExist === false) {
        setVerify(true);
      }
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));

        return;
      }
      return toast({
        title:
          err?.response?.data?.message || 'Apoiador registrado no gabinete.',
        status: 'warning',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  const verifyVoterParam = async () => {
    setErrors({});

    setLoading(true);

    try {
      const response = await api.get(
        `/voter/check/office/${office.id}/cellphone/${values.ddd}${values.cellphone}`
      );
      if (response.data.isVoterExist === false) {
        setVerify(true);
      }
    } catch (err: any) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      setValues({
        ...values,
        ddd: id.substring(0, 2),
        dddMask: id.substring(0, 2),
        cellphone: id.substring(2, id.length),
        cellphoneMask: id.substring(2, id.length),
      });
    }
  }, [id]);

  useEffect(() => {
    if (id && values.ddd && values.cellphone) {
      verifyVoterParam();
    }
  }, [values.ddd, values.cellphone]);

  return (
    <HeaderSideBar backRoute={true}>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={() => {}}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent mx="12px">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Apoiador criado com sucesso!
            </AlertDialogHeader>

            <AlertDialogBody>
              Deseja adicionar uma demanda para este apoiador?
            </AlertDialogBody>

            <AlertDialogFooter>
              <ChakraButton onClick={() => navigate('/eleitor')}>
                Não
              </ChakraButton>

              <ChakraButton
                isLoading={loading}
                onClick={() =>
                  navigate(
                    `/demanda/registrar-demanda/${values?.ddd}${values?.cellphone}`
                  )
                }
                ml={3}
              >
                Sim
              </ChakraButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Text color="gray.500" fontWeight="semibold" fontSize="20px">
        Cadastrar Apoiador
      </Text>
      <Flex alignItems="center" justifyContent="center" as="form">
        <Stack spacing={[5, 8]} mt={['24px', '40px']} w="852px">
          <Flex flexDir={'column'}>
            <Text
              color={verify ? 'gray.300' : 'gray.500'}
              fontWeight="400"
              margin="0"
            >
              Telefone*:
            </Text>
            <Flex flexDir={['column', 'row']}>
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
                  isDisabled={verify}
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
                  w={['100%', '180px']}
                  borderColor="gray.500"
                  isDisabled={verify}
                />
              </Flex>
              <Button
                onClick={verifyVoter}
                w={['100%', '220px']}
                ml={['0', '45px']}
                isDisabled={verify}
                mt={['12px', '0']}
              >
                {loading ? <Spinner color="white" /> : 'Verificar'}
              </Button>
            </Flex>
          </Flex>

          <Input
            labelColor={!verify ? 'gray.300' : 'gray.500'}
            label="Nome*:"
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
          <Input
            labelColor={!verify ? 'gray.300' : 'gray.500'}
            label="Referência:"
            placeholder="Referência do apoiador"
            name="reference"
            type="text"
            error={errors?.reference}
            value={values.reference}
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            borderColor="gray.500"
            disabled={!verify}
          />
          <Input
            labelColor={!verify ? 'gray.300' : 'gray.500'}
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
            disabled={!verify}
          />
          <Box>
            <Flex
              justifyContent={['flex-start', 'space-between']}
              alignItems={['flex-start', 'flex-end']}
              flexDirection={['column', 'row']}
              gap={[5, '48px']}
            >
              <Input
                labelColor={!verify ? 'gray.300' : 'gray.500'}
                label="Data de nascimento:"
                name="birthdate"
                type="date"
                error={errors?.birthdate}
                value={values.birthdate}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                placeholder="Data de Nascimento"
                borderColor="gray.500"
                css={{
                  '&::-webkit-calendar-picker-indicator': {
                    color: 'gray.500',
                  },
                }}
                // rightIcon={
                //   <Icon
                //     color="gray.500"
                //     fontSize="20px"
                //     as={IoCalendarNumberOutline}
                //   />
                // }
                disabled={!verify}
              />

              <Box w="100%">
                <Text
                  color={!verify ? 'gray.300' : 'gray.500'}
                  fontWeight="400"
                  margin="0"
                >
                  Gênero:
                </Text>
                <Select
                  placeholder="Gênero"
                  borderColor="gray.500"
                  bg="gray.50"
                  _placeholder={{ color: 'gray.500' }}
                  color="gray.600"
                  disabled={!verify}
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
              <Text
                color={!verify ? 'gray.300' : 'gray.500'}
                fontWeight="400"
                margin="0"
              >
                Endereço:
              </Text>
              {cepLoading && (
                <Spinner color={office?.primary_color} size="sm" />
              )}
            </Flex>
            <Flex
              mb="24px"
              justifyContent={['flex-start']}
              alignItems={['flex-start', 'flex-end']}
              flexDirection={['column', 'row']}
              gap={[5, '44px']}
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
                disabled={!verify}
                w={['100%', '200px']}
                placeholder="CEP"
              />
              <Button onClick={getCep} width="280px" isDisabled={!verify}>
                {loading ? <Spinner color="white" /> : 'Buscar'}
              </Button>
            </Flex>

            <Flex
              mb="24px"
              justifyContent={['flex-start', 'space-between']}
              alignItems={['flex-start', 'flex-end']}
              flexDirection={['column', 'row']}
              gap={[5, '44px']}
            >
              <Input
                placeholder="Rua"
                name="street"
                type="text"
                error={errors?.street}
                value={values.street}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                borderColor="gray.500"
                flex={1}
                disabled={!verify}
              />
              <Input
                placeholder="Bairro"
                name="neighborhood"
                type="text"
                error={errors?.neighborhood}
                value={values.neighborhood}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                borderColor="gray.500"
                flex={1}
                disabled={!verify}
              />
              <Input
                name="address_number"
                type="number"
                error={errors?.address_number}
                value={values.address_number}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                placeholder="Numero"
                w={['100%', '200px']}
                borderColor="gray.500"
                disabled={!verify}
              />
            </Flex>
            <Flex
              mb="24px"
              justifyContent={['flex-start', 'space-between']}
              alignItems={['flex-start', 'flex-end']}
              flexDirection={['column', 'row']}
              gap={[5, '44px']}
            >
              <Input
                placeholder="Complemento"
                name="complement"
                type="text"
                error={errors?.complement}
                value={values.complement}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                borderColor="gray.500"
                disabled={!verify}
              />
              <Input
                placeholder="Cidade"
                name="city"
                type="text"
                error={errors?.city}
                value={values.city}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                borderColor="gray.500"
                disabled={!verify}
              />
              <Input
                placeholder="UF"
                name="state"
                type="text"
                error={errors?.state}
                value={values.state}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                borderColor="gray.500"
                disabled={!verify}
              />
            </Flex>
          </Box>

          <Flex
            w="100%"
            alignItems="center"
            justifyContent="center"
            mt={['40px', '95px']}
          >
            <Button onClick={handleRegister} width="280px" isDisabled={!verify}>
              {loading ? <Spinner color="white" /> : 'Cadastrar'}
            </Button>
          </Flex>
        </Stack>
      </Flex>
    </HeaderSideBar>
  );
}
