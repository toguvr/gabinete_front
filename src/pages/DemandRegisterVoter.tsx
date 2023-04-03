import { Box, Flex, Select, Spinner, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { FormEvent, useCallback, useState } from 'react';
import { PatternFormat } from 'react-number-format';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import Button from '../components/Form/Button';
import Input from '../components/Form/Input';
import HeaderSideBar from '../components/HeaderSideBar';
import { useAuth } from '../contexts/AuthContext';
import { StateProps } from '../dtos';
import api from '../services/api';
import getValidationErrors from '../utils/validationError';

export default function DemandaRegisterVoter() {
  const { id } = useParams();
  const cellphone = id;
  console.log('cellphone', cellphone);
  const [values, setValues] = useState({} as StateProps);
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [verify, setVerify] = useState(cellphone ? true : false);
  const { office, role } = useAuth();
  const navigate = useNavigate();
  const [cepLoading, setCepLoading] = useState(false);

  const handleRegister = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      setErrors({});

      setLoading(true);
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome completo obrigatório'),
          email: Yup.string().email('E-mail inválido').required('E-mail obrigatório'),
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
          document,
        } = values;

        const body = {
          name,
          cellphone: cellphone,
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
          document,
        };

        await api.post('/voter', body);

        toast({
          title: 'Eleitor cadastrado com sucesso',
          description: 'Você cadastrou um eleitor.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
        return navigate('/demanda');
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          setErrors(getValidationErrors(err));

          return;
        }
        if (err.response) {
          return toast({
            title:
              err.response.data.message ||
              'Ocorreu um erro ao cadastrar o eleitor, cheque as credenciais',

            status: 'error',
            position: 'top-right',
            duration: 3000,
            isClosable: true,
          });
        }
        return toast({
          title: 'Ocorreu um erro ao cadastrar o eleitor, cheque as credenciais',

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
      const response = await axios.get(`https://viacep.com.br/ws/${values?.zip}/json/`);

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

  return (
    <HeaderSideBar backRoute={true}>
      <Text color="gray.500" fontWeight="semibold" fontSize="20px">
        Cadastrar Eleitor
      </Text>
      <Flex alignItems="center" justifyContent="center" as="form">
        <Stack spacing={[5, 8]} mt={['24px', '40px']} w="852px">
          <Flex flexDir={'column'}>
            <Text color={verify ? 'gray.300' : 'gray.500'} fontWeight="400" margin="0">
              Telefone*:
            </Text>
            <Flex>
              <PatternFormat
                customInput={Input}
                name="ddd"
                type="text"
                error={errors?.ddd}
                value={cellphone ? cellphone.slice(0, 2) : values?.dddMask}
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
                value={cellphone ? cellphone.slice(2) : values?.cellphoneMask}
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
          </Flex>

          <Input
            labelColor={!verify ? 'gray.300' : 'gray.500'}
            label="Nome*:"
            placeholder="Nome completo"
            name="name"
            type="text"
            error={errors?.name}
            value={values.name}
            onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
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
            onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
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
                onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
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
              <PatternFormat
                customInput={Input}
                type="text"
                label="CPF:"
                format="###.###.###-##"
                mask="_"
                name="document"
                error={errors?.document}
                value={values?.documentMask}
                onValueChange={(value) => {
                  setValues({
                    ...values,
                    document: value?.value,
                    documentMask: value?.formattedValue,
                  });
                }}
                borderColor="gray.500"
                disabled={!verify}
                labelColor={!verify ? 'gray.300' : 'gray.500'}
                placeholder="CPF"
              />

              <Box w="100%">
                <Text color={!verify ? 'gray.300' : 'gray.500'} fontWeight="400" margin="0">
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
                  onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                >
                  <option value="MALE">Masculino</option>
                  <option value="FEMALE">Feminino</option>
                </Select>
              </Box>
            </Flex>
          </Box>
          <Box>
            <Flex>
              <Text color={!verify ? 'gray.300' : 'gray.500'} fontWeight="400" margin="0">
                Endereço:
              </Text>
              {cepLoading && <Spinner color={office?.primary_color} size="sm" />}
            </Flex>
            <Flex
              mb="24px"
              justifyContent={['flex-start', 'space-between']}
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
                onBlur={getCep}
                w={['100%', '200px']}
                placeholder="CEP"
              />

              <Input
                placeholder="Rua"
                name="street"
                type="text"
                error={errors?.street}
                value={values.street}
                onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                borderColor="gray.500"
                flex={1}
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
                placeholder="Bairro"
                name="neighborhood"
                type="text"
                error={errors?.neighborhood}
                value={values.neighborhood}
                onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                borderColor="gray.500"
                flex={1}
                disabled={!verify}
              />
              <Input
                name="address_number"
                type="number"
                error={errors?.address_number}
                value={values.address_number}
                onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
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
                onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                borderColor="gray.500"
                disabled={!verify}
              />
              <Input
                placeholder="Cidade"
                name="city"
                type="text"
                error={errors?.city}
                value={values.city}
                onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                borderColor="gray.500"
                disabled={!verify}
              />
              <Input
                placeholder="UF"
                name="state"
                type="text"
                error={errors?.state}
                value={values.state}
                onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                borderColor="gray.500"
                disabled={!verify}
              />
            </Flex>
          </Box>

          <Flex w="100%" alignItems="center" justifyContent="center" mt={['40px', '95px']}>
            <Button onClick={handleRegister} width="280px" isDisabled={!verify}>
              {loading ? <Spinner color="white" /> : 'Cadastrar'}
            </Button>
          </Flex>
        </Stack>
      </Flex>
    </HeaderSideBar>
  );
}
