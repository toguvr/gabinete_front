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
  Button as ChakraButton,
  Select,
} from "@chakra-ui/react";
import { addHours } from "date-fns";
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
import { StateProps, VoterDTO } from "../dtos";
import api from "../services/api";
import { getFormatDate } from "../utils/date";
import { voterPage } from "../utils/filterTables";

export default function Voter() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [data, setData] = useState([] as VoterDTO[]);
  const [voterToDeleteId, setVoterToDeleteId] = useState("");
  const cancelRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { role } = useAuth();
  const auth = useAuth();
  const [selectFilter, setSelectFilter] = useState("name");
  const [filterField, setFilterField] = useState("");
  const [errors, setErrors] = useState({} as StateProps);

  const openDialog = (voter_id: string) => {
    setVoterToDeleteId(voter_id);
    onOpen();
  };

  const getVoterList = async () => {
    setData([] as VoterDTO[]);

    setLoading(true);
    try {
      const response = await api.get(`/voter/office/${auth.office.id}`);

      const newDate = response.data.map((voter: VoterDTO) => {
        return {
          ...voter,
          birthdate: getFormatDate(
            addHours(new Date(voter?.birthdate), 12),
            "dd/MM/yyyy"
          ),
        };
      });
      setData(newDate);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVoterList();
  }, []);

  const deleteVoter = async () => {
    setLoading(true);
    try {
      await api.delete(`/voter/${voterToDeleteId}`);

      toast({
        title: "Usuário excluído com sucesso",
        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
      getVoterList();
      setVoterToDeleteId("");
      onClose();
    } catch (err: any) {
      return toast({
        title:
          err?.response?.data?.message ||
          "Ocorreu um erro ao excluir o eleitor, tente novamente",
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditVoter = (voter: VoterDTO) => {
    navigate(`/eleitor/${voter?.id}`, { state: { voter } });
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
              onClick={deleteVoter}
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
          Eleitor
          {loading && <Spinner color="blue.600" ml="4" size="sm" />}
        </Text>
        {role?.eleitor_page > 1 && (
          <Button
            onClick={() => navigate("/eleitor/registrar-eleitor")}
            w={["160px", "280px"]}
          >
            Cadastrar eleitor
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
          {voterPage.map((voter) => {
            return (
              <option key={voter?.key} value={voter?.value}>
                {voter?.label}
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
              <Th color="gray.600">Nome</Th>
              <Th color="gray.600">E-mail</Th>
              <Th color="gray.600">Data de nascimento</Th>
              <Th color="gray.600">Telefone</Th>
              <Th color="gray.600">Endereço</Th>
              {role?.eleitor_page > 1 && (
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
                          currentValue?.name
                            .toLowerCase()
                            .indexOf(filterField?.toLowerCase()) > -1
                        );
                      } else {
                        return currentValue;
                      }
                    case "email":
                      if (filterField?.length >= 3) {
                        return (
                          currentValue?.email
                            .toLowerCase()
                            .indexOf(filterField?.toLowerCase()) > -1
                        );
                      } else {
                        return currentValue;
                      }
                    case "birthdate":
                      if (filterField?.length >= 3) {
                        return (
                          currentValue?.birthdate
                            .toLowerCase()
                            .indexOf(filterField?.toLowerCase()) > -1
                        );
                      } else {
                        return currentValue;
                      }
                    case "cellphone":
                      if (filterField?.length >= 3) {
                        return (
                          currentValue?.cellphone
                            .toLowerCase()
                            .indexOf(filterField?.toLowerCase()) > -1
                        );
                      } else {
                        return currentValue;
                      }
                    case "address":
                      if (filterField?.length >= 3) {
                        return (
                          currentValue?.neighborhood
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
                .map((voter) => {
                  return (
                    <Tr key={voter.id} whiteSpace="nowrap">
                      <Td
                        color="gray.600"
                        fontSize="14px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                        py="4px"
                      >
                        {voter?.name}
                      </Td>
                      <Td
                        color="gray.600"
                        fontSize="14px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                        py="4px"
                      >
                        {voter?.email}
                      </Td>
                      <Td
                        color="gray.600"
                        fontSize="14px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                        py="4px"
                      >
                        {voter?.birthdate ? voter?.birthdate : "-"}
                      </Td>
                      <Td
                        color="gray.600"
                        fontSize="14px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                        py="4px"
                      >
                        {voter?.cellphone ? voter?.cellphone : "-"}
                      </Td>
                      {voter?.street ? (
                        <Td
                          color="gray.600"
                          fontSize="14px"
                          borderBottomWidth="1px"
                          borderBottomStyle="solid"
                          borderBottomColor="gray.300"
                          w="120px"
                          py="4px"
                        >
                          {voter?.zip
                            ? `${voter?.street ? voter?.street + "," : ""}
                              ${
                                voter?.address_number
                                  ? voter?.address_number + ","
                                  : ""
                              }
                              ${
                                voter?.neighborhood
                                  ? voter?.neighborhood + ","
                                  : ""
                              }
                              ${
                                voter?.complement ? voter?.complement + "," : ""
                              }
                              ${voter?.city ? voter?.city + "," : ""}
                              ${voter?.state ? voter?.state + "," : ""}`
                            : "-"}
                        </Td>
                      ) : (
                        <Td
                          color="gray.600"
                          fontSize="14px"
                          borderBottomWidth="1px"
                          borderBottomStyle="solid"
                          borderBottomColor="gray.300"
                          py="4px"
                        >
                          -
                        </Td>
                      )}
                      {role?.eleitor_page > 1 && (
                        <Td
                          py="4px"
                          borderBottomWidth="1px"
                          borderBottomStyle="solid"
                          borderBottomColor="gray.300"
                        >
                          <HStack spacing="4px">
                            <IconButton
                              onClick={() => handleEditVoter(voter)}
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
                              onClick={() => openDialog(voter?.id)}
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
