import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button as ChakraButton,
  Flex,
  Icon,
  IconButton,
  Select,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router';
import * as Yup from 'yup';
import Button from '../components/Form/Button';
import Input from '../components/Form/Input';
import HeaderSideBar from '../components/HeaderSideBar';
import { useAuth } from '../contexts/AuthContext';
import { StateProps } from '../dtos';
import api from '../services/api';
import { roleStatus, roleStatusTasks } from '../utils/roleStatus';
import getValidationErrors from '../utils/validationError';

type RegisterFormData = {
  id: string;
  name: string;
  office_id: string;
  home_page: string;
  cargo_page: string;
  equipe_page: string;
  eleitor_page: string;
  demandas_page: string;
  tarefas_page: string;
  mensageria_page: string;
};

export default function RoleEdit() {
  const { id } = useParams();
  const [values, setValues] = useState<RegisterFormData>(
    {} as RegisterFormData
  );
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [loading, setLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);
  const [proceedDialog, setProceedDialog] = useState(false);
  const toast = useToast();

  const { office, updateRole, role, isAuthenticated } = useAuth();

  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogText, setDialogText] = useState('');

  const getPermissionById = async () => {
    setRoleLoading(true);
    try {
      const response = await api.get(`/role/${role?.id}`);
      updateRole(response.data);
    } catch (err) {
    } finally {
      setRoleLoading(false);
    }
  };

  const openDialog = (dialogType: string) => {
    switch (dialogType) {
      case 'home_page':
        setDialogTitle('Home');
        setDialogText(
          "Para que o usuário não tenha acesso a home, utilize o 'Desativado', para ter acesso apenas a leitura, utilizar 'Leitor' e para ele ter acesso a edição, utilizar 'Editor.'"
        );
        onOpen();
        break;
      case 'cargo_page':
        setDialogTitle('Cargo');
        setDialogText(
          "Para que o usuário não tenha acesso aos cargos, utilize o 'Desativado', para ter acesso apenas a leitura, utilizar 'Leitor' e para ele ter acesso a edição, utilizar 'Editor.'"
        );
        onOpen();
        break;
      case 'equipe_page':
        setDialogTitle('Equipe');
        setDialogText(
          "Para que o usuário não tenha acesso as equipes, utilize o 'Desativado', para ter acesso apenas a leitura, utilizar 'Leitor' e para ele ter acesso a edição, utilizar 'Editor.'"
        );
        onOpen();
        break;
      case 'eleitor_page':
        setDialogTitle('Apoiador');
        setDialogText(
          "Para que o usuário não tenha acesso aos apoiadores, utilize o 'Desativado', para ter acesso apenas a leitura, utilizar 'Leitor' e para ele ter acesso a edição, utilizar 'Editor.'"
        );
        onOpen();
        break;
      case 'demandas_page':
        setDialogTitle('Demanda');
        setDialogText(
          "Para que o usuário não tenha acesso as demandas, utilize o 'Desativado', para ter acesso apenas a leitura, utilizar 'Leitor' e para ele ter acesso a edição, utilizar 'Editor.'"
        );
        onOpen();
        break;
      case 'tarefas_page':
        setDialogTitle('Tarefa');
        setDialogText(
          "Para que o usuário não tenha acesso as tarefas, utilize o 'Desativado', para ter acesso apenas a leitura, utilizar 'Leitor' e para ele ter acesso a edição, utilizar 'Editor.'"
        );
        onOpen();
        break;
      case 'mensageria_page':
        setDialogTitle('Mensageria');
        setDialogText(
          "Para que o usuário não tenha acesso a mensageria, utilize o 'Desativado', para ter acesso apenas a leitura, utilizar 'Leitor' e para ele ter acesso a edição, utilizar 'Editor.'"
        );
        onOpen();
        break;
      default:
        break;
    }
  };

  const pagesData = [
    {
      name: 'Home',
      fix: 'home_page',
      values: values?.home_page,
    },
    {
      name: 'Cargo',
      fix: 'cargo_page',
      values: values?.cargo_page,
    },
    {
      name: 'Equipe',
      fix: 'equipe_page',
      values: values?.equipe_page,
    },
    {
      name: 'Apoiador',
      fix: 'eleitor_page',
      values: values?.eleitor_page,
    },
    {
      name: 'Demanda',
      fix: 'demandas_page',
      values: values?.demandas_page,
    },
    {
      name: 'Tarefa',
      fix: 'tarefas_page',
      values: values?.tarefas_page,
    },
    {
      name: 'Mensageria',
      fix: 'mensageria_page',
      values: values?.mensageria_page,
    },
  ];

  function handleUpdateButton() {
    if (values?.id === role.id) {
      setProceedDialog(true);
    } else {
      return handleUpdateRole();
    }
    return;
  }

  async function handleUpdateRole() {
    setErrors({});

    setLoading(true);
    try {
      const body = {
        name: values?.name,
        office_id: office?.id,
        home_page: Number(values?.home_page),
        cargo_page: Number(values?.cargo_page),
        equipe_page: Number(values?.equipe_page),
        eleitor_page: Number(values?.eleitor_page),
        demandas_page: Number(values?.demandas_page),
        tarefas_page: Number(values?.tarefas_page),
        mensageria_page: Number(values?.mensageria_page),
        roleId: id,
      };

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome do cargo obrigatório'),
      });

      await schema.validate(values, {
        abortEarly: false,
      });

      await api.put('/role', body);

      if (isAuthenticated && values?.id === role.id) {
        getPermissionById();
      }

      toast({
        title: 'Cargo atualizado com sucesso',
        description: 'Você atualizou o cargo.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      navigate('/cargo');
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));

        return;
      }
      return toast({
        title:
          err.response.data.message ||
          'Ocorreu um erro ao atualizar o cargo, cheque as credenciais',

        status: 'error',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  const getRoleById = async () => {
    setRoleLoading(true);
    try {
      const response = await api.get(`/role/${id}`);
      setValues({
        ...values,
        id: response?.data?.id,
        name: response?.data?.name,
        home_page: response?.data?.home_page,
        cargo_page: response?.data?.cargo_page,
        equipe_page: response?.data?.equipe_page,
        eleitor_page: response?.data?.eleitor_page,
        demandas_page: response?.data?.demandas_page,
        tarefas_page: response?.data?.tarefas_page,
        mensageria_page: response?.data?.mensageria_page,
      });
    } catch (err) {
    } finally {
      setRoleLoading(false);
    }
  };

  useEffect(() => {
    getRoleById();
  }, []);

  return (
    <HeaderSideBar backRoute={true}>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent mx="12px">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {dialogTitle}
            </AlertDialogHeader>

            <AlertDialogBody>{dialogText}</AlertDialogBody>

            <AlertDialogFooter>
              <ChakraButton onClick={onClose}>Ok</ChakraButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={proceedDialog}
        onClose={onClose}
        isCentered
      >
        <AlertDialogContent mx="12px">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Alerta
          </AlertDialogHeader>

          <AlertDialogBody>
            Você está prestes a atualizar a sua própria permissão. Deseja
            continuar?
          </AlertDialogBody>

          <AlertDialogFooter>
            <ChakraButton onClick={() => setProceedDialog(false)}>
              Cancelar
            </ChakraButton>
            <ChakraButton
              marginLeft="24px"
              colorScheme={'red'}
              onClick={handleUpdateRole}
            >
              Continuar
            </ChakraButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Text color="gray.500" fontWeight="semibold" fontSize="20px">
        Editar Cargo
        {roleLoading && <Spinner color={office?.primary_color} />}
      </Text>
      <Flex alignItems="center" justifyContent="center" as="form">
        <Stack spacing={[5, 10]} mt={['24px', '40px']} w="852px">
          <Input
            labelColor="gray.500"
            label="Nome*:"
            placeholder="Nome do cargo"
            name="name"
            type="text"
            error={errors?.name}
            value={values?.name}
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            borderColor="gray.500"
            disabled={roleLoading}
          />
          <Box
            w="100%"
            borderWidth="1px"
            borderColor="gray.200"
            px="24px"
            py="20px"
            borderRadius="8px"
          >
            {pagesData.map((page) => {
              return (
                <Flex alignItems="center" gap={['8px', '20px']} key={page.fix}>
                  <Box minW={['84px', '108px']}>
                    <Text>{page.name}</Text>
                  </Box>
                  <Select
                    borderColor="gray.500"
                    bg="gray.50"
                    _placeholder={{ color: 'gray.500' }}
                    color="gray.600"
                    h="30px"
                    name={page.fix}
                    value={page.values}
                    onChange={(e) =>
                      setValues({ ...values, [e.target.name]: e.target.value })
                    }
                    disabled={roleLoading}
                  >
                    {page.name === 'Tarefa'
                      ? roleStatusTasks.map((role) => {
                          return (
                            <option key={role?.key} value={role?.key}>
                              {role?.value}
                            </option>
                          );
                        })
                      : roleStatus.map((role) => {
                          return (
                            <option key={role?.key} value={role?.key}>
                              {role?.value}
                            </option>
                          );
                        })}
                  </Select>
                  <IconButton
                    onClick={() => openDialog(page.fix)}
                    aria-label="Open navigation"
                    variant="unstyled"
                    display="flex"
                    justifyContent="center"
                    icon={
                      <Icon
                        cursor="pointer"
                        fontSize="24"
                        as={IoInformationCircleOutline}
                        color="gray.500"
                      />
                    }
                  />
                </Flex>
              );
            })}
          </Box>

          <Flex
            w="100%"
            alignItems="center"
            justifyContent="center"
            mt={['40px', '95px']}
          >
            <Button
              onClick={handleUpdateButton}
              width="280px"
              isDisabled={roleLoading}
            >
              {loading ? <Spinner color="white" /> : 'Atualizar'}
            </Button>
          </Flex>
        </Stack>
      </Flex>
    </HeaderSideBar>
  );
}
