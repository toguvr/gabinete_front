import {
  Box,
  Flex,
  Select,
  Spinner,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { PatternFormat } from 'react-number-format';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Button from '../components/Form/Button';
import Input from '../components/Form/Input';
import HeaderSideBar from '../components/HeaderSideBar';
import { useAuth } from '../contexts/AuthContext';
import { RoleDTO, StateProps } from '../dtos';
import api from '../services/api';
import getValidationErrors from '../utils/validationError';

type RegisterFormData = {
  name: string;
  cellphone: string;
  cellphoneMask?: string;
  email: string;
  office_id?: string;
  role_id?: string;
  ddd: string;
  dddMask?: string;
  gender: string;
  birthdate?: string;
};

export default function PermissionRegister() {
  const [values, setValues] = useState<RegisterFormData>(
    {} as RegisterFormData
  );
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { role, office } = useAuth();
  const [verify, setVerify] = useState(false);
  const [roles, setRoles] = useState([] as RoleDTO[]);
  const navigate = useNavigate();

  const handleRegister = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      setErrors({});

      setLoading(true);
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome completo obrigatório'),
          email: Yup.string()
            .email('Email inválido')
            .required('Email obrigatório'),
        });

        await schema.validate(values, {
          abortEarly: false,
        });

        const body = {
          name: values?.name,
          cellphone: values?.ddd + values?.cellphone,
          email: values?.email,
          office_id: office?.id,
          role_id: values?.role_id,
          gender: values?.gender,
          birthdate: values?.birthdate,
        };

        await api.post('/invite', body);

        toast({
          title: 'Cadastrado com sucesso',
          description: 'Você cadastrou uma equipe.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
        return navigate('/equipe');
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          setErrors(getValidationErrors(err));

          return;
        }
        if (err.response) {
          return toast({
            title:
              err.response.data.message ||
              'Ocorreu um erro ao cadastrar a equipe, cheque as credenciais',

            status: 'error',
            position: 'top-right',
            duration: 3000,
            isClosable: true,
          });
        }
        return toast({
          title: 'Ocorreu um erro ao cadastrar a equipe, cheque as credenciais',

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

  const verifyPermission = async () => {
    setLoading(true);

    try {
      const schema = Yup.object().shape({
        email: Yup.string().required('E-mail obrigatório'),
      });

      await schema.validate(values, {
        abortEarly: false,
      });

      const response = await api.get(
        `/invite/check/office/${role?.office_id}/email/${values.email}`
      );

      if (response.data.isUserOnThisOffice === false) {
        setVerify(true);
      } else if (response.data.user) {
        setValues({
          name: response.data.user.name,
          ddd: response?.data?.user?.cellphone.slice(0, 2),
          dddMask: response?.data?.user?.cellphone.slice(0, 2),
          cellphone: response?.data?.user?.cellphone.slice(2),
          cellphoneMask: response?.data?.user?.cellphone.slice(2),
          email: response?.data?.user?.email,
          gender: response?.data?.user?.gender,
        });
      }
    } catch (err: any) {
      return toast({
        title:
          err?.response?.data?.message ||
          'Não foi possível verificar o e-mail.',
        status: 'warning',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoles = async () => {
    setRoles([] as RoleDTO[]);

    setLoading(true);
    try {
      const response = await api.get(`/role/office/${office?.id}`);
      setRoles(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getRoles();
  }, []);
  return (
    <HeaderSideBar backRoute={true}>
      <Text color="gray.500" fontWeight="semibold" fontSize="20px">
        Cadastrar Equipe
      </Text>
      <Flex alignItems="center" justifyContent="center" as="form">
        <Stack spacing={[5, 10]} mt={['24px', '40px']} w="852px">
          <Flex display={'flex'} alignItems={'flex-end'} gap={['20px', '40px']}>
            <Input
              color={verify ? 'gray.300' : 'gray.500'}
              label="E-mail*:"
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
              disabled={verify}
            />

            <Button onClick={verifyPermission} w="200px" isDisabled={verify}>
              {loading ? <Spinner color="white" /> : 'Verificar'}
            </Button>
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
              Gênero*:
            </Text>
            <Select
              placeholder="Gênero"
              borderColor="gray.500"
              bg="gray.50"
              _placeholder={{ color: 'gray.500' }}
              color="gray.600"
              disabled={!verify}
              name="gender"
              value={values?.gender}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
            >
              <option value="MALE">Masculino</option>
              <option value="FEMALE">Feminino</option>
            </Select>
          </Box>
          <Flex flexDir={'column'}>
            <Text color={!verify ? 'gray.300' : 'gray.500'}>Telefone*:</Text>
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
                isDisabled={!verify}
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
                value={values.cellphoneMask}
                onValueChange={(value) => {
                  setValues({
                    ...values,
                    cellphone: value?.value,
                    cellphoneMask: value?.formattedValue,
                  });
                }}
                placeholder="00000-0000"
                w="180px"
                borderColor="gray.500"
                isDisabled={!verify}
              />
            </Flex>
          </Flex>
          <Box flexDirection={'column'}>
            <Text color={!verify ? 'gray.300' : 'gray.500'}>Cargo*:</Text>
            <Select
              borderColor={!verify ? 'gray.300' : 'gray.500'}
              bg="gray.50"
              _placeholder={{ color: 'gray.500' }}
              color={!verify ? 'gray.300' : 'gray.500'}
              name="role_id"
              value={values?.role_id}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              isDisabled={!verify}
              placeholder="Selecione"
            >
              {roles?.map((role) => {
                return (
                  <option key={role?.id} value={role?.id}>
                    {role?.name}
                  </option>
                );
              })}
            </Select>
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
