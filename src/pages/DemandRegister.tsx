import {
  Avatar,
  Box,
  Button as ChakraButton,
  Flex,
  HStack,
  Icon,
  Select,
  Spinner,
  Stack,
  Switch,
  Text,
  Textarea,
  useToast,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { addHours } from 'date-fns';
import { Editor } from 'primereact/editor';
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { IoCheckmarkCircle, IoSearchSharp } from 'react-icons/io5';
import { PatternFormat } from 'react-number-format';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import Button from '../components/Form/Button';
import Input from '../components/Form/Input';
import HeaderSideBar from '../components/HeaderSideBar';
import { useAuth } from '../contexts/AuthContext';
import { PermissionByIdDTO, StateProps, UserDTO } from '../dtos';
import api from '../services/api';
import '../styles/editor.css';
import { getFormatDate } from '../utils/date';
import getValidationErrors from '../utils/validationError';
import axios from 'axios';
import { FiUpload } from 'react-icons/fi';

export type SelectProps = {
  label: string;
  value: string;
};

export default function DemandRegister() {
  const [values, setValues] = useState({
    date: getFormatDate(new Date(), 'yyyy-MM-dd'),
  } as StateProps);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [verify, setVerify] = useState(false);
  const [notVerify, setNotVerify] = useState(false);
  const { role, office } = useAuth();
  const toast = useToast();
  const auth = useAuth();
  const [image, setImage] = useState({} as File);
  const [responsibles, setResponsibles] = useState([] as SelectProps[]);
  const [responsible, setResponsible] = useState('');
  const [description, setDescription] = useState('');
  const [voterData, setVoterData] = useState({} as UserDTO);
  const [resource, setResource] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { id } = useParams();
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const [cepLoading, setCepLoading] = useState(false);

  const handleResource = () => {
    setResource(!resource);
  };

  const handleRegisterVoter = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      setErrors({});

      setLoading(true);
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome completo obrigatório'),
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
        } = values;

        const body = {
          name,
          cellphone: values.cellphone,
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
        };
        await api.post('/voter', body);

        toast({
          title: 'Apoiador cadastrado com sucesso',
          description: 'Você cadastrou um apoiador.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
        onCloseModal();

        return verifyPermission();
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          setErrors(getValidationErrors(err));

          return;
        }
        if (err.response) {
          return toast({
            title:
              err.response.data.message ||
              'Ocorreu um erro ao cadastrar o apoiador, cheque as credenciais',

            status: 'error',
            position: 'top-right',
            duration: 3000,
            isClosable: true,
          });
        }
        return toast({
          title:
            'Ocorreu um erro ao cadastrar o apoiador, cheque as credenciais',

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

  const handleRegister = async (e: FormEvent | null): Promise<void> => {
    if (e) e.preventDefault();

    if (attachment) {
      handleCreateWithAttachment();
      return;
    }

    setErrors({});

    setLoading(true);
    try {
      const schema = Yup.object().shape({
        title: Yup.string().required('Título obrigatório'),
      });

      await schema.validate(values, {
        abortEarly: false,
      });

      const { title, priority } = values;

      const body = {
        title,
        description: description,
        responsible_id: responsible,
        date: new Date(),
        deadline: values?.deadline
          ? addHours(new Date(values?.deadline), 12)
          : null,
        priority,
        voter_id: voterData?.id,
        office_id: office?.id,
        resource: resource,
      };

      await api.post('/task', body);

      toast({
        title: 'Cadastrado com sucesso',
        description: 'Você cadastrou uma demanda.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });

      navigate('/demanda');
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));
        return;
      }
      if (err.response) {
        toast({
          title:
            err.response.data.message ||
            'Ocorreu um erro ao cadastrar a demanda, cheque as credenciais',
          status: 'error',
          position: 'top-right',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      toast({
        title: 'Ocorreu um erro ao cadastrar a demanda, cheque as credenciais',
        status: 'error',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyPermission = async () => {
    setErrors({});
    setLoading(true);
    setVerify(false);
    setNotVerify(false);
    try {
      if (values?.cellphone?.length === 0 || values?.cellphone === undefined) {
        setErrors({
          cellphone: 'Telefone do apoiador obrigatório.',
        });
        return;
      }

      if (values?.cellphone?.length < 10) {
        setErrors({
          cellphone: 'Telefone do apoiador deve ter mais de 10 caracteres.',
        });
        return;
      }

      const response = await api.get(
        `/voter/fill/check/office/${role?.office_id}/cellphone/${values?.cellphone}`
      );

      if (response.data.isVoterExist === true) {
        setVerify(true);
        setVoterData(response?.data?.voter);
      } else {
        setNotVerify(true);
      }
    } catch (err: any) {
      return toast({
        title: err?.response?.data?.message,
        status: 'warning',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getPermissions = async () => {
    setResponsibles([] as SelectProps[]);

    setLoading(true);
    try {
      const response = await api.get(
        `/permission/office/${role?.office_id}/responsible`
      );

      setResponsibles(
        response.data.map((responsible: PermissionByIdDTO, index: number) => ({
          key: index,
          value: responsible?.user?.id,
          label: responsible?.user?.name,
        }))
      );
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  const handleCreateWithAttachment = async (): Promise<void> => {
    if (!attachment) return handleRegister(null);

    setLoading(true);
    try {
      const schema = Yup.object().shape({
        title: Yup.string().required('Título obrigatório'),
      });

      await schema.validate(values, {
        abortEarly: false,
      });

      const { title, priority } = values;

      const formData = new FormData();
      formData.append('attachment', attachment);
      formData.append('title', title);
      formData.append('description', description || '');
      formData.append('responsible_id', responsible);
      formData.append('date', new Date().toISOString());
      formData.append('priority', priority || 'BAIXA');

      // Fix the TypeScript error by ensuring these values are strings
      if (voterData?.id) {
        formData.append('voter_id', voterData.id);
      }

      formData.append('office_id', office?.id || '');
      formData.append('resource', resource.toString());

      if (values?.deadline) {
        formData.append(
          'deadline',
          addHours(new Date(values.deadline), 12).toISOString()
        );
      }

      await api.post('/task/attachment', formData);

      toast({
        title: 'Cadastrado com sucesso',
        description: 'Você cadastrou uma demanda com anexo.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });

      navigate('/demanda');
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));
        return;
      }
      if (err.response) {
        toast({
          title:
            err.response.data.message ||
            'Ocorreu um erro ao cadastrar a demanda, cheque as credenciais',
          status: 'error',
          position: 'top-right',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      toast({
        title: 'Ocorreu um erro ao cadastrar a demanda, cheque as credenciais',
        status: 'error',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
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

  const postDocument = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files;

      if (file.length === 0) {
        return; // se não selecionar nenhum file
      }

      if (file[0].type !== 'application/pdf') {
        return toast({
          title:
            'Apenas documento em formato de pdf é permitido, tente novamente',
          status: 'error',
          position: 'top-right',
          duration: 3000,
          isClosable: true,
        });
      }
      // const reader = new FileReader();

      // reader.onloadend = () => {
      //   setUserData({ ...userData, file, preview: reader.result });
      // };

      // reader.readAsDataURL(file[0]);

      // funcao de resize
      if (file[0].type === 'application/pdf') {
        setImage(file[0]);
        return;
      }
    }
  }, []);

  const renderHeader = () => {
    return (
      <span className="ql-formats">
        <button className="ql-bold" aria-label="Bold"></button>
        <button className="ql-italic" aria-label="Italic"></button>
        <button className="ql-underline" aria-label="Underline"></button>
        <button
          className="ql-list"
          aria-label="Ordered List"
          value="ordered"
        ></button>
        <button
          className="ql-list"
          aria-label="Unordered List"
          value="bullet"
        ></button>
      </span>
    );
  };

  const header = renderHeader();

  useEffect(() => {
    getPermissions();
  }, []);

  useEffect(() => {
    if (responsibles && id !== undefined) {
      verifyPermission();
    }
  }, [responsibles]);

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

  return (
    <HeaderSideBar>
      <Modal isOpen={isOpenModal} onClose={onCloseModal} size={['2x1', '4xl']}>
        <ModalOverlay />
        <ModalContent px={['8px', '100px']}>
          <ModalHeader
            alignItems="center"
            display="flex"
            justifyContent="center"
          >
            <Text fontSize="20px" color="gray.500" fontWeight="semibold">
              Cadastrar Apoiador
            </Text>
          </ModalHeader>

          <ModalBody>
            <Flex flexDir={'column'}>
              <Text
                color={verify ? 'gray.300' : 'gray.500'}
                fontWeight="400"
                margin="0"
              >
                Telefone*:
              </Text>
              <Flex flexDir={['column', 'row']}>
                <Flex>
                  <PatternFormat
                    customInput={Input}
                    name="ddd"
                    type="text"
                    error={errors?.ddd}
                    value={
                      values?.cellphone ? values?.cellphone.slice(0, 2) : ''
                    }
                    placeholder="DDD"
                    w="72px"
                    mr="8px"
                    borderColor="gray.500"
                    isDisabled
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
                    value={values?.cellphone ? values?.cellphone.slice(2) : ''}
                    placeholder="00000-0000"
                    w={['100%', '180px']}
                    borderColor="gray.500"
                    isDisabled
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
                mt={[2, 5]}
              />
              <Input
                label="Pessoa referência:"
                placeholder="Referência do apoiador"
                name="reference"
                type="text"
                error={errors?.reference}
                value={values.reference}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                borderColor="gray.500"
                mt={[2, 5]}
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
                mt={[2, 5]}
              />
              <Box>
                <Flex
                  justifyContent={['flex-start', 'space-between']}
                  alignItems={['flex-start', 'flex-end']}
                  flexDirection={['column', 'row']}
                  gap={[5, '48px']}
                  mt={[2, 5]}
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
                        setValues({
                          ...values,
                          [e.target.name]: e.target.value,
                        })
                      }
                    >
                      <option value="MALE">Masculino</option>
                      <option value="FEMALE">Feminino</option>
                    </Select>
                  </Box>
                </Flex>
              </Box>
              <Box>
                <Flex mt={[2, 5]}>
                  <Text color={'gray.500'} fontWeight="400" margin="0">
                    Endereço:
                  </Text>
                  {cepLoading && (
                    <Spinner color={office?.primary_color} size="sm" />
                  )}
                </Flex>
                <Flex
                  mb="24px"
                  justifyContent={['flex-start']}
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
                    w={['100%', '200px']}
                    placeholder="CEP"
                  />
                  <Button onClick={getCep} width="280px">
                    {loading ? <Spinner color="white" /> : 'Buscar'}
                  </Button>
                </Flex>

                <Flex
                  mb="24px"
                  justifyContent={['flex-start', 'space-between']}
                  alignItems={['flex-start', 'flex-end']}
                  flexDirection={['column', 'row']}
                  gap={[5, '44px']}
                >
                  <Input
                    placeholder="Rua"
                    name="street"
                    type="text"
                    error={errors?.street}
                    value={values.street}
                    onChange={(e) =>
                      setValues({ ...values, [e.target.name]: e.target.value })
                    }
                    borderColor="gray.500"
                    flex={1}
                  />
                  <Input
                    placeholder="Bairro"
                    name="neighborhood"
                    type="text"
                    error={errors?.neighborhood}
                    value={values.neighborhood}
                    onChange={(e) =>
                      setValues({ ...values, [e.target.name]: e.target.value })
                    }
                    borderColor="gray.500"
                    flex={1}
                  />
                  <Input
                    name="address_number"
                    type="number"
                    error={errors?.address_number}
                    value={values.address_number}
                    onChange={(e) =>
                      setValues({ ...values, [e.target.name]: e.target.value })
                    }
                    placeholder="Numero"
                    w={['100%', '200px']}
                    borderColor="gray.500"
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
                    onChange={(e) =>
                      setValues({ ...values, [e.target.name]: e.target.value })
                    }
                    borderColor="gray.500"
                  />
                  <Input
                    placeholder="Cidade"
                    name="city"
                    type="text"
                    error={errors?.city}
                    value={values.city}
                    onChange={(e) =>
                      setValues({ ...values, [e.target.name]: e.target.value })
                    }
                    borderColor="gray.500"
                  />
                  <Input
                    placeholder="UF"
                    name="state"
                    type="text"
                    error={errors?.state}
                    value={values.state}
                    onChange={(e) =>
                      setValues({ ...values, [e.target.name]: e.target.value })
                    }
                    borderColor="gray.500"
                  />
                </Flex>
              </Box>
            </Flex>
          </ModalBody>

          <ModalFooter w="100%" alignItems="center" justifyContent="center">
            <Button onClick={handleRegisterVoter} width="280px">
              {loading ? <Spinner color="white" /> : 'Cadastrar Apoiador'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Text
        color="gray.500"
        fontWeight="semibold"
        fontSize="20px"
        ml={[0, '28px']}
      >
        Cadastrar Demandas
      </Text>

      <Flex alignItems="center" justifyContent="center" as="form">
        <Stack
          spacing={['16px', '30px']}
          mt={['24px', '40px']}
          w={['100%', '852px']}
        >
          <Box>
            <Flex
              display={'flex'}
              alignItems={errors?.cellphone ? 'flex-start' : 'center'}
              gap={['20px', '30px']}
              w="100%"
            >
              <PatternFormat
                name="cellphone"
                placeholder="Telefone*"
                customInput={Input}
                value={id ? id : values?.cellphoneMask}
                error={errors?.cellphone}
                onValueChange={(value) => {
                  setValues({
                    ...values,
                    cellphone: value?.value,
                    cellphoneMask: value?.formattedValue,
                  });
                }}
                type="tel"
                format="(##) #####-####"
                borderColor="gray.500"
                isDisabled={verify}
                rightIcon={
                  <Icon color="gray.500" fontSize="20px" as={IoSearchSharp} />
                }
                mask="_"
              />

              <Button onClick={verifyPermission} w="200px" isDisabled={verify}>
                {loading ? <Spinner color="white" /> : 'Procurar'}
              </Button>
            </Flex>
            {verify && voterData && (
              <Flex
                mt={'8px'}
                borderWidth={'1px'}
                borderColor="gray.500"
                px={'20px'}
                py={'8px'}
                alignItems="center"
                borderRadius="4px"
                cursor="pointer"
                justifyContent={'space-between'}
              >
                <Flex alignItems="center" gap="16px">
                  <Avatar boxSize="10" src={voterData?.avatar_url} />
                  <Box>
                    <Text color="gray.500">{voterData?.name}</Text>
                    <Text color="gray.500">{voterData?.cellphone}</Text>
                  </Box>
                </Flex>
                <Icon
                  mr="4"
                  color={'green.400'}
                  fontSize="24"
                  _groupHover={{
                    color: office?.secondary_color,
                  }}
                  as={IoCheckmarkCircle}
                />
              </Flex>
            )}
            {notVerify && (
              <Flex
                mt="8px"
                borderWidth={'1px'}
                borderColor="gray.200"
                px={'20px'}
                py={'10px'}
                alignItems="center"
                gap={['12px', '40px']}
                borderRadius="4px"
                cursor="pointer"
              >
                <Text color="gray.400">Apoiador não encontrado</Text>
                {role?.eleitor_page > 1 && (
                  <ChakraButton
                    w="220px"
                    h="30px"
                    bg={office?.primary_color}
                    color={office?.secondary_color}
                    _hover={{ bg: office?.primary_color }}
                    onClick={() => onOpenModal()}
                  >
                    Cadastrar apoiador
                  </ChakraButton>
                )}
              </Flex>
            )}
          </Box>
          <Box>
            <Input
              placeholder="Título*"
              name="title"
              type="text"
              error={errors?.title}
              value={values?.title}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              borderColor="gray.500"
              isDisabled={!verify || notVerify}
            />
            {!verify ? (
              <Textarea
                placeholder="Descrição*"
                name="description"
                borderColor="gray.500"
                mt="8px"
                resize="none"
                isDisabled={!verify || notVerify}
              />
            ) : (
              <Editor
                style={{
                  minHeight: '120px',
                  maxHeight: '120px',
                  overflow: 'auto',
                  borderRadius: '0px 0px 8px 8px',
                }}
                placeholder="Descrição*"
                headerTemplate={header}
                value={description}
                onTextChange={(e: any) => setDescription(e.htmlValue)}
              />
              // <RichTextEditor onChange={() => {}} readOnly={!verify} />
            )}
          </Box>

          <Select
            placeholder="Selecionar responsável*"
            borderColor="gray.500"
            bg="gray.50"
            _placeholder={{ color: 'gray.500' }}
            color="gray.600"
            value={responsible}
            name="responsible"
            onChange={(e) => setResponsible(e.target.value)}
            isDisabled={!verify || notVerify}
          >
            {responsibles.map((responsible, index) => {
              return (
                <option value={responsible?.value} key={index}>
                  {responsible?.label}
                </option>
              );
            })}
          </Select>
          <Flex
            alignItems={['flex-start', 'flex-end']}
            gap={['24px', '36px']}
            flexDir={['column', 'row']}
          >
            <Input
              labelColor="gray.500"
              label="Prazo:"
              name="deadline"
              type="date"
              error={errors?.deadline}
              value={values?.deadline}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              borderColor="gray.500"
              css={{
                '&::-webkit-calendar-picker-indicator': {
                  color: 'gray.500',
                },
              }}
              w="220px"
              isDisabled={!verify || notVerify}
            />
            <Select
              placeholder="Prioridade*"
              borderColor="gray.500"
              bg="gray.50"
              _placeholder={{ color: 'gray.500' }}
              color="gray.600"
              value={values?.priority}
              name="priority"
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              isDisabled={!verify || notVerify}
            >
              <option value="BAIXA">Baixa</option>
              <option value="MEDIA">Media</option>
              <option value="ALTA">Alta</option>
            </Select>
            <Input
              labelColor="gray.500"
              label="Data de criação*:"
              name="date"
              type="date"
              error={errors?.date}
              value={values?.date}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              borderColor="gray.500"
              css={{
                '&::-webkit-calendar-picker-indicator': {
                  color: 'gray.500',
                },
              }}
              w="220px"
              isDisabled={!verify || notVerify}
            />
          </Flex>
          <Box mt={4}>
            <Text color="gray.500" fontWeight="semibold" mb={4}>
              Anexos
            </Text>

            <Flex
              onDragEnter={!verify || notVerify ? undefined : handleDrag}
              onDragLeave={!verify || notVerify ? undefined : handleDrag}
              onDragOver={!verify || notVerify ? undefined : handleDrag}
              onDrop={!verify || notVerify ? undefined : handleDrop}
              onClick={
                !verify || notVerify
                  ? undefined
                  : () => document.getElementById('file-upload')?.click()
              }
              p={6}
              borderWidth={2}
              borderRadius="md"
              borderStyle="dashed"
              borderColor={
                !verify || notVerify
                  ? 'gray.200'
                  : dragActive
                  ? 'blue.400'
                  : 'gray.300'
              }
              bg={
                !verify || notVerify
                  ? 'gray.50'
                  : dragActive
                  ? 'blue.50'
                  : 'transparent'
              }
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              cursor={!verify || notVerify ? 'not-allowed' : 'pointer'}
              transition="all 0.2s"
              opacity={!verify || notVerify ? 0.6 : 1}
              _hover={{
                borderColor: !verify || notVerify ? 'gray.200' : 'blue.400',
                bg: !verify || notVerify ? 'gray.50' : 'blue.50',
              }}
            >
              <input
                type="file"
                id="file-upload"
                onChange={handleChange}
                style={{ display: 'none' }}
                disabled={!verify || notVerify}
              />
              <Icon
                as={FiUpload}
                boxSize={6}
                color={!verify || notVerify ? 'gray.300' : 'gray.400'}
                mb={2}
              />
              <Text
                color={!verify || notVerify ? 'gray.300' : 'gray.500'}
                textAlign="center"
              >
                {dragActive
                  ? 'Solte o arquivo aqui'
                  : 'Arraste e solte um arquivo aqui, ou clique para selecionar'}
              </Text>
              {attachment && (
                <Text
                  color={!verify || notVerify ? 'gray.300' : 'blue.500'}
                  mt={2}
                  fontWeight="medium"
                >
                  Arquivo selecionado: {attachment.name}
                </Text>
              )}
            </Flex>
          </Box>
          <Flex gap="24px">
            <Text color={!verify || notVerify ? 'gray.300' : 'gray.500'}>
              Recurso:
            </Text>
            <HStack>
              <Text color={!verify || notVerify ? 'gray.300' : 'gray.500'}>
                Não
              </Text>
              <Switch
                name="resource"
                isDisabled={!verify || notVerify}
                isChecked={resource}
                onChange={handleResource}
              />
              <Text color={!verify || notVerify ? 'gray.300' : 'gray.500'}>
                Sim
              </Text>
            </HStack>
          </Flex>
          <Flex
            w="100%"
            alignItems="center"
            justifyContent="center"
            mt={['40px', '95px']}
          >
            <Button
              onClick={handleRegister}
              width="280px"
              isDisabled={!verify || notVerify}
            >
              {loading ? <Spinner color="white" /> : 'Enviar demanda'}
            </Button>
          </Flex>
        </Stack>
      </Flex>
    </HeaderSideBar>
  );
}
