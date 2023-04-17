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
} from '@chakra-ui/react';
import { useCallback, useState, ChangeEvent, FormEvent } from 'react';
import { IoAddCircleSharp } from 'react-icons/io5';
import resize from '../components/Resize';
import api from '../services/api';
import Input from '../components/Form/Input';
import { StateProps } from '../dtos';
import * as Yup from 'yup';
import getValidationErrors from '../utils/validationError';
import { useNavigate } from 'react-router-dom';

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
  const [values, setValues] = useState({} as SignUpOfficeProps);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const toast = useToast();
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        formData.append('logo_url', values.logo_url);
        formData.append('name', values.name);
        formData.append('city', values.city);
        formData.append('state', values.state);
        formData.append('owner_position', values.owner_position);
        formData.append('primary_color', values.primary_color);
        formData.append('secondary_color', values.secondary_color);

        await api.post('/office', formData);

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
    [values]
  );

  const callback = async (image: any) => {
    setLoadingPhoto(true);

    try {
      setValues({ ...values, logo_url: image });
      console.log('values.logo_url222', values.logo_url);
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
            <Input
              labelColor="gray.500"
              label="Cidade:"
              placeholder="Cidade do Gabinete"
              name="city"
              type="text"
              error={errors?.city}
              value={values?.city}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              borderColor="gray.500"
            />
            <Input
              labelColor="gray.500"
              label="Estado:"
              placeholder="Estado do Gabinete"
              name="state"
              type="text"
              error={errors?.state}
              value={values?.state}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              borderColor="gray.500"
            />
          </Flex>
          <Input
            color="gray.500"
            label="Cargo:"
            placeholder="Cargo do líder"
            name="owner_position"
            type="text"
            error={errors?.owner_position}
            value={values?.owner_position}
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            borderColor="gray.500"
            w="100%"
            onKeyPress={handleKeyPress}
          />
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
