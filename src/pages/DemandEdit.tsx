import {
  Avatar,
  Box,
  Flex,
  HStack,
  Select,
  Spinner,
  Stack,
  Switch,
  Text,
  useToast,
  Icon,
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
import { PatternFormat } from 'react-number-format';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import Button from '../components/Form/Button';
import Input from '../components/Form/Input';
import HeaderSideBar from '../components/HeaderSideBar';
import { useAuth } from '../contexts/AuthContext';
import { PermissionByIdDTO, StateProps, UserDTO } from '../dtos';
import api from '../services/api';
import { getFormatDate } from '../utils/date';
import getValidationErrors from '../utils/validationError';
import { FiUpload, FiDownload } from 'react-icons/fi';

export type SelectProps = {
  label: string;
  value: string;
};

export default function DemandEdit() {
  const { id } = useParams();
  const [values, setValues] = useState({} as StateProps);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [demandLoading, setDemandLoading] = useState(false);
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [verify, setVerify] = useState(true);
  const { role, office } = useAuth();
  const toast = useToast();
  const [image, setImage] = useState({} as File);
  const [responsibles, setResponsibles] = useState([] as SelectProps[]);
  const [responsible, setResponsible] = useState('');
  const [voterData, setVoterData] = useState({} as UserDTO);
  const [description, setDescription] = useState('');
  const [resource, setResource] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentUrl, setAttachmentUrl] = useState<string>('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleResource = () => {
    setResource(!resource);
  };

  const handleUpdateDemanda = async (e: FormEvent) => {
    e.preventDefault();

    setErrors({});

    setLoading(true);
    try {
      const body = {
        title: values?.title,
        taskId: id,
        description: description,
        date: values?.date,
        deadline: addHours(new Date(values?.deadline), 12),
        priority: values?.priority,
        voter_id: voterData?.id,
        office_id: office?.id,
        resource: resource,
        responsible_id: responsible,
      };

      await api.put('/task', body);

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

  const getDemandaById = async () => {
    setDemandLoading(true);
    try {
      const response = await api.get(`/task/${id}`);

      setValues({
        cellphoneMask: response?.data?.voter?.cellphone,
        title: response?.data?.title,
        description: response?.data?.description,
        date: getFormatDate(new Date(response?.data?.date), 'yyyy-MM-dd'),
        deadline:
          response?.data?.deadline &&
          getFormatDate(new Date(response?.data?.deadline), 'yyyy-MM-dd'),
        priority: response?.data?.priority,
      });
      setResource(response?.data?.resource);
      setDescription(response?.data?.description);
      setResponsible(response?.data?.responsible_id);
      setVoterData(response?.data?.voter);
      setAttachmentUrl(response?.data?.attachment || '');
    } catch (err) {
    } finally {
      setDemandLoading(false);
    }
  };

  const getPermissions = async () => {
    setResponsibles([] as SelectProps[]);

    setDemandLoading(true);
    try {
      const response = await api.get(
        `/permission/office/${role?.office_id}/responsible`
      );

      setResponsibles(
        response.data.map((responsible: PermissionByIdDTO) => ({
          value: responsible?.user?.id,
          label: responsible?.user?.name,
        }))
      );
    } catch (err) {
    } finally {
      setDemandLoading(false);
    }
  };

  useEffect(() => {
    getPermissions();
    getDemandaById();
  }, []);

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

  const handleUploadAttachment = async () => {
    if (!attachment) return;

    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('attachment', attachment);
      formData.append('taskId', id as string);

      await api.post('/task/attachment', formData);

      toast({
        title: 'Arquivo anexado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });

      // Refresh attachment data
      getDemandaById();
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

  return (
    <HeaderSideBar>
      <Text
        color="gray.500"
        fontWeight="semibold"
        fontSize="20px"
        ml={[0, '28px']}
      >
        Editar Demanda
        {demandLoading && <Spinner color={office?.primary_color} />}
      </Text>

      <Flex alignItems="center" justifyContent="center" as="form">
        <Stack spacing={['16px', '30px']} mt={['24px', '40px']} w="852px">
          <Box>
            <Flex
              display={'flex'}
              alignItems={errors?.cellphone ? 'flex-start' : 'center'}
              gap={['20px', '30px']}
              w="100%"
            >
              <PatternFormat
                name="cellphone"
                customInput={Input}
                error={errors?.cellphone}
                value={values?.cellphoneMask}
                onValueChange={(value) =>
                  setValues({
                    ...values,
                    cellphone: value?.value,
                    cellphoneMask: value?.formattedValue,
                  })
                }
                type="tel"
                format="(##) #####-####"
                borderColor="gray.500"
                isDisabled={verify || demandLoading}
                mask="_"
              />
            </Flex>
            <Flex
              mt="8px"
              borderWidth={'1px'}
              borderColor="gray.300"
              px={'20px'}
              py={'8px'}
              alignItems="center"
              gap="16px"
              borderRadius="4px"
              cursor="pointer"
            >
              <Avatar boxSize="10" src={voterData?.avatar_url} />
              <Box>
                <Text color="gray.400">{voterData?.name}</Text>
                <Text color="gray.400">{voterData?.cellphone}</Text>
              </Box>
            </Flex>
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
              disabled={demandLoading}
            />

            <Editor
              style={{
                minHeight: '120px',
                maxHeight: '120px',
                overflow: 'auto',
              }}
              headerTemplate={header}
              value={description}
              onTextChange={(e: any) => setDescription(e.htmlValue)}
              showHeader={true}
              readOnly={demandLoading}
            />
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
            disabled={demandLoading}
          >
            {responsibles.map((responsible) => {
              return (
                <option value={responsible?.value} key={responsible?.value}>
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
              disabled={demandLoading}
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
              disabled={demandLoading}
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
              isDisabled
            />
          </Flex>
          <Flex gap="24px">
            <Text color={'gray.500'}>Recurso:</Text>
            <HStack>
              <Text color={'gray.500'}>Não</Text>
              <Switch
                name="resource"
                isChecked={resource}
                onChange={handleResource}
                disabled={demandLoading}
              />
              <Text color={'gray.500'}>Sim</Text>
            </HStack>
          </Flex>
          <Flex
            w="100%"
            alignItems="center"
            justifyContent="center"
            mt={['40px', '95px']}
          >
            <Button
              onClick={handleUpdateDemanda}
              width="280px"
              isDisabled={demandLoading}
            >
              {loading ? <Spinner color="white" /> : 'Atualizar'}
            </Button>
          </Flex>
          <Box mt={8}>
            <Text color="gray.500" fontWeight="semibold" mb={4}>
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
              >
                <Text color="gray.600" noOfLines={1}>
                  Anexo atual
                </Text>
                <Button
                  onClick={() => window.open(attachmentUrl, '_blank')}
                  size="sm"
                  leftIcon={<Icon as={FiDownload} />}
                  colorScheme="blue"
                >
                  Baixar
                </Button>
              </Flex>
            )}

            <Flex
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload')?.click()}
              p={6}
              borderWidth={2}
              borderRadius="md"
              borderStyle="dashed"
              borderColor={dragActive ? 'blue.400' : 'gray.300'}
              bg={dragActive ? 'blue.50' : 'transparent'}
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                borderColor: 'blue.400',
                bg: 'blue.50',
              }}
            >
              <input
                type="file"
                id="file-upload"
                onChange={handleChange}
                style={{ display: 'none' }}
              />
              <Icon as={FiUpload} boxSize={6} color="gray.400" mb={2} />
              <Text color="gray.500" textAlign="center">
                {dragActive
                  ? 'Solte o arquivo aqui'
                  : 'Arraste e solte um arquivo aqui, ou clique para selecionar'}
              </Text>
              {attachment && (
                <Text color="blue.500" mt={2} fontWeight="medium">
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
        </Stack>
      </Flex>
    </HeaderSideBar>
  );
}
