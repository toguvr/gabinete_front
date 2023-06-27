import {
  Box,
  Button,
  Flex,
  Icon,
  Img,
  Link,
  Spinner,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { FormEvent, useCallback, useState } from 'react';
import {
  IoEyeOffOutline,
  IoEyeOutline,
  IoLockClosedOutline,
  IoMailOutline,
} from 'react-icons/io5';
import * as Yup from 'yup';
import logo from '../assets/nossoGabienteLogo.png';
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
      bg="linear-gradient(180deg, #265B5A 0%, #073431 100%)"
    >
      <Flex>
        <Stack alignItems="center" mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Img height="230px" width="250px" src={logo} />

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
              focusBorderColor="#00A39C"
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              leftIcon={<Icon as={IoMailOutline} color="#00A39C" />}
              placeholder="E-mail asdasdasd"
            />

            <Input
              onKeyPress={handleKeyPress}
              name="password"
              focusBorderColor="#00A39C"
              value={values.password}
              error={errors?.password}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              type={showPassword ? 'text' : 'password'}
              leftIcon={<Icon as={IoLockClosedOutline} color="#00A39C" />}
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
                      color="#00A39C"
                    />
                  ) : (
                    <Icon fontSize="20px" as={IoEyeOutline} color="#00A39C" />
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
              <Link href="/esqueci-senha" color={'#00A39C'} fontSize={'14px'}>
                Esqueci senha
              </Link>
            </Flex>
            <Button
              onClick={handleSignIn}
              bg={'#00A39C'}
              color={'white'}
              _hover={{
                bg: '#265B5A',
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
              mt="8px"
            >
              <Link
                href="/cadastrar-proprietario"
                color={'#00A39C'}
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
