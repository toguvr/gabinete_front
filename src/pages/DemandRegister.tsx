import {
  Box,
  Flex,
  HStack,
  Icon,
  Spinner,
  Stack,
  Text,
  useToast,
  Avatar,
  Textarea,
  Switch,
  Select,
  Button as ChakraButton,
  Link,
} from '@chakra-ui/react';
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { IoCheckmarkCircle, IoSearchSharp } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Form/Button';
import Input from '../components/Form/Input';
import HeaderSideBar from '../components/HeaderSideBar';
import { useAuth } from '../contexts/AuthContext';
import { PermissionByIdDTO, StateProps, UserDTO } from '../dtos';
import api from '../services/api';
import * as Yup from 'yup';
import { PatternFormat } from 'react-number-format';
import getValidationErrors from '../utils/validationError';
import { Editor } from 'primereact/editor';
import '../styles/editor.css';
import { addHours } from 'date-fns';
import { CheckIcon } from '@chakra-ui/icons';
import { getFormatDate } from '../utils/date';

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
  const { id } = useParams();

  const handleResource = () => {
    setResource(!resource);
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

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
        deadline: addHours(new Date(values?.deadline), 12),
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
            'Ocorreu um erro ao cadastrar a demanda, cheque as credenciais',

          status: 'error',
          position: 'top-right',
          duration: 3000,
          isClosable: true,
        });
      }
      return toast({
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
          cellphone: 'Telefone do eleitor obrigatório.',
        });
        return;
      }

      if (values?.cellphone?.length < 10) {
        setErrors({
          cellphone: 'Telefone do eleitor deve ter mais de 10 caracteres.',
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

  return (
    <HeaderSideBar>
      <Text
        color="gray.500"
        fontWeight="semibold"
        fontSize="20px"
        ml={[0, '28px']}
      >
        Cadastrar Demanda
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
                gap="40px"
                borderRadius="4px"
                cursor="pointer"
              >
                <Text color="gray.400">Eleitor não encontrado</Text>
                {role?.eleitor_page > 1 && (
                  <ChakraButton
                    as="a"
                    w="220px"
                    h="30px"
                    href={`${process.env.REACT_APP_WEB}/demanda/registrar-eleitor/${values?.cellphone}`}
                    target="_blank"
                    bg={office?.primary_color}
                    color={office?.secondary_color}
                    _hover={{ bg: office?.primary_color }}
                  >
                    Cadastrar eleitor
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
          {/* <FormLabel htmlFor="document" m="0" cursor="pointer">
            <Flex
              p="12px"
              borderRadius="md"
              alignItems="center"
              borderWidth="1px"
              borderColor="gray.500"
              justifyContent="space-between"
            >
              <Flex gap="20px">
                <Flex
                  userSelect="none"
                  w="200px"
                  alignItems="center"
                  justifyContent="center"
                  color="gray.500"
                  bgColor="transparent"
                  borderWidth="1px"
                  borderColor="gray.100"
                  borderRadius="6px"
                  fontFamily="Roboto"
                  fontStyle="normal"
                  fontSize="16px"
                  lineHeight="24px"
                  boxShadow="2px 2px 2px 2px rgba(58, 59, 59, 0.1)"
                  _hover={{ bg: "gray.50" }}
                  _active={{
                    bg: "gray.50",
                  }}
                  _focus={{
                    boxShadow: "0 0 0 3px rgba(60, 62, 63, 0.6)",
                  }}
                >
                  {loading ? <Spinner /> : "Escolher arquivo"}
                </Flex>
                <Text fontSize={"14px"} color="gray.500">
                  {image?.name ? image?.name : "Nenhum arquivo selecionado"}
                </Text>
              </Flex>
              <Icon
                as={IoCloudUpload}
                boxSize="24px"
                color="gray.500"
                _hover={{ color: "gray.600" }}
                _active={{
                  color: "green.700",
                }}
              />
              <Input
                name="document"
                onChange={postDocument}
                display="none"
                type="file"
                accept="application/pdf"
                id="document"
              />
            </Flex>
          </FormLabel> */}
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
