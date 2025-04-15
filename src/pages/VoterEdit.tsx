import {
  Box,
  Flex,
  Select,
  Spinner,
  Stack,
  Text,
  useToast,
  Icon,
} from '@chakra-ui/react';
import axios from 'axios';
import { FormEvent, useEffect, useState } from 'react';
import { PatternFormat } from 'react-number-format';
import { useNavigate, useParams } from 'react-router';
import * as Yup from 'yup';
import Button from '../components/Form/Button';
import Input from '../components/Form/Input';
import HeaderSideBar from '../components/HeaderSideBar';
import { useAuth } from '../contexts/AuthContext';
import { StateProps } from '../dtos';
import api from '../services/api';
import { getFormatDate } from '../utils/date';
import getValidationErrors from '../utils/validationError';
import { FiUpload, FiDownload } from 'react-icons/fi';

export default function VoterEdit() {
  const { id } = useParams();
  const [values, setValues] = useState({} as StateProps);
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [loading, setLoading] = useState(false);
  const [voterLoading, setVoterLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const toast = useToast();
  const { office } = useAuth();
  const navigate = useNavigate();
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentUrl, setAttachmentUrl] = useState<string>('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleUpdateVoter = async (e: FormEvent) => {
    e.preventDefault();

    setErrors({});

    setLoading(true);
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        ddd: Yup.string().required('ddd obrigatório'),
        cellphone: Yup.string().required('Telefone obrigatório'),
      });

      await schema.validate(values, {
        abortEarly: false,
      });

      const {
        name,
        email,
        address_number,
        birthdate,
        city,
        gender,
        neighborhood,
        complement,
        reference,
        state,
        street,
        zip,
        ddd,
        cellphone,
      } = values;

      // Handle the case where we're updating with an attachment
      if (attachment) {
        const formData = new FormData();
        formData.append('attachment', attachment);
        formData.append('name', name);
        formData.append('cellphone', `${ddd ?? ''}${cellphone ?? ''}`);
        if (email) formData.append('email', email);
        formData.append('office_id', office?.id || '');
        if (address_number)
          formData.append('address_number', address_number.toString());
        if (birthdate) formData.append('birthdate', birthdate);
        if (city) formData.append('city', city);
        if (gender) formData.append('gender', gender);
        if (neighborhood) formData.append('neighborhood', neighborhood);
        if (reference) formData.append('reference', reference);
        if (complement) formData.append('complement', complement);
        if (state) formData.append('state', state);
        if (street) formData.append('street', street);
        if (zip) formData.append('zip', zip);
        formData.append('voter_id', id as string);

        await api.put('/voter/attachment', formData);
      } else {
        const body = {
          name,
          cellphone: `${ddd ?? ''}${cellphone ?? ''}`,
          email,
          office_id: office?.id,
          address_number,
          birthdate,
          city,
          gender,
          neighborhood,
          reference,
          complement,
          state,
          street,
          zip,
          voter_id: id,
        };
        await api.put('/voter', body);
      }

      toast({
        title: 'Apoiador atualizado com sucesso',
        description: 'Você atualizou o apoiador.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return navigate('/eleitor');
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));

        return;
      }
      if (err.response) {
        return toast({
          title:
            err.response.data.message ||
            'Ocorreu um erro ao atualizar o apoiador, cheque as credenciais',

          status: 'error',
          position: 'top-right',
          duration: 3000,
          isClosable: true,
        });
      }
      return toast({
        title: 'Ocorreu um erro ao atualizar o apoiador, cheque as credenciais',

        status: 'error',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getCep = async () => {
    setCepLoading(true);
    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${values?.zip}/json/`
      );

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

  const getVoterById = async () => {
    setVoterLoading(true);
    try {
      const response = await api.get(`/voter/${id}`);

      setValues({
        dddMask: response?.data?.cellphone.slice(0, 2),
        ddd: response?.data?.cellphone.slice(0, 2),
        cellphoneMask: response?.data?.cellphone.slice(2),
        cellphone: response?.data?.cellphone.slice(2),
        name: response?.data?.name,
        email: response?.data?.email,
        office_id: office.id,
        address_number: response?.data?.address_number,
        birthdate: getFormatDate(
          new Date(response?.data?.birthdate),
          'yyyy-MM-dd'
        ),
        city: response?.data?.city,
        reference: response?.data?.reference,
        gender: response?.data?.gender,
        neighborhood: response?.data?.neighborhood,
        complement: response?.data?.complement,
        state: response?.data?.state,
        street: response?.data?.street,
        zipMask: response?.data?.zip,
        voter_id: response?.data?.id,
      });
      setAttachmentUrl(response?.data?.attachment_url || '');
    } catch (err) {
    } finally {
      setVoterLoading(false);
    }
  };

  const handleUploadAttachment = async () => {
    if (!attachment) return;

    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('attachment', attachment);
      formData.append('voterId', id as string);

      await api.put('/voter/attachment/update', formData);

      toast({
        title: 'Arquivo anexado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });

      // Refresh attachment data
      getVoterById();
      setAttachment(null);
    } catch (error) {
      toast({
        title: 'Erro ao anexar arquivo',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setAttachment(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  useEffect(() => {
    getVoterById();
  }, []);

  return (
    <HeaderSideBar backRoute={true}>
      <Flex direction="column" h="100%" overflow="hidden">
        <Text color="gray.500" fontWeight="semibold" fontSize="20px" mb={2}>
          Editar Apoiador
          {voterLoading && <Spinner color={office?.primary_color} ml={2} />}
        </Text>
        <Flex
          overflowY="auto"
          alignItems="flex-start"
          justifyContent="center"
          as="form"
          flex="1"
          w="100%"
          px={4}
        >
          <Stack
            spacing={[5, 8]}
            mt={['24px', '40px']}
            w="852px"
            maxW="100%"
            pb={8}
          >
            <Flex flexDir={'column'}>
              <Text color="gray.500" fontWeight="400" margin="0">
                Telefone*:
              </Text>
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
                  format="##"
                  mask="_"
                  disabled={voterLoading}
                />

                <PatternFormat
                  customInput={Input}
                  format="#####-####"
                  mask="_"
                  name="cellphone"
                  type="tel"
                  error={errors?.cellphone}
                  value={values?.cellphoneMask}
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
                  disabled={voterLoading}
                />
              </Flex>
            </Flex>

            <Input
              label="Nome*:"
              placeholder="Nome completo"
              name="name"
              type="text"
              error={errors?.name}
              value={values?.name}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              borderColor="gray.500"
              disabled={voterLoading}
            />
            <Input
              label="Referência:"
              placeholder="Referência do apoiador"
              name="reference"
              type="text"
              error={errors?.reference}
              value={values.reference}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              borderColor="gray.500"
              disabled={voterLoading}
            />

            <Input
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
              disabled={voterLoading}
            />
            <Box>
              <Flex
                justifyContent={['flex-start', 'space-between']}
                alignItems={['flex-start', 'flex-end']}
                flexDirection={['column', 'row']}
                gap={[5, '48px']}
              >
                <Input
                  label="Data de nascimento:"
                  name="birthdate"
                  type="date"
                  error={errors?.birthdate}
                  value={values?.birthdate}
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
                  disabled={voterLoading}
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
                    disabled={voterLoading}
                  >
                    <option value="MALE">Masculino</option>
                    <option value="FEMALE">Feminino</option>
                  </Select>
                </Box>
              </Flex>
            </Box>
            <Box>
              <Flex>
                <Text color="gray.500" fontWeight="400" margin="0">
                  Endereço:
                </Text>
                {cepLoading && (
                  <Spinner color={office?.primary_color} size="sm" />
                )}
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
                  onBlur={getCep}
                  w={['100%', '200px']}
                  placeholder="CEP"
                  disabled={voterLoading}
                />

                <Input
                  placeholder="Rua"
                  name="street"
                  type="text"
                  error={errors?.street}
                  value={values?.street}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                  borderColor="gray.500"
                  flex={1}
                  disabled={voterLoading}
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
                  value={values?.neighborhood}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                  borderColor="gray.500"
                  flex={1}
                  disabled={voterLoading}
                />
                <Input
                  name="address_number"
                  type="number"
                  error={errors?.address_number}
                  value={values?.address_number}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                  placeholder="Numero"
                  w={['100%', '200px']}
                  borderColor="gray.500"
                  disabled={voterLoading}
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
                  value={values?.complement}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                  borderColor="gray.500"
                  disabled={voterLoading}
                />
                <Input
                  placeholder="Cidade"
                  name="city"
                  type="text"
                  error={errors?.city}
                  value={values?.city}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                  borderColor="gray.500"
                  disabled={voterLoading}
                />
                <Input
                  placeholder="UF"
                  name="state"
                  type="text"
                  error={errors?.state}
                  value={values?.state}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                  borderColor="gray.500"
                  disabled={voterLoading}
                />
              </Flex>
            </Box>

            <Box
              mt={8}
              borderWidth={1}
              borderRadius="md"
              p={5}
              borderColor="blue.200"
              bg="blue.50"
            >
              <Text color="gray.700" fontWeight="semibold" mb={4} fontSize="lg">
                Anexos
              </Text>

              {attachmentUrl && (
                <Flex
                  p={4}
                  borderWidth={1}
                  borderRadius="md"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={4}
                  bg="white"
                >
                  <Flex direction="column" flex={1} mr={4}>
                    <Text color="gray.500" fontSize="sm" fontWeight="medium">
                      Anexo:
                    </Text>
                    <Text color="gray.600" noOfLines={1}>
                      {attachmentUrl.split('/').pop()}
                    </Text>
                  </Flex>
                  <Button
                    onClick={() => window.open(attachmentUrl, '_blank')}
                    size="sm"
                    leftIcon={<Icon as={FiDownload} />}
                    colorScheme="blue"
                    variant="outline"
                    minW="min-content"
                    w="fit-content"
                    px={3}
                  >
                    Abrir
                  </Button>
                </Flex>
              )}

              <Flex
                onDragEnter={voterLoading ? undefined : handleDrag}
                onDragLeave={voterLoading ? undefined : handleDrag}
                onDragOver={voterLoading ? undefined : handleDrag}
                onDrop={voterLoading ? undefined : handleDrop}
                onClick={
                  voterLoading
                    ? undefined
                    : () => document.getElementById('file-upload')?.click()
                }
                p={6}
                borderWidth={2}
                borderRadius="md"
                borderStyle="dashed"
                borderColor={
                  voterLoading
                    ? 'gray.200'
                    : dragActive
                    ? 'blue.400'
                    : 'gray.300'
                }
                bg={voterLoading ? 'gray.50' : dragActive ? 'blue.50' : 'white'}
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                cursor={voterLoading ? 'not-allowed' : 'pointer'}
                transition="all 0.2s"
                opacity={voterLoading ? 0.6 : 1}
                _hover={{
                  borderColor: voterLoading ? 'gray.200' : 'blue.400',
                  bg: voterLoading ? 'gray.50' : 'blue.50',
                }}
                minH="120px"
              >
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleChange}
                  style={{ display: 'none' }}
                  disabled={voterLoading}
                />
                <Icon as={FiUpload} boxSize={8} color="blue.500" mb={3} />
                <Text color="gray.600" textAlign="center" fontWeight="medium">
                  {dragActive
                    ? 'Solte o arquivo aqui'
                    : 'Arraste e solte um arquivo aqui, ou clique para selecionar'}
                </Text>
                {attachment && (
                  <Text color="blue.500" mt={3} fontWeight="bold">
                    Arquivo selecionado: {attachment.name}
                  </Text>
                )}
              </Flex>

              {attachment && (
                <Flex justify="center" mt={4}>
                  <Button
                    onClick={handleUploadAttachment}
                    isLoading={uploadLoading}
                    loadingText="Enviando..."
                    colorScheme="blue"
                    width="200px"
                  >
                    Enviar Anexo
                  </Button>
                </Flex>
              )}
            </Box>

            <Flex
              w="100%"
              alignItems="center"
              justifyContent="center"
              mt={['40px', '95px']}
            >
              <Button
                onClick={handleUpdateVoter}
                w="280px"
                isDisabled={voterLoading}
              >
                {loading ? <Spinner color="white" /> : 'Atualizar'}
              </Button>
            </Flex>
          </Stack>
        </Flex>
      </Flex>
    </HeaderSideBar>
  );
}
