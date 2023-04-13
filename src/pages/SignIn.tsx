import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Spinner,
  Stack,
  useToast,
  Text,
} from '@chakra-ui/react';
import { FormEvent, useCallback, useState } from 'react';
import {
  IoEyeOffOutline,
  IoEyeOutline,
  IoLockClosedOutline,
  IoMailOutline,
} from 'react-icons/io5';
import * as Yup from 'yup';
import LogoWhite from '../assets/logoWhite.png';
import Input from '../components/Form/Input';
import { useAuth } from '../contexts/AuthContext';
import { StateProps } from '../dtos';
import getValidationErrors from '../utils/validationError';

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
            .email('Email inválido')
            .required('Email obrigatório'),
          password: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate(values, {
          abortEarly: false,
        });

        await signIn(values);

        return toast({
          title: 'Autenticado com sucesso',
          description: 'Você conseguiu se autenticar.',
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
              'Ocorreu um erro ao fazer login, cheque as credenciais',

            status: 'error',
            position: 'top-right',
            duration: 3000,
            isClosable: true,
          });
        }
        return toast({
          title: 'Ocorreu um erro ao fazer login, cheque os credenciais',

          status: 'error',
          position: 'top-right',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [signIn, values]
  );

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      handleSignIn(event);
    }
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      padding={'0 0 40px 0'}
      flexDirection={'column'}
      bg="linear-gradient(180deg, #0084DE 0%, #004279 100%)"
    >
      {/* <Box height="40px" margin={'0 4px 40px 0'}>
        <Image src={LogoWhite} alt="Logo" />
      </Box> */}
      <Flex>
        <Stack mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Box
            rounded={'sm'}
            bg="white"
            boxShadow={'lg'}
            p={['20px', '60px 80px 64px']}
          >
            <Text textAlign={'center'} mb="40px" color="gray.500">
              Seja bem vindo
            </Text>

            <Input
              name="email"
              type="email"
              error={errors?.email}
              value={values.email}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              leftIcon={<Icon as={IoMailOutline} color="blue.500" />}
              placeholder="E-mail"
            />
            <Input
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
                    <Icon
                      fontSize="20px"
                      as={IoEyeOffOutline}
                      color="blue.500"
                    />
                  ) : (
                    <Icon fontSize="20px" as={IoEyeOutline} color="blue.500" />
                  )}
                </Button>
              }
              placeholder="Senha"
              mt="24px"
            />
            <Flex
              direction={{ base: 'column', sm: 'row' }}
              align={'start'}
              justify={'space-between'}
              mt="8px"
            >
              <Link href="/esqueci-senha" color={'blue.600'} fontSize={'14px'}>
                Esqueci senha
              </Link>
            </Flex>
            <Button
              onClick={handleSignIn}
              bg={'blue.600'}
              color={'white'}
              _hover={{
                bg: 'blue.700',
              }}
              mt="24px"
              w={'100%'}
            >
              {loading ? <Spinner color="white" /> : 'Entrar'}
            </Button>
            <Flex
              direction={{ base: 'column', sm: 'row' }}
              w={'100%'}
              justifyContent={'flex-end'}
              mt="24px"
            >
              <Link
                href="/cadastrar-proprietario"
                color={'blue.600'}
                fontSize={'14px'}
              >
                Cadastre seu Gabinete
              </Link>
            </Flex>
          </Box>
        </Stack>
      </Flex>
    </Flex>
  );
}
