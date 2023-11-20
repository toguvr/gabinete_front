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
  HStack,
  Icon,
  IconButton,
  Select,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import {
  IoPencilOutline,
  IoSearchSharp,
  IoTrashOutline,
} from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Form/Button';
import Input from '../components/Form/Input';
import HeaderSideBar from '../components/HeaderSideBar';
import { useAuth } from '../contexts/AuthContext';
import { RoleDTO, StateProps } from '../dtos';
import api from '../services/api';
import { RoleStatus, roleStatus, roleStatusTasks } from '../utils/roleStatus';

export default function Roles() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [data, setData] = useState([] as RoleDTO[]);
  const { role, office } = useAuth();
  const cancelRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [roleToDeleteId, setRoleToDeleteId] = useState('');
  const [errors, setErrors] = useState({} as StateProps);
  const [selectFilter, setSelectFilter] = useState('name');
  const [filterField, setFilterField] = useState('');
  const [selectPageFilter, setSelectPageFilter] = useState('');

  const getRoleStatus = (id: number) => {
    switch (id) {
      case RoleStatus.desativado:
        return 'Desativado';
      case RoleStatus.leitor:
        return 'Leitor';
      case RoleStatus.editor:
        return 'Editor';
      default:
        return 'Status desconhecido';
    }
  };

  const openDialog = (role_id: string) => {
    setRoleToDeleteId(role_id);
    onOpen();
  };

  const getRoles = async () => {
    setData([] as RoleDTO[]);

    setLoading(true);
    try {
      const response = await api.get(`/role/office/${office?.id}`);

      setData(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  const deleteRole = async () => {
    setLoading(true);
    try {
      await api.delete(`/role/${roleToDeleteId}`);

      toast({
        title: 'Cargo excluído com sucesso',
        status: 'success',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
      getRoles();
      setRoleToDeleteId('');
    } catch (err: any) {
      return toast({
        title:
          err?.response?.data?.message ||
          'Ocorreu um erro ao excluir o cargo, tente novamente',
        status: 'error',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleEditRole = (role: string) => {
    navigate(`/cargo/${role}`);
  };

  // const handleUpdateActive = async() => {
  //     setLoading(true);
  //     try {
  //       const body = {
  //         role_id: values?.role_id,
  //         permissionId: id,
  //       };

  //       await api.put("/permission", body);

  //       return toast({
  //         title: "Ataulizado com sucesso",
  //         description: "Você atualizou uma equipe.",
  //         status: "success",
  //         duration: 3000,
  //         isClosable: true,
  //         position: "top-right",
  //       });
  //     } catch (err: any) {

  //       if (err.response) {
  //         return toast({
  //           title:
  //             err.response.data.message ||
  //             "Ocorreu um erro ao atualizar a equipe, cheque as credenciais",

  //           status: "error",
  //           position: "top-right",
  //           duration: 3000,
  //           isClosable: true,
  //         });
  //       }
  //       return toast({
  //         title: "Ocorreu um erro ao atualizar a equipe, cheque as credenciais",

  //         status: "error",
  //         position: "top-right",
  //         duration: 3000,
  //         isClosable: true,
  //       });
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  return (
    <HeaderSideBar>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent mx="12px">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Deseja excluir este cargo?
            </AlertDialogHeader>

            <AlertDialogBody>
              Essa ação é irreversível, ao deletar não será possível desfazer.
              Você deseja apagar mesmo assim?
            </AlertDialogBody>

            <AlertDialogFooter>
              <ChakraButton onClick={onClose}>Cancelar</ChakraButton>
              <ChakraButton
                colorScheme={'red'}
                isLoading={loading}
                onClick={deleteRole}
                ml={3}
              >
                Continuar
              </ChakraButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Flex
        justifyContent={'space-between'}
        gap={['20px', '0']}
        alignItems={['center', 'flex-start']}
      >
        <Text
          color="gray.500"
          fontWeight="semibold"
          fontSize="20px"
          ml={[0, '28px']}
        >
          Cargo
          {loading && (
            <Spinner color={office?.primary_color} ml="4" size="sm" />
          )}
        </Text>
        {role?.cargo_page > 1 && (
          <Button
            onClick={() => navigate('/cargo/registrar-cargo')}
            w={['160px', '280px']}
          >
            Cadastrar cargo
          </Button>
        )}
      </Flex>
      <Text mt="36px" color="gray.500">
        Filtrar por:
      </Text>
      <Flex gap={['12px', '24px']}>
        <Flex
          alignItems={'center'}
          fontSize="16px"
          fontWeight="400"
          bgColor="gray.50"
          border="1px solid"
          borderRadius="8px"
          w="220px"
          h="40px"
          paddingLeft="16px"
          borderColor="gray.500"
        >
          <Text color="gray.500">Nome</Text>
        </Flex>
        {selectFilter === 'name' ? (
          <Input
            maxW="600px"
            type="text"
            name="filterField"
            placeholder="Buscar"
            error={errors?.filterField}
            value={filterField}
            mb="24px"
            onChange={(e) => {
              setFilterField(e.target.value);
            }}
            borderColor="gray.500"
            rightIcon={
              <Icon color="gray.500" fontSize="20px" as={IoSearchSharp} />
            }
          />
        ) : (
          <Select
            borderColor="gray.500"
            bg="gray.50"
            _placeholder={{ color: 'gray.500' }}
            color="gray.600"
            maxW="600px"
            name="selectPageFilter"
            value={selectPageFilter}
            onChange={(e) => setSelectPageFilter(e.target.value)}
          >
            {selectFilter === 'tarefas_page'
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
        )}
      </Flex>
      <Box
        maxH="calc(100vh - 340px)"
        overflow="auto"
        mt="16px"
        sx={{
          '::-webkit-scrollbar': {
            bg: 'gray.50',
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            width: '2px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'gray.600',
            borderRadius: '8px',
          },
        }}
      >
        <Table variant="simple">
          <Thead position="sticky" top="0px">
            <Tr
              borderBottomWidth={'4px'}
              borderBottomStyle="solid"
              borderBottomColor={'gray.300'}
            >
              <Th color="gray.600">Nome</Th>
              <Th color="gray.600">Home</Th>
              <Th color="gray.600">Cargo</Th>
              <Th color="gray.600">Equipe</Th>
              <Th color="gray.600">Apoiador</Th>
              <Th color="gray.600">Demanda</Th>
              <Th color="gray.600">Tarefa</Th>
              {role?.cargo_page > 1 && (
                <Th color="gray.600" w="8">
                  Ações
                </Th>
              )}
            </Tr>
          </Thead>
          <Tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data
                .filter((currentValue: any) => {
                  if (selectFilter === 'name') {
                    if (filterField?.length >= 3) {
                      return (
                        currentValue[selectFilter] &&
                        currentValue[selectFilter]
                          .toLowerCase()
                          .indexOf(filterField?.toLowerCase()) > -1
                      );
                    } else {
                      return currentValue;
                    }
                  } else {
                    if (selectPageFilter) {
                      return (
                        Number(currentValue[selectFilter]) ===
                        Number(selectPageFilter)
                      );
                    }
                  }
                })
                .map((roleData) => {
                  return (
                    <Tr key={roleData.id} h="45px">
                      <Td
                        color="gray.600"
                        fontSize="14px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                        py="0px"
                      >
                        {roleData?.name}
                      </Td>
                      <Td
                        color="gray.600"
                        fontSize="14px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                        py="0px"
                      >
                        {getRoleStatus(roleData?.home_page)}
                      </Td>
                      <Td
                        color="gray.600"
                        fontSize="14px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                        py="0px"
                      >
                        {getRoleStatus(roleData?.cargo_page)}
                      </Td>
                      <Td
                        color="gray.600"
                        fontSize="14px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                        py="0px"
                      >
                        {getRoleStatus(roleData?.equipe_page)}
                      </Td>
                      <Td
                        color="gray.600"
                        fontSize="14px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                        py="0px"
                      >
                        {getRoleStatus(roleData?.eleitor_page)}
                      </Td>
                      <Td
                        color="gray.600"
                        fontSize="14px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                        py="0px"
                      >
                        {getRoleStatus(roleData?.demandas_page)}
                      </Td>
                      <Td
                        color="gray.600"
                        fontSize="14px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                        py="0px"
                      >
                        {getRoleStatus(roleData?.tarefas_page)}
                      </Td>
                      <Td
                        color="gray.600"
                        fontSize="14px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                        py="0px"
                      >
                        {getRoleStatus(roleData?.cargo_page)}
                      </Td>
                      {role?.cargo_page > 1 && (
                        <Td
                          py="0px"
                          borderBottomWidth="1px"
                          borderBottomStyle="solid"
                          borderBottomColor="gray.300"
                        >
                          <HStack spacing="8px">
                            <IconButton
                              onClick={() => handleEditRole(roleData?.id)}
                              aria-label="Open navigation"
                              variant="unstyled"
                              minW={6}
                              icon={
                                <Icon
                                  cursor="pointer"
                                  fontSize="20"
                                  as={IoPencilOutline}
                                  color="gray.600"
                                />
                              }
                              isDisabled={roleData?.name === 'Proprietário'}
                            />

                            <IconButton
                              onClick={() => openDialog(roleData?.id)}
                              aria-label="Open alert"
                              variant="unstyled"
                              minW={6}
                              icon={
                                <Icon
                                  cursor="pointer"
                                  fontSize="20"
                                  as={IoTrashOutline}
                                  color="gray.600"
                                />
                              }
                              isDisabled={roleData?.name === 'Proprietário'}
                            />
                          </HStack>
                        </Td>
                      )}
                    </Tr>
                  );
                })
            ) : (
              <Tr>Nenhum dado cadastrado</Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </HeaderSideBar>
  );
}
