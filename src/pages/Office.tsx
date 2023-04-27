import {
  Avatar,
  Box,
  Input as ChakraInput,
  Flex,
  Icon,
  Select,
  Spinner,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { IoCamera } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';
import Button from '../components/Form/Button';
import Input from '../components/Form/Input';
import HeaderSideBar from '../components/HeaderSideBar';
import resize from '../components/Resize';
import { useAuth } from '../contexts/AuthContext';
import { OfficeDTO, StateProps, UserDTO } from '../dtos';
import api from '../services/api';
import getValidationErrors from '../utils/validationError';

export default function Gabinete() {
  const [loading, setLoading] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const { office, updateOffice } = useAuth();
  const toast = useToast();
  const [values, setValues] = useState({
    ...office,
  } as OfficeDTO);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const getStates = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
      );
      const data = await response.json();
      setStates(data.sort((a: any, b: any) => a.nome.localeCompare(b.nome)));
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const getCities = async (state: string) => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`
      );
      console.log('response,'response)
      const data = await response.json();
      setCities(data.sort((a: any, b: any) => a.nome.localeCompare(b.nome)));
      setValues({ ...values, [values?.city]: data[0].nome });
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStates();
    getCities(values?.state);
  }, []);

  const callback = async (image: any) => {
    setLoadingPhoto(true);
    const formData = new FormData();
    formData.append('avatar', image);

    try {
      const response = await api.patch('/office/logo', formData);
      setValues(response.data);
      updateOffice(response.data);

      return toast({
        title: 'Logo atualizada!',
        status: 'success',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Logo não atualizada, tente novamente.',
        status: 'error',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingPhoto(false);
    }
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

  const updateProfile = async () => {
    setLoading(true);

    setErrors({} as StateProps);

    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        city: Yup.string().required('Cidade obrigatória'),
        state: Yup.string().required('Estado obrigatório'),
        owner_position: Yup.string().required('Cargo obrigatório'),
        primary_color: Yup.string().required('Cor primária obrigatória'),
        secondary_color: Yup.string().required('Cor secundária obrigatório'),
      });

      await schema.validate(values, {
        abortEarly: false,
      });

      const body = {
        office_id: office?.id,
        name: values?.name,
        city: values?.city,
        state: values?.state,
        owner_position: values?.owner_position,
        primary_color: values?.primary_color,
        secondary_color: values?.secondary_color,
      };

      const response = await api.put('/office', body);

      updateOffice(response.data);

      toast({
        title: 'Gabinete atualizado',
        status: 'success',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
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
            'Ocorreu um erro ao atualizar os dados, tente novamente',

          status: 'error',
          position: 'top-right',
          duration: 3000,
          isClosable: true,
        });
      }
      return toast({
        title: 'Ocorreu um erro ao atualizar os dados, tente novamente',

        status: 'error',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <HeaderSideBar backRoute={true}>
      <Text
        color="gray.500"
        fontWeight="semibold"
        fontSize="20px"
        ml={[0, '28px']}
      >
        Gabinete
        {loading && <Spinner color={office?.primary_color} ml="4" size="sm" />}
      </Text>
      <Flex
        w="100%"
        alignItems="center"
        justify="center"
        position="relative"
        mt="28px"
      >
        <Flex justifyContent={'center'} position="relative">
          <label htmlFor="avatar">
            <Avatar
              bg="gray.100"
              name={values?.name}
              src={values?.logo_url}
              position="unset"
              size="xl"
              color={office?.primary_color}
            />
            <Flex
              position="absolute"
              justify="center"
              align="center"
              borderRadius="full"
              bg={office?.primary_color}
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
                  as={IoCamera}
                  color={office?.secondary_color}
                  boxSize={5}
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
      </Flex>
      <Flex alignItems="center" justifyContent="center" as="form">
        <Stack spacing={[5, 10]} mt={['24px', '40px']} w="852px">
          <Input
            labelColor="gray.500"
            label="Nome:"
            placeholder="Nome do Gabinete"
            name="name"
            type="text"
            error={errors?.name}
            value={values?.name}
            onChange={(e) => {
              setValues({ ...values, [e.target.name]: e.target.value });
            }}
            borderColor="gray.500"
          />
          <Flex w="100%" gap={['20px', '44px']}>
            <Box w="100%">
              <Text color="gray.500" fontWeight="400" margin="0">
                Estado:
              </Text>
              <Select
                borderColor="gray.500"
                bg="gray.50"
                _placeholder={{ color: 'gray.500' }}
                color="gray.600"
                value={values?.state}
                name="state"
                onChange={(e) => {
                  setValues({ ...values, [e.target.name]: e.target.value });
                  getCities(e.target.value);
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
            {errors.owner_position && (
              <Text mt="2" align="left" fontSize={14} color="red">
                {errors.owner_position}
              </Text>
            )}
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
                setValues({ ...values, [e.target.name]: e.target.value })
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
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              borderColor="gray.500"
              w="100%"
            />
          </Flex>
          <Flex
            gap="20px"
            flexDir={'column'}
            alignItems={'center'}
            justifyContent="center"
          >
            <Button onClick={updateProfile} w="280px">
              Salvar Alterações
            </Button>
          </Flex>
        </Stack>
      </Flex>
    </HeaderSideBar>
  );
}
