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
  Select,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import {
  IoPencilOutline,
  IoSearchSharp,
  IoTrashOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Button from "../components/Form/Button";
import Input from "../components/Form/Input";
import HeaderSideBar from "../components/HeaderSideBar";
import { useAuth } from "../contexts/AuthContext";
import { StateProps, TaskPropsDTO } from "../dtos";
import api from "../services/api";
import { getFormatDate } from "../utils/date";
import { demandPage } from "../utils/filterTables";

export default function Demand() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [data, setData] = useState([] as TaskPropsDTO[]);
  const { office, role } = useAuth();
  const [demandToDeleteId, setDemandToDeleteId] = useState("");
  const cancelRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectFilter, setSelectFilter] = useState("title");
  const [filterField, setFilterField] = useState("");
  const [errors, setErrors] = useState({} as StateProps);

  const openDialog = (task_id: string) => {
    setDemandToDeleteId(task_id);
    onOpen();
  };

  const deleteDemand = async () => {
    setLoading(true);
    try {
      await api.delete(`/task/${demandToDeleteId}`);

      toast({
        title: "Demanda excluída com sucesso",
        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
      getTasks();
      setDemandToDeleteId("");
      onClose();
    } catch (err: any) {
      return toast({
        title:
          err?.response?.data?.message ||
          "Ocorreu um erro ao excluir a demanda, tente novamente",
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  async function getTasks() {
    setData([] as TaskPropsDTO[]);

    setLoading(true);
    try {
      const response = await api.get(`/task/office/${office?.id}`);
      setData(response?.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (office?.id) {
      getTasks();
    }
  }, [office?.id]);

  const handleEditTask = (task_id: string) => {
    navigate(`/demanda/${task_id}`);
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
            Deseja excluir esta demanda?
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
              onClick={deleteDemand}
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
          Demandas
        </Text>
        {role?.demandas_page > 1 && (
          <Button
            onClick={() => navigate("/demanda/registrar-demanda")}
            w={["160px", "280px"]}
          >
            Cadastrar Demanda
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
          {demandPage.map((task) => {
            return (
              <option key={task?.key} value={task?.value}>
                {task?.label}
              </option>
            );
          })}
        </Select>

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
        <Table>
          <Thead
            position="sticky"
            top="0px"
            background="white"
            borderBottomWidth={"4px"}
            borderBottomStyle="solid"
            borderBottomColor={"gray.300"}
          >
            <Tr>
              <Th color="gray.600">Título</Th>
              <Th color="gray.600">Eleitor</Th>
              <Th color="gray.600">Prazo</Th>
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
                    case "title":
                      if (filterField?.length >= 3) {
                        return (
                          currentValue?.title
                            .toLowerCase()
                            .indexOf(filterField?.toLowerCase()) > -1
                        );
                      } else {
                        return currentValue;
                      }
                    case "voter":
                      if (filterField?.length >= 3) {
                        return (
                          currentValue?.voter?.name
                            .toLowerCase()
                            .indexOf(filterField?.toLowerCase()) > -1
                        );
                      } else {
                        return currentValue;
                      }
                    case "deadline":
                      if (filterField?.length >= 3) {
                        return (
                          currentValue?.deadline
                            .toLowerCase()
                            .indexOf(filterField?.toLowerCase()) > -1
                        );
                      } else {
                        return currentValue;
                      }
                    default:
                      break;
                  }
                })
                .map((task) => {
                  return (
                    <Tr key={task.id} whiteSpace="nowrap">
                      <Td
                        color="gray.600"
                        fontSize="14px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                        py="4px"
                      >
                        {task?.title}
                      </Td>
                      <Td
                        color="gray.600"
                        fontSize="14px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                        py="4px"
                      >
                        {task?.voter?.name}
                      </Td>
                      <Td
                        color="gray.600"
                        fontSize="14px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                        py="4px"
                      >
                        {getFormatDate(task?.date)}
                      </Td>
                      {role?.equipe_page > 1 && (
                        <Td
                          py="4px"
                          borderBottomWidth="1px"
                          borderBottomStyle="solid"
                          borderBottomColor="gray.300"
                        >
                          <HStack spacing="4px">
                            <IconButton
                              onClick={() => handleEditTask(task?.id)}
                              aria-label="Open navigation"
                              variant="unstyled"
                              icon={
                                <Icon
                                  cursor="pointer"
                                  fontSize="24"
                                  as={IoPencilOutline}
                                  color="gray.600"
                                />
                              }
                            />

                            <IconButton
                              onClick={() => openDialog(task?.id)}
                              aria-label="Open alert"
                              variant="unstyled"
                              icon={
                                <Icon
                                  cursor="pointer"
                                  fontSize="24"
                                  as={IoTrashOutline}
                                  color="gray.600"
                                />
                              }
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
