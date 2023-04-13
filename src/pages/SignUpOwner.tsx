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
        });

        await schema.validate(values, {
          abortEarly: false,
        });

        return toast({
          title: 'Cadastrado com sucesso',
          description: 'Você conseguiu se cadastrar.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
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

  const callback = async (image: any) => {
    setLoadingPhoto(true);
    const formData = new FormData();
    formData.append('avatar', image);

    try {
      const response = await api.patch('/users/avatar', formData);
      // setValues(response.data);
      // updateUser(response.data);

      return toast({
        title: 'Foto atualizada!',
        status: 'success',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Foto não atualizada, tente novamente.',
        status: 'error',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingPhoto(false);
    }
  };

  const handleAvatarChange = useCallback(
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

  const handleViewPassword = () => setShowPassword(!showPassword);

  const handleKeyPress = (event: any) => {
    // if (event.key === 'Enter') {
    //   handleSignUp(event);
    // }
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
        <Flex justifyContent={'center'} position="relative" mt="48px">
          <label htmlFor="avatar">
            <Avatar bg="gray.100" position="unset" size="xl" />
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
              onChange={handleAvatarChange}
              id="avatar"
              display="none"
            />
          </label>
        </Flex>
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
              borderColor="gray.500"
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
          onClick={() => navigate('/cadastrar-gabinete')}
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
