import {
  Avatar,
  Flex,
  Progress,
  Spinner,
  Text,
  Input as ChakraInput,
  useToast,
  Icon,
  VStack,
  Button,
  Box,
  Select,
} from '@chakra-ui/react';
import {
  useCallback,
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
} from 'react';
import { IoAddCircleSharp } from 'react-icons/io5';
import resize from '../components/Resize';
import api from '../services/api';
import Input from '../components/Form/Input';
import { StateProps } from '../dtos';
import * as Yup from 'yup';
import getValidationErrors from '../utils/validationError';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SignUpOfficeProps {
  name: string;
  logo_url: string;
  city: string;
  state: string;
  owner_position: string;
  primary_color: string;
  secondary_color: string;
}

export default function SignUpOffice() {
  const [values, setValues] = useState({
    primary_color: '#0066AA',
    secondary_color: '#ffffff',
  } as SignUpOfficeProps);
  const [loadingPhoto] = useState(false);
  const toast = useToast();
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { bindPermissions } = useAuth();
  const [logo, setLogo] = useState('');
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const getStates = async () => {
    const response = await fetch(
      'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
    );
    const data = await response.json();
    setStates(data.sort((a: any, b: any) => a.nome.localeCompare(b.nome)));
  };

  const getCities = async (state: string) => {
    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`
    );
    const data = await response.json();
    const myCities = data.sort((a: any, b: any) =>
      a.nome.localeCompare(b.nome)
    );
    setCities(myCities);
    setValues({ ...values, city: myCities[0].nome });
  };

  useEffect(() => {
    getStates();
  }, []);

  useEffect(() => {
    getCities(values?.state);
  }, [values?.state]);

  const handleSignUp = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setErrors({});

      setLoading(true);
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome do gabinete obrigatório'),
          city: Yup.string().required('Cidade obrigatória'),
          state: Yup.string().required('Estado obrigatório'),
          owner_position: Yup.string().required('Cargo do líder obrigatório'),
        });

        await schema.validate(values, {
          abortEarly: false,
        });

        const formData = new FormData();
        formData.append('logo', logo);
        formData.append('name', values.name);
        formData.append('city', values.city);
        formData.append('state', values.state);
        formData.append('owner_position', values.owner_position);
        formData.append('primary_color', values.primary_color);
        formData.append('secondary_color', values.secondary_color);

        const response = await api.post('/office', formData);

        bindPermissions([response.data]);

        toast({
          title: 'Cadastrado com sucesso',
          description: 'Você realizou o cadastro com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
        return navigate('/');
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          setErrors(getValidationErrors(err));

          return;
        }
        if (err.response) {
          return toast({
            title:
              err.response.data.message ||
              'Ocorreu um erro ao se cadastrar, cheque as credenciais',

            status: 'error',
            position: 'top-right',
            duration: 3000,
            isClosable: true,
          });
        }
        return toast({
          title: 'Ocorreu um erro ao se cadastrar, cheque os credenciais',

          status: 'error',
          position: 'top-right',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [values, logo, bindPermissions, toast, navigate]
  );

  const callback = async (image: any) => {
    setLogo(image);
    const url = URL.createObjectURL(image);
    setValues({ ...values, logo_url: url });
  };

  const handleLogoChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files;

        if (file.length === 0) {
          return; // se não selecionar nenhum file
        }

        // const reader = new FileReader();

        // reader.onloadend = () => {
        //   setUserData({ ...userData, file, preview: reader.result });
        // };

        // reader.readAsDataURL(file[0]);

        // funcao de resize
        resize(file[0], callback);
      }
    },
    []
  );

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      handleSignUp(event);
    }
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      padding={['12px', '56px 156px']}
      flexDirection={'column'}
      bg="linear-gradient(180deg, #0084DE 0%, #004279 100%)"
    >
      <Flex
        bg="white"
        w="100%"
        py="36px"
        px={['24px', '24px', '120px']}
        align="center"
        justify="center"
        flexDir={'column'}
        borderRadius="8px"
      >
        <Progress value={100} w={['100%', '100%', '450px']} />
        <Text fontSize={'24px'} color="gray.500" fontWeight="600" mt="24px">
          Cadastrar Gabinete
        </Text>
        <Flex justifyContent={'center'} position="relative" mt="48px">
          <label htmlFor="avatar">
            <Avatar
              bg="gray.100"
              position="unset"
              size="xl"
              src={values?.logo_url}
            />
            <Flex
              position="absolute"
              justify="center"
              align="center"
              borderRadius="full"
              right="0"
              bottom="0"
              width="32px"
              height="32px"
              cursor={'pointer'}
            >
              {loadingPhoto ? (
                <Spinner />
              ) : (
                <Icon
                  as={IoAddCircleSharp}
                  boxSize={5}
                  color="blue.500"
                  w={8}
                  h={8}
                />
              )}
            </Flex>
            <ChakraInput
              type="file"
              onChange={handleLogoChange}
              id="avatar"
              display="none"
            />
          </label>
        </Flex>
        <VStack spacing={6} maxW="850px" w="100%" mt="32px">
          <Input
            labelColor="gray.500"
            label="Nome:"
            placeholder="Nome do Gabinete"
            name="name"
            type="text"
            error={errors?.name}
            value={values?.name}
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            borderColor="gray.500"
          />
          <Flex w="100%" gap={['20px', '44px']}>
            <Box w="100%">
              <Text color="gray.500" fontWeight="400" margin="0">
                Estado:
              </Text>
              <Select
                placeholder="Estado do Gabinete"
                borderColor="gray.500"
                bg="gray.50"
                _placeholder={{ color: 'gray.500' }}
                color="gray.600"
                value={values?.state}
                name="state"
                onChange={(e) => {
                  setValues({ ...values, [e.target.name]: e.target.value });
                }}
              >
                {states.map((state: any) => {
                  return (
                    <option key={state.id} value={state.sigla}>
                      {state.nome}
                    </option>
                  );
                })}
              </Select>
              {errors.state && (
                <Text mt="2" align="left" fontSize={14} color="red">
                  {errors.state}
                </Text>
              )}
            </Box>
            <Box w="100%">
              <Text color="gray.500" fontWeight="400" margin="0">
                Cidade:
              </Text>
              <Select
                placeholder="Cidade do Gabinete"
                borderColor="gray.500"
                bg="gray.50"
                _placeholder={{ color: 'gray.500' }}
                color="gray.600"
                value={values?.city}
                name="city"
                onChange={(e) => {
                  setValues({ ...values, [e.target.name]: e.target.value });
                }}
                disabled={!values.state}
              >
                {cities.map((city: any) => {
                  return (
                    <option key={city.id} value={city.sigla}>
                      {city.nome}
                    </option>
                  );
                })}
              </Select>
              {errors.city && (
                <Text mt="2" align="left" fontSize={14} color="red">
                  {errors.city}
                </Text>
              )}
            </Box>
          </Flex>
          <Box w="100%">
            <Text color="gray.500" fontWeight="400" margin="0">
              Cargo:
            </Text>
            <Select
              placeholder="Cargo do líder"
              borderColor="gray.500"
              bg="gray.50"
              _placeholder={{ color: 'gray.500' }}
              color="gray.600"
              value={values?.owner_position}
              name="owner_position"
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
            >
              <option value="DeputadoEstadual">Desputado Estadual</option>
              <option value="Vereador">Vereador</option>
              <option value="Outro">Outro</option>
            </Select>
          </Box>

          <Flex w="100%" gap={['20px', '44px']}>
            <Input
              color="gray.500"
              label="Cor primária:"
              name="primary_color"
              type="color"
              error={errors?.primary_color}
              value={values?.primary_color}
              onChange={(e) =>
                setValues({ ...values, primary_color: e.target.value })
              }
              borderColor="gray.500"
              w="100%"
            />
            <Input
              color="gray.500"
              label="Cor secundária:"
              placeholder="Cargo do líder"
              name="secondary_color"
              type="color"
              error={errors?.secondary_color}
              value={values?.secondary_color}
              onChange={(e) =>
                setValues({ ...values, secondary_color: e.target.value })
              }
              borderColor="gray.500"
              w="100%"
            />
          </Flex>
        </VStack>
        <Button
          onClick={handleSignUp}
          bg={'blue.600'}
          color={'white'}
          _hover={{
            bg: 'blue.700',
          }}
          mt="40px"
          w={'280px'}
        >
          {loading ? <Spinner color="white" /> : 'Cadastrar'}
        </Button>
      </Flex>
    </Flex>
  );
}
