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
import { IoMailOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';
import LogoWhite from '../assets/logoWhite.png';
import Input from '../components/Form/Input';
import { StateProps } from '../dtos';
import api from '../services/api';
import getValidationErrors from '../utils/validationError';

type ForgotPasswordFormInputs = {
  email: string;
};

export default function ForgetPassword() {
  const [values, setValues] = useState<ForgotPasswordFormInputs>(
    {} as ForgotPasswordFormInputs
  );
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleResetPassword = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setErrors({});

      setLoading(true);
      try {
        const schema = Yup.object().shape({
          email: Yup.string()
            .email('Email inválido')
            .required('Email obrigatório'),
        });

        await schema.validate(values, {
          abortEarly: false,
        });

        const body = {
          email: values?.email,
        };

        await api.post('/password/forgot', body);

        toast({
          title: 'Link enviado com sucesso',
          description: 'Você receberá um link no e-mail.',
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
              'Ocorreu um erro ao solicitar o link, cheque as credenciais',

            status: 'error',
            position: 'top-right',
            duration: 3000,
            isClosable: true,
          });
        }
        return toast({
          title: 'Ocorreu um erro ao solicitar o link, cheque os credenciais',

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

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      padding={'0 0 40px 0'}
      flexDirection={'column'}
      bg="linear-gradient(180deg, #265B5A 0%, #073431 100%)"
    >
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
            Esqueceu sua senha?
          </Heading>
          <Text color="gray.600" mt="16px" fontSize="sm">
            Digite seu e-mail registrado abaixo para receber instruções de
            redefinição de senha.
          </Text>
          <Stack spacing={6} mt="24px">
            <Input
              name="email"
              type="email"
              error={errors?.email}
              value={values.email}
              focusBorderColor="#00A39C"
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              leftIcon={<Icon as={IoMailOutline} />}
              placeholder="E-mail"
            />
            <Button
              onClick={handleResetPassword}
              bg={'#00A39C'}
              color={'white'}
              _hover={{
                bg: '#265B5A',
              }}
            >
              {loading ? <Spinner color="white" /> : 'Enviar'}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
