import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Image,
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
} from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import LogoWhite from '../assets/logoWhite.png';
import Input from '../components/Form/Input';
import { StateProps } from '../dtos';
import api from '../services/api';
import getValidationErrors from '../utils/validationError';

type RedefineFormInputs = {
  password: string;
  confirmationPassword: string;
};

export default function RedefinePassword() {
  const [values, setValues] = useState<RedefineFormInputs>(
    {} as RedefineFormInputs
  );
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleResetPassword = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setErrors({});

      setLoading(true);
      try {
        const schema = Yup.object().shape({
          password: Yup.string()
            .required('Senha obrigatória')
            .min(6, 'Mínimo de 6 dígitos'),
          confirmationPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Confirmação incorreta')
            .required('Senha obrigatória'),
        });

        await schema.validate(values, {
          abortEarly: false,
        });

        const token = new URLSearchParams(location.search).get('token');

        if (!token) {
          throw new Error();
        }

        const body = {
          password: values.password,
          password_confirmation: values.confirmationPassword,
          token,
        };

        await api.post('/password/reset', body);

        toast({
          title: 'Senha redefinida com sucesso',
          description: 'Você inseriu uma nova senha.',
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
              'Ocorreu um erro ao redefinir senha, cheque as credenciais',

            status: 'error',
            position: 'top-right',
            duration: 3000,
            isClosable: true,
          });
        }
        return toast({
          title: 'Ocorreu um erro ao redefinir senha, cheque as credenciais',

          status: 'error',
          position: 'top-right',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    },
    // [signIn, values]
    [values]
  );

  const handleViewPassword = () => setShowPassword(!showPassword);

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      padding={'0 0 40px 0'}
      flexDirection={'column'}
      bg="linear-gradient(180deg, #265B5A 0%, #073431 100%)"
    >
      {/* <Box height="40px" margin={'0 4px 40px 0'}>
        <Image src={LogoWhite} alt="Logo" />
      </Box> */}
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Box
          rounded={'sm'}
          bg="white"
          boxShadow={'lg'}
          p={['20px', '104px 80px 88px']}
        >
          <Heading
            color="gray.600"
            size="md"
            display={'flex'}
            justifyContent="center"
          >
            Insira uma nova senha
          </Heading>
          <Text color="gray.600" mt="16px" fontSize="sm">
            Digite uma nova senha e clique em confirmar para redefinição de
            senha.
          </Text>
          <Stack spacing={6} mt="24px">
            <Input
              mt="6"
              name="password"
              value={values.password}
              error={errors?.password}
              focusBorderColor="#00A39C"
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              type={showPassword ? 'text' : 'password'}
              leftIcon={<Icon as={IoLockClosedOutline} />}
              rightIcon={
                <Button
                  _focus={{ outline: 'none' }}
                  size="sm"
                  variant="ghost"
                  onClick={handleViewPassword}
                >
                  {showPassword ? (
                    <Icon
                      color="#00A39C"
                      fontSize="20px"
                      as={IoEyeOffOutline}
                    />
                  ) : (
                    <Icon color="#00A39C" fontSize="20px" as={IoEyeOutline} />
                  )}
                </Button>
              }
              placeholder="Senha"
            />
            <Input
              mt="6"
              focusBorderColor="#00A39C"
              name="confirmationPassword"
              value={values.confirmationPassword}
              error={errors?.confirmationPassword}
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
                      color="#00A39C"
                      fontSize="20px"
                      as={IoEyeOffOutline}
                    />
                  ) : (
                    <Icon color="#00A39C" fontSize="20px" as={IoEyeOutline} />
                  )}
                </Button>
              }
              placeholder="Confirmar Senha"
            />
            <Button
              onClick={handleResetPassword}
              mt="6"
              bg={'#00A39C'}
              color={'white'}
              _hover={{
                bg: '#265B5A',
              }}
            >
              {loading ? <Spinner color="white" /> : 'Confirmar'}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
