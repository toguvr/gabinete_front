import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Box,
  Button as ChakraButton,
  Flex,
  HStack,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
} from "@chakra-ui/react";
import {
  Document,
  Image,
  Page,
  PDFDownloadLink,
  StyleSheet,
  Text as TextPDF,
  View,
} from "@react-pdf/renderer";
import { addHours } from "date-fns";
import { useEffect, useRef, useState } from "react";
import {
  IoAddCircleSharp,
  IoLogoWhatsapp,
  IoPencilOutline,
  IoPrintOutline,
  IoSearchSharp,
  IoTrashOutline,
} from 'react-icons/io5';
import { NumericFormat } from 'react-number-format';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Form/Button';
import Input from '../components/Form/Input';
import HeaderSideBar from '../components/HeaderSideBar';
import { useAuth } from '../contexts/AuthContext';
import { PermissionByIdDTO, StateProps, VoterDTO } from '../dtos';
import api from '../services/api';
import { getFormatDate } from '../utils/date';
import { voterPage } from '../utils/filterTables';
import { paginationArray } from '../utils/pdfPagination';


export default function Voter() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [data, setData] = useState([] as VoterDTO[]);
  const [voterToDeleteId, setVoterToDeleteId] = useState("");
  const cancelRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const {
    isOpen: isOpenAlert,
    onOpen: onOpenAlert,
    onClose: onCloseAlert,
  } = useDisclosure();
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const { role, office } = useAuth();
  const auth = useAuth();
  const [selectFilter, setSelectFilter] = useState("name");
  const [filterField, setFilterField] = useState("");
  const [numberOfLines, setNumberOfLines] = useState(14);
  const [errors, setErrors] = useState({} as StateProps);

  const openDialog = (voter_id: string) => {
    setVoterToDeleteId(voter_id);
    onOpenAlert();
  };

  const getVoterList = async () => {
    setData([] as VoterDTO[]);

    setLoading(true);
    try {
      const response = await api.get(`/voter/office/${auth.office.id}`);

      setData(response.data);
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
      setVoterToDeleteId('');

    } catch (err: any) {
      return toast({
        title:
          err?.response?.data?.message ||
          'Ocorreu um erro ao excluir o eleitor, tente novamente',
        status: 'error',
        position: 'top-right',

        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      onCloseAlert();
    }
  };

  const handleEditVoter = (voter: VoterDTO) => {
    navigate(`/eleitor/${voter?.id}`, { state: { voter } });
  };

  const styles = StyleSheet.create({
    page: {
      fontSize: 11,
      flexDirection: "row",
      justifyContent: "center",
      padding: 10,
    },
    table: {
      width: "90%",
      flexDirection: "column",
    },
    flexBetween: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    columnTitle: {
      width: "100%",
      flexDirection: "column",
      alignItems: "center",
    },
    summary: {
      width: "100%",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: 10,
    },
    summaryTitle: {
      flexDirection: "row",
      justifyContent: "center",
      textAlign: "center",
      fontSize: 10,
    },
    tableTitle: {
      flexDirection: "row",
      justifyContent: "center",
      textAlign: "center",
    },
    tableSubTitle: {
      flexDirection: "row",
      textAlign: "center",
      padding: 8,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
      backgroundColor: "red",
    },
    tableContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      padding: 8,
      borderTop: "1px solid black",
      borderRight: "1px solid black",
      borderLeft: "1px solid black",
    },
    rowTitle: {
      flexDirection: "row",
      alignItems: "center",
      padding: 8,
      fontWeight: 500,
      borderTop: "1px solid black",
      borderRight: "1px solid black",
      borderLeft: "1px solid black",
    },
    finalRow: {
      flexDirection: "row",
      alignItems: "center",
      fontWeight: "bold",
      padding: 8,
      border: "1px solid black",
    },
    voter: {
      width: "40%",
      padding: 1,
    },
    descriptionBold: {
      width: "20%",
      fontWeight: "bold",
    },
    email: {
      width: "40%",
      padding: 1,
    },
    cellphone: {
      width: "20%",
      padding: 1,
    },
    xyzColumn: {
      width: "12%",
      flexDirection: "column",
      display: "flex",
    },
    image: {
      width: 25,
      height: 25,
      alignSelf: "center",
    },
  });

  const MyDocument = () => {
    return (
      <Document>
        {paginationArray(data, numberOfLines).map((pageItems, index) => {
          return (
            <Page key={index} size="A4" style={styles.page}>
              <View style={styles.table}>
                <View style={styles.flexBetween}>
                  {office?.logo_url && (
                    <Image style={styles.image} src={office?.logo_url} />
                  )}
                  <TextPDF style={styles.tableTitle}>{office?.name}</TextPDF>
                </View>

                <TextPDF style={styles.tableSubTitle}>
                  Lista de Eleitores
                </TextPDF>

                <View style={styles.tableContainer}>
                  <View style={styles.rowTitle}>
                    <TextPDF style={styles.voter}>Eleitor</TextPDF>
                    <TextPDF style={styles.email}>E-mail</TextPDF>
                    <TextPDF style={styles.cellphone}>Telefone</TextPDF>
                  </View>

                  {pageItems.map((item: VoterDTO) => {
                    return (
                      <View
                        style={
                          item?.id === pageItems[pageItems.length - 1]?.id
                            ? styles.finalRow
                            : styles.row
                        }
                        key={item.id}
                      >
                        <TextPDF style={styles.voter}>{item?.name}</TextPDF>
                        <TextPDF style={styles.email}>{item?.email}</TextPDF>
                        <TextPDF style={styles.cellphone}>
                          {item?.cellphone}
                        </TextPDF>
                      </View>
                    );
                  })}
                  {/*<TableFooter items={data.items} />*/}
                </View>
              </View>
            </Page>
          );
        })}
      </Document>
    );
  };

  return (
    <HeaderSideBar>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpenAlert}
        onClose={onCloseAlert}
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
            <ChakraButton onClick={onCloseAlert}>Cancelar</ChakraButton>
            <ChakraButton
              colorScheme={'red'}
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
      <Modal isOpen={isOpenModal} onClose={onCloseModal} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            alignItems="center"
            display="flex"
            justifyContent="space-between"
          >
            <Text fontSize="20px" fontWeight="700" color="green.1000">
              Impressão de documento
            </Text>
          </ModalHeader>

          <ModalBody>
            <span>Atenção, digite o número de linhas desejados na página.</span>
            <NumericFormat
              required
              customInput={Input}
              decimalScale={2}
              label=""
              name="numberOfLines"
              suffix=" linhas"
              type="text"
              value={numberOfLines}
              onValueChange={(value) => {
                setNumberOfLines(Number(value.value));
              }}
            />
          </ModalBody>

          <ModalFooter>
            <ChakraButton variant="outline" mr={3} onClick={onCloseModal}>
              Cancelar
            </ChakraButton>

            {data.length > 0 && (
              <PDFDownloadLink
                document={<MyDocument />}
                fileName={`eleitores-${office?.name}.pdf`}
              >
                <Button
                  colorScheme="teal"
                  leftIcon={<Icon fontSize="20" as={IoPrintOutline} />}
                >
                  Imprimir
                </Button>
              </PDFDownloadLink>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex
        justifyContent={"space-between"}
        gap={["20px", "0"]}
        alignItems={["center", "flex-start"]}
      >
        <Text
          color="gray.500"
          fontWeight="semibold"
          fontSize="20px"
          ml={[0, '28px']}

        >
          Eleitor
          {loading && (
            <Spinner color={office?.primary_color} ml="4" size="sm" />
          )}
        </Text>
        {role?.eleitor_page > 1 && (
          <Button
            onClick={() => navigate('/eleitor/registrar-eleitor')}
            w={['160px', '280px']}

          >
            Cadastrar eleitor
          </Button>
        )}
      </Flex>
      <Text mt="36px" color="gray.500">
        Filtar por:
      </Text>
      <Flex justifyContent="space-between">
        <Flex gap={["12px", "24px"]} flex="1" mr={["0", "24px"]}>
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

        <Button
          onClick={() => onOpenModal()}
          leftIcon={<Icon fontSize="20" as={IoPrintOutline} />}
          w={["160px", "280px"]}
        >
          Imprimir
        </Button>
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
            borderBottomColor={'gray.300'}
            backgroundColor="white"
            zIndex="1"

          >
            <Tr>
              {role?.demandas_page > 1 && <Th color="gray.600"></Th>}
              <Th color="gray.600">Nome</Th>
              <Th color="gray.600">Referência</Th>
              <Th color="gray.600">E-mail</Th>
              <Th color="gray.600">Data de nascimento</Th>
              <Th color="gray.600">Telefone</Th>
              <Th color="gray.600">Criador</Th>
              <Th color="gray.600">Endereço</Th>
              {role?.eleitor_page > 1 && (
                <Th textAlign="center" color="gray.600" w="8">
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
                          currentValue &&
                          currentValue.name &&
                          currentValue.name
                            .toLowerCase()
                            .indexOf(filterField?.toLowerCase()) > -1
                        );
                      } else {
                        return currentValue;
                      }
                    case "reference":
                      if (filterField?.length >= 3) {
                        return (
                          currentValue?.reference &&
                          currentValue?.reference
                            .toLowerCase()
                            .indexOf(filterField?.toLowerCase()) > -1
                        );
                      } else {
                        return currentValue;
                      }

                    case 'creator':
                      if (filterField?.length >= 3) {
                        return (
                          currentValue?.creator?.name &&
                          currentValue?.creator?.name
                            .toLowerCase()
                            .indexOf(filterField?.toLowerCase()) > -1
                        );
                      } else {
                        return currentValue;
                      }
                    case 'email':

                      if (filterField?.length >= 3) {
                        return (
                          currentValue?.email &&
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
                          getFormatDate(
                            addHours(new Date(currentValue?.birthdate), 12),
                            "dd/MM/yyyy"
                          ).indexOf(filterField) > -1
                        );
                      } else {
                        return currentValue;
                      }
                    case "cellphone":
                      if (filterField?.length >= 3) {
                        return (
                          currentValue?.cellphone &&
                          currentValue?.cellphone
                            .toLowerCase()
                            .indexOf(filterField?.toLowerCase()) > -1
                        );
                      } else {
                        return currentValue;
                      }
                    case "city":
                      if (filterField?.length >= 3) {
                        return (
                          currentValue?.city &&
                          currentValue?.city
                            .toLowerCase()
                            .indexOf(filterField?.toLowerCase()) > -1
                        );
                      } else {
                        return currentValue;
                      }
                    case "neighborhood":
                      if (filterField?.length >= 3) {
                        return (
                          currentValue?.neighborhood &&
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
                      {role?.demandas_page > 1 && (
                        <Td
                          color="gray.600"
                          fontSize="14px"
                          borderBottomWidth="1px"
                          borderBottomStyle="solid"
                          borderBottomColor="gray.300"
                          py="4px"
                        >
                          <Link
                            target="_blank"
                            to={`/demanda/registrar-demanda/${voter?.cellphone}`}
                          >
                            <IconButton
                              aria-label="Open alert"
                              variant="unstyled"
                              icon={
                                <Icon
                                  cursor="pointer"
                                  fontSize="24px"
                                  as={IoAddCircleSharp}
                                  color={office?.primary_color}
                                />
                              }
                            />
                          </Link>
                        </Td>
                      )}

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
                        {voter?.reference}
                      </Td>
                      <Td
                        color="gray.600"
                        fontSize="14px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                        py="4px"
                      >
                        {voter?.email ? voter?.email : "-"}
                      </Td>
                      <Td
                        color="gray.600"
                        fontSize="14px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                        py="4px"
                      >
                        {voter?.birthdate
                          ? getFormatDate(
                              addHours(new Date(voter?.birthdate), 12),
                              'dd/MM/yyyy'
                            )
                          : '-'}

                      </Td>
                      <Td
                        color="gray.600"
                        fontSize="14px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                        py="4px"
                      >
                        {voter?.cellphone ? (
                          <Link
                            target="_blank"
                            to={`https://wa.me/55${voter?.cellphone}`}
                            rel="noopener noreferrer"
                          >
                            <IconButton
                              aria-label="Open alert"
                              variant="unstyled"
                              icon={
                                <Icon
                                  cursor="pointer"
                                  fontSize="24px"
                                  as={IoLogoWhatsapp}
                                  color={office?.primary_color}
                                />
                              }
                            />
                            {voter?.cellphone}
                          </Link>
                        ) : (
                          "-"
                        )}
                      </Td>
                      <Td
                        color="gray.600"
                        fontSize="14px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                        py="4px"
                      >
                        {voter?.creator?.name}
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
                            ? `${voter?.street ? voter?.street + ',' : ''}
                              ${
                                voter?.address_number
                                  ? voter?.address_number + ','
                                  : ''
                              }
                              ${
                                voter?.neighborhood
                                  ? voter?.neighborhood + ','
                                  : ''
                              }
                              ${
                                voter?.complement ? voter?.complement + ',' : ''
                              }
                              ${voter?.city ? voter?.city + ',' : ''}
                              ${voter?.state ? voter?.state + ',' : ''}`
                            : '-'}

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
              <Tr>
                <Td fontSize={"14px"} w="100%">
                  Nenhum dado cadastrado
                </Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </HeaderSideBar>
  );
}
