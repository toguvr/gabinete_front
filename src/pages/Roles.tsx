import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  Button as ChakraButton,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import HeaderSideBar from "../components/HeaderSideBar";
import { PermissionByIdDTO, RoleDTO } from "../dtos";
import { IoPencilOutline, IoTrashOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Form/Button";

export default function Roles() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [data, setData] = useState([] as RoleDTO[]);
  const { role } = useAuth();
  const cancelRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [roleToDeleteId, setRoleToDeleteId] = useState("");

  const openDialog = (office_id: string) => {
    setRoleToDeleteId(office_id);
    onOpen();
  };

  const getRoles = async () => {
    setData([] as RoleDTO[]);

    setLoading(true);
    try {
      const response = await api.get(`/role`);

      setData(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  const deletePermission = async () => {
    setLoading(true);
    try {
      await api.delete(`/permission/${roleToDeleteId}`);

      toast({
        title: "Equipe excluída com sucesso",
        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
      getRoles();
      setRoleToDeleteId("");
      onClose();
    } catch (err: any) {
      return toast({
        title:
          err?.response?.data?.message ||
          "Ocorreu um erro ao excluir a equipe, tente novamente",
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = (role: RoleDTO) => {
    navigate(`/role/${role?.id}`, { state: { role } });
  };

  return (
    <HeaderSideBar>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        {/* <AlertDialogOverlay > */}
        <AlertDialogContent mx="12px">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Deseja excluir este eleitor?
          </AlertDialogHeader>

          <AlertDialogBody>
            Essa ação é irreversível, ao deletar não será possível desfazer.
            Você deseja apagar mesmo assim?
          </AlertDialogBody>

          <AlertDialogFooter>
            <ChakraButton onClick={onClose}>Cancelar</ChakraButton>
            <ChakraButton
              colorScheme={"red"}
              isLoading={loading}
              onClick={deletePermission}
              ml={3}
            >
              Continuar
            </ChakraButton>
          </AlertDialogFooter>
        </AlertDialogContent>
        {/* </AlertDialogOverlay> */}
      </AlertDialog>
      <Flex
        justifyContent={"space-between"}
        gap={["20px", "0"]}
        alignItems={["center", "flex-start"]}
      >
        <Text
          color="gray.500"
          fontWeight="semibold"
          fontSize="20px"
          ml={[0, "28px"]}
        >
          Equipe
          {loading && <Spinner color="blue.600" ml="4" size="sm" />}
        </Text>
        <Button
          onClick={() => navigate("/equipe/registrar-equipe")}
          w={["160px", "280px"]}
        >
          Cadastrar equipe
        </Button>
      </Flex>
      <Box
        maxH="calc(100vh - 340px)"
        overflow="auto"
        mt="84px"
        sx={{
          "::-webkit-scrollbar": {
            bg: "gray.50",
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            width: "2px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "gray.600",
            borderRadius: "8px",
          },
        }}
      >
        <Table variant="simple">
          <Thead position="sticky" top="0px">
            <Tr
              borderBottomWidth={"4px"}
              borderBottomStyle="solid"
              borderBottomColor={"gray.300"}
            >
              <Th color="gray.600">Nome</Th>
              <Th color="gray.600">E-mail</Th>
              <Th color="gray.600">Telefone</Th>
              <Th color="gray.600">Cargo</Th>
              <Th color="gray.600" w="8">
                Ações
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((role) => {
                return (
                  <Tr key={role.id}>
                    <Td
                      color="gray.600"
                      fontSize="14px"
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor="gray.300"
                      py="0px"
                    >
                      {role?.name}
                    </Td>
                    <Td
                      color="gray.600"
                      fontSize="14px"
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor="gray.300"
                      py="0px"
                    >
                      {role?.cargo_page}
                    </Td>
                    <Td
                      color="gray.600"
                      fontSize="14px"
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor="gray.300"
                      py="0px"
                    >
                      {role?.equipe_page}
                    </Td>
                    <Td
                      color="gray.600"
                      fontSize="14px"
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor="gray.300"
                      py="0px"
                    >
                      {role?.eleitor_page}
                    </Td>
                    <Td
                      color="gray.600"
                      fontSize="14px"
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor="gray.300"
                      py="0px"
                    >
                      {role?.demandas_page}
                    </Td>
                    <Td
                      color="gray.600"
                      fontSize="14px"
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor="gray.300"
                      py="0px"
                    >
                      {role?.tarefas_page}
                    </Td>
                    <Td
                      py="0px"
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor="gray.300"
                    >
                      <HStack spacing="8px">
                        <IconButton
                          onClick={() => handleEditRole(role)}
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
                        />

                        <IconButton
                          onClick={() => openDialog(role?.office_id)}
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
                        />
                      </HStack>
                    </Td>
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
