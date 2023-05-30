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
import { FormEvent, useCallback, useRef, useState } from 'react';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router';
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
  name: string;
  office_id: string;
  home_page: string;
  cargo_page: string;
  equipe_page: string;
  eleitor_page: string;
  demandas_page: string;
  tarefas_page: string;
};

export default function RoleRegister() {
  const [values, setValues] = useState<RegisterFormData>(
    {} as RegisterFormData
  );
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { office } = useAuth();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogText, setDialogText] = useState('');

  const openDialog = (dialogType: string) => {
    switch (dialogType) {
      case 'home_page':
        setDialogTitle('Home');
        setDialogText(
          `Para que o usuário possa editar, excluir e criar, selecione 'Editor'.
          Para que o usuário tenha acesso a leitura da página, selecione 'Leitor'.
          Para que o usuário NÃO tenha acesso a página, selecione 'Desativado'.`
        );
        onOpen();
        break;
      case 'cargo_page':
        setDialogTitle('Cargo');
        setDialogText(
          `Para que o usuário possa editar, excluir e criar, selecione 'Editor'.
          Para que o usuário tenha acesso a leitura da página, selecione 'Leitor'.
          Para que o usuário NÃO tenha acesso a página, selecione 'Desativado'.`
        );
        onOpen();
        break;
      case 'equipe_page':
        setDialogTitle('Equipe');
        setDialogText(
          `Para que o usuário possa editar, excluir e criar, selecione 'Editor'.
          Para que o usuário tenha acesso a leitura da página, selecione 'Leitor'.
          Para que o usuário NÃO tenha acesso a página, selecione 'Desativado'.`
        );
        onOpen();
        break;
      case 'eleitor_page':
        setDialogTitle('Eleitor');
        setDialogText(
          `Para que o usuário possa editar, excluir e criar, selecione 'Editor'.
          Para que o usuário tenha acesso a leitura da página, selecione 'Leitor'.
          Para que o usuário NÃO tenha acesso a página, selecione 'Desativado'.`
        );
        onOpen();
        break;
      case 'demandas_page':
        setDialogTitle('Demanda');
        setDialogText(
          `Para que o usuário possa editar, excluir e criar, selecione 'Editor'.
          Para que o usuário tenha acesso a leitura da página, selecione 'Leitor'.
          Para que o usuário NÃO tenha acesso a página, selecione 'Desativado'.`
        );
        onOpen();
        break;
      case 'tarefas_page':
        setDialogTitle('Tarefa');
        setDialogText(
          `Para que o usuário possa editar, excluir e criar, selecione 'Editor'.
          Para que o usuário tenha acesso a leitura da página, selecione 'Leitor'.
          Para que o usuário NÃO tenha acesso a página, selecione 'Desativado'.`
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
      name: 'Eleitor',
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
  ];

  const handleRegister = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      setErrors({});

      setLoading(true);
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome do cargo obrigatório'),
        });

        await schema.validate(values, {
          abortEarly: false,
        });

        const body = {
          name: values?.name,
          office_id: office?.id,
          home_page: values?.home_page,
          cargo_page: values?.cargo_page,
          equipe_page: values?.equipe_page,
          eleitor_page: values?.eleitor_page,
          demandas_page: values?.demandas_page,
          tarefas_page: values?.tarefas_page,
        };

        await api.post('/role', body);

        toast({
          title: 'Cadastrado com sucesso',
          description: 'Você cadastrou um cargo.',
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
        if (err.response) {
          return toast({
            title:
              err.response.data.message ||
              'Ocorreu um erro ao cadastrar o cargo, cheque as credenciais',

            status: 'error',
            position: 'top-right',
            duration: 3000,
            isClosable: true,
          });
        }
        return toast({
          title: 'Ocorreu um erro ao cadastrar o cargo, cheque as credenciais',

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
      <Text color="gray.500" fontWeight="semibold" fontSize="20px">
        Cadastrar Cargo
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
            <Button onClick={handleRegister} width="280px">
              {loading ? <Spinner color="white" /> : 'Cadastrar'}
            </Button>
          </Flex>
        </Stack>
      </Flex>
    </HeaderSideBar>
  );
}
