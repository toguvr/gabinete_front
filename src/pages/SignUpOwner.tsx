import {
  Avatar,
  Flex,
  Icon,
  Progress,
  Spinner,
  Text,
  Input as ChakraInput,
  useToast,
  VStack,
  Box,
  Select,
  Button,
} from '@chakra-ui/react';
import {
  IoAddCircleSharp,
  IoCamera,
  IoEyeOffOutline,
  IoEyeOutline,
  IoLockClosedOutline,
} from 'react-icons/io5';
import resize from '../components/Resize';
import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import api from '../services/api';
import Input from '../components/Form/Input';
import { StateProps } from '../dtos';
import * as Yup from 'yup';
import getValidationErrors from '../utils/validationError';
import { PatternFormat } from 'react-number-format';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SignUpProps {
  name: string;
  gender: string;
  email: string;
  password: string;
  cellphoneMask: string;
  cellphone: string;
}

export default function SignUpOwner() {
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const toast = useToast();
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [values, setValues] = useState({} as SignUpProps);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const handleSignUp = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setErrors({});

      setLoading(true);
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .email('Email inválido')
            .required('Email obrigatório'),
          password: Yup.string().required('Senha obrigatória'),
          gender: Yup.string().required('Gênero obrigatório'),
          cellphone: Yup.string()
            .matches(phoneRegExp, 'Número de celular inválido.')
            .required('Número de celular obrigatório'),
        });

        await schema.validate(values, {
          abortEarly: false,
        });

        const { name, email, gender, cellphone, password } = values;

        const body = {
          name,
          email,
          password,
          gender,
          cellphone,
        };

        await api.post('/users', body);
        await signIn({
          email: values.email,
          password: values.password,
        });

        toast({
          title: 'Cadastrado com sucesso',
          description: 'Você realizou o cadastro com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
        return navigate('/cadastrar-gabinete');
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
    [values]
  );

  const handleViewPassword = () => setShowPassword(!showPassword);

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
        <Progress value={50} w={['100%', '100%', '450px']} />
        <Text fontSize={'24px'} color="gray.500" fontWeight="600" mt="24px">
          Cadastrar Proprietário
        </Text>

        <VStack spacing={6} maxW="850px" w="100%" mt="32px">
          <Input
            labelColor="gray.500"
            label="Nome:"
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
          <Box w="100%">
            <Text color="gray.500" fontWeight="400" margin="0">
              Gênero:
            </Text>
            <Select
              placeholder="Gênero"
              borderColor={errors.gender ? 'red' : 'gray.500'}
              bg="gray.50"
              _placeholder={{ color: 'gray.500' }}
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
            {errors.gender && (
              <Text mt="2" align="left" fontSize={14} color="red">
                {errors.gender}
              </Text>
            )}
          </Box>
          <Input
            color="gray.500"
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
            w="100%"
          />
          <Box width="100%">
            <Text color="gray.500" alignSelf={'start'}>
              Contato:
            </Text>
            <PatternFormat
              name="cellphone"
              customInput={Input}
              error={errors?.cellphone}
              value={values?.cellphoneMask}
              onValueChange={(value) =>
                setValues({
                  ...values,
                  cellphone: value?.value,
                  cellphoneMask: value?.formattedValue,
                })
              }
              type="tel"
              format="(##) #####-####"
              borderColor="gray.500"
              mask="_"
            />
          </Box>
          <Input
            label="Senha:"
            onKeyPress={handleKeyPress}
            name="password"
            value={values.password}
            error={errors?.password}
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            type={showPassword ? 'text' : 'password'}
            leftIcon={<Icon as={IoLockClosedOutline} color="blue.500" />}
            rightIcon={
              <Button
                _focus={{ outline: 'none' }}
                size="sm"
                variant="ghost"
                onClick={handleViewPassword}
              >
                {showPassword ? (
                  <Icon fontSize="20px" as={IoEyeOffOutline} color="blue.500" />
                ) : (
                  <Icon fontSize="20px" as={IoEyeOutline} color="blue.500" />
                )}
              </Button>
            }
            placeholder="Senha"
            mt="24px"
          />
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
          {loading ? <Spinner color="white" /> : 'Continuar'}
        </Button>
      </Flex>
    </Flex>
  );
}
