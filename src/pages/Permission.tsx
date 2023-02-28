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
  Switch,
  Select,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import HeaderSideBar from "../components/HeaderSideBar";
import { PermissionByIdDTO, StateProps } from "../dtos";
import {
  IoPencilOutline,
  IoSearchSharp,
  IoTrashOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Form/Button";
import Input from "../components/Form/Input";
import { permissionPage } from "../utils/filterTables";

export default function Permission() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [data, setData] = useState([] as PermissionByIdDTO[]);
  const { role } = useAuth();
  const cancelRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [permissionToDeleteId, setPermissionToDeleteId] = useState("");
  const [selectFilter, setSelectFilter] = useState("name");
  const [filterField, setFilterField] = useState("");
  const [errors, setErrors] = useState({} as StateProps);
  const [selectPageFilter, setSelectPageFilter] = useState("");

  const openDialog = (permission_id: string) => {
    setPermissionToDeleteId(permission_id);
    onOpen();
  };

  const getPermissions = async () => {
    setData([] as PermissionByIdDTO[]);

    setLoading(true);
    try {
      const response = await api.get(`/permission/office/${role?.office_id}`);

      setData(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  const deletePermission = async () => {
    setLoading(true);
    try {
      await api.delete(`/permission/${permissionToDeleteId}`);

      toast({
        title: "Equipe excluída com sucesso",
        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
      getPermissions();
      setPermissionToDeleteId("");
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

  const handleEditPermission = (permission_id: string) => {
    navigate(`/equipe/${permission_id}`);
  };

  const handleUpdateActive = async (
    permission_id: string,
    permission_active: boolean
  ) => {
    setErrors({});

    try {
      const body = {
        active: !permission_active,
        permissionId: permission_id,
      };

      await api.put("/permission", body);

      toast({
        title: "Ataulizado com sucesso",
        description: "Você atualizou uma equipe.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      getPermissions();
      return;
    } catch (err: any) {
      if (err.response) {
        return toast({
          title:
            err.response.data.message ||
            "Ocorreu um erro ao cadastrar a equipe, cheque as credenciais",

          status: "error",
          position: "top-right",
          duration: 3000,
          isClosable: true,
        });
      }
      return toast({
        title: "Ocorreu um erro ao cadastrar a equipe, cheque as credenciais",

        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    }
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
        {role?.equipe_page > 1 && (
          <Button
            onClick={() => navigate("/equipe/registrar-equipe")}
            w={["160px", "280px"]}
          >
            Cadastrar equipe
          </Button>
        )}
      </Flex>
      <Text mt="36px" color="gray.500">
        Filtar por:
      </Text>
      <Flex gap={["12px", "24px"]}>
        <Select
          w="220px"
          borderColor="gray.500"
          name="filterType"
          value={selectFilter}
          onChange={(e) => {
            setSelectFilter(e.target.value);
          }}
        >
          {permissionPage.map((permission) => {
            return (
              <option key={permission?.key} value={permission?.value}>
                {permission?.label}
              </option>
            );
          })}
        </Select>
        {selectFilter === "active" ? (
          <Select
            borderColor="gray.500"
            bg="gray.50"
            _placeholder={{ color: "gray.500" }}
            color="gray.600"
            maxW="600px"
            name="selectPageFilter"
            value={selectPageFilter}
            onChange={(e) => setSelectPageFilter(e.target.value)}
          >
            <option key="active" value="active">
              Ativo
            </option>
            <option key="inactive" value="inactive">
              Desativado
            </option>
          </Select>
        ) : (
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
        )}
      </Flex>
      <Box
        maxH="calc(100vh - 340px)"
        overflow="auto"
        mt="16px"
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
              <Th color="gray.600">Ativo</Th>
              <Th color="gray.600">Nome</Th>
              <Th color="gray.600">E-mail</Th>
              <Th color="gray.600">Telefone</Th>
              <Th color="gray.600">Cargo</Th>
              {role?.equipe_page > 1 && (
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
                  switch (selectFilter) {
                    case "name":
                      if (filterField?.length >= 3) {
                        return (
                          currentValue?.user?.name
                            .toLowerCase()
                            .indexOf(filterField?.toLowerCase()) > -1
                        );
                      } else {
                        return currentValue;
                      }
                    case "email":
                      if (filterField?.length >= 3) {
                        return (
                          currentValue?.user?.email
                            .toLowerCase()
                            .indexOf(filterField?.toLowerCase()) > -1
                        );
                      } else {
                        return currentValue;
                      }
                    case "role":
                      if (filterField?.length >= 3) {
                        return (
                          currentValue?.role?.name
                            .toLowerCase()
                            .indexOf(filterField?.toLowerCase()) > -1
                        );
                      } else {
                        return currentValue;
                      }
                    case "cellphone":
                      if (filterField?.length >= 3) {
                        return (
                          currentValue?.user?.cellphone
                            .toLowerCase()
                            .indexOf(filterField?.toLowerCase()) > -1
                        );
                      } else {
                        return currentValue;
                      }
                    case "active":
                      if (selectPageFilter === "active") {
                        return currentValue?.active === true;
                      } else if (selectPageFilter === "inactive") {
                        return currentValue?.active === false;
                      } else {
                        return currentValue;
                      }
                    default:
                      break;
                  }
                })
                .map((permission) => {
                  return (
                    <Tr key={permission.id} h="45px" py="4px">
                      <Td
                        color="gray.600"
                        fontSize="14px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                        py="0px"
                      >
                        <Switch
                          isChecked={permission?.active}
                          onChange={() =>
                            handleUpdateActive(
                              permission?.id,
                              permission?.active
                            )
                          }
                        />
                      </Td>
                      <Td
                        color="gray.600"
                        fontSize="14px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                        py="0px"
                      >
                        {permission?.user?.name}
                      </Td>
                      <Td
                        color="gray.600"
                        fontSize="14px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                        py="0px"
                      >
                        {permission?.user?.email}
                      </Td>
                      <Td
                        color="gray.600"
                        fontSize="14px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                        py="0px"
                      >
                        {permission?.user?.cellphone}
                      </Td>
                      <Td
                        color="gray.600"
                        fontSize="14px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                        py="0px"
                      >
                        {permission?.role?.name}
                      </Td>
                      <Td
                        py="0px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                      >
                        <HStack spacing="8px">
                          {role?.equipe_page > 1 && (
                            <>
                              <IconButton
                                onClick={() =>
                                  handleEditPermission(permission?.id)
                                }
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
                                onClick={() => openDialog(permission?.id)}
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
                            </>
                          )}
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
