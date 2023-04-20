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
import {
  Document,
  Image,
  Page,
  PDFDownloadLink,
  StyleSheet,
  Text as TextPDF,
  View,
} from '@react-pdf/renderer';
import { useEffect, useRef, useState } from 'react';
import {
  IoPencilOutline,
  IoPrintOutline,
  IoSearchSharp,
  IoTrashOutline,
} from 'react-icons/io5';
import { NumericFormat } from 'react-number-format';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Form/Button';
import Input from '../components/Form/Input';
import HeaderSideBar from '../components/HeaderSideBar';
import { useAuth } from '../contexts/AuthContext';
import { PermissionByIdDTO, StateProps, TaskPropsDTO } from '../dtos';
import api from '../services/api';
import { getFormatDate } from '../utils/date';
import { demandPage } from '../utils/filterTables';
import { paginationArray } from '../utils/pdfPagination';

export default function Demand() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [numberOfLines, setNumberOfLines] = useState(20);
  const toast = useToast();
  const [filteredData, setFilteredData] = useState([] as TaskPropsDTO[]);
  const [data, setData] = useState([] as TaskPropsDTO[]);
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const { office, role } = useAuth();
  const [demandToDeleteId, setDemandToDeleteId] = useState('');
  const [responsibles, setResponsibles] = useState([] as SelectProps[]);
  const [responsibleFilterField, setResponsibleFilterField] = useState('');
  const cancelRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectFilter, setSelectFilter] = useState('title');
  const [filterField, setFilterField] = useState('');
  const [filterFieldDateMask, setFilterFieldDateMask] = useState('');
  const [errors, setErrors] = useState({} as StateProps);

  const openDialog = (task_id: string) => {
    setDemandToDeleteId(task_id);
    onOpen();
  };
  type SelectProps = {
    label: string;
    value: string;
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

  function parseHTMLToText(htmlString: any) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlString, 'text/html');
    return htmlDoc.body.textContent || '';
  }

  const deleteDemand = async () => {
    setLoading(true);
    try {
      await api.delete(`/task/${demandToDeleteId}`);

      toast({
        title: 'Demanda excluída com sucesso',
        status: 'success',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
      getTasks();
      setDemandToDeleteId('');
    } catch (err: any) {
      return toast({
        title:
          err?.response?.data?.message ||
          'Ocorreu um erro ao excluir a demanda, tente novamente',
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

  const handleDateOfBirthChange = (input: any) => {
    const dateRegEx = /^(\d{1,2})(\/)?(\d{1,2})?(\d{0,4})?$/;
    const match = input.match(dateRegEx);

    if (match) {
      let formattedDate = match[1];

      if (match[3]) {
        formattedDate += '/' + match[3];
      }

      if (match[4]) {
        formattedDate += '/' + match[4];
      }

      setFilterFieldDateMask(formattedDate);
    } else {
      setFilterFieldDateMask(input);
    }

    setFilterField(input);
  };

  async function getTasks() {
    setData([] as TaskPropsDTO[]);

    setLoading(true);
    try {
      const response = await api.get(`/task/office/${office?.id}`);

      setData(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (office?.id) {
      getTasks();
      getPermissions();
    }
  }, [office?.id]);

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    if (responsibles.length > 0) {
      setResponsibleFilterField(responsibles[0].label);
    }
  }, [responsibles]);

  useEffect(() => {
    if (responsibleFilterField) {
      setFilteredData(
        data.filter((task) => task.responsible.name === responsibleFilterField)
      );
    } else {
      setFilteredData(data);
    }
  }, [data, responsibleFilterField]);

  const handleEditTask = (task_id: string) => {
    navigate(`/demanda/${task_id}`);
  };
  useEffect(() => {
    setFilterField('');
  }, [selectFilter]);

  const styles = StyleSheet.create({
    title: {
      width: '25%',
      fontSize: 12,
      textAlign: 'left',
      paddingRight: 8,
    },
    status: {
      width: '10%',
      fontSize: 10,
      textAlign: 'center',
    },
    description: {
      width: '45%',
      fontSize: 10,
      textAlign: 'left',
      paddingLeft: 8,
    },
    voter: {
      width: '20%',
      fontSize: 12,
      textAlign: 'center',
    },
    page: {
      fontSize: 11,
      flexDirection: 'row',
      justifyContent: 'center',
      padding: 10,
    },
    table: {
      width: '90%',
      flexDirection: 'column',
    },
    flexBetween: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    tableTitle: {
      flexDirection: 'row',
      justifyContent: 'center',
      textAlign: 'center',
    },
    tableSubTitle: {
      flexDirection: 'row',
      textAlign: 'center',
      padding: 8,
    },
    tableContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      borderTop: '1px solid black',
      borderRight: '1px solid black',
      borderLeft: '1px solid black',
    },
    rowTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      fontWeight: 500,
      borderTop: '1px solid black',
      borderRight: '1px solid black',
      borderLeft: '1px solid black',
    },
    finalRow: {
      flexDirection: 'row',
      alignItems: 'center',
      fontWeight: 'bold',
      padding: 8,
      border: '1px solid black',
    },
    image: {
      width: 25,
      height: 25,
      alignSelf: 'center',
    },
  });

  const MyDocument = () => {
    return (
      <Document>
        {paginationArray(filteredData, numberOfLines).map(
          (pageItems, index) => {
            return (
              <Page key={index} size="A4" style={styles.page}>
                <View style={styles.table}>
                  <View style={styles.flexBetween}>
                    {office?.logo_url && (
                      <Image style={styles.image} src={office?.logo_url} />
                    )}
                    <TextPDF style={styles.tableTitle}>{office?.name}</TextPDF>
                  </View>
                  {selectFilter === 'responsible' ? (
                    <TextPDF style={styles.tableSubTitle}>
                      Lista de Demandas -{' '}
                      {responsibles.find(
                        (responsible) =>
                          responsible.label === responsibleFilterField
                      )?.label || ''}
                    </TextPDF>
                  ) : (
                    <TextPDF style={styles.tableSubTitle}>
                      Lista de Demandas
                    </TextPDF>
                  )}

                  <View style={styles.tableContainer}>
                    <View style={styles.rowTitle}>
                      <TextPDF style={styles.title}>Título</TextPDF>
                      <TextPDF style={styles.status}>Status</TextPDF>
                      <TextPDF style={styles.voter}>Eleitor</TextPDF>
                      <TextPDF style={styles.description}>Descrição</TextPDF>
                    </View>

                    {pageItems.map((item: TaskPropsDTO) => {
                      return (
                        <View
                          style={
                            item?.id === pageItems[pageItems.length - 1]?.id
                              ? styles.finalRow
                              : styles.row
                          }
                          key={item.id}
                        >
                          <TextPDF style={styles.title}>{item?.title}</TextPDF>
                          <TextPDF style={styles.status}>
                            {item?.status}
                          </TextPDF>

                          <TextPDF style={styles.voter}>
                            {item?.voter.name}
                          </TextPDF>
                          <TextPDF style={styles.description}>
                            {parseHTMLToText(item?.description)}
                          </TextPDF>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </Page>
            );
          }
        )}
      </Document>
    );
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
              colorScheme={'red'}
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
                fileName={`demandas-${office?.name}.pdf`}
                onClick={() => {
                  onCloseModal();
                }}
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
          Demanda
        </Text>
        {role?.demandas_page > 1 && (
          <Button
            onClick={() => navigate('/demanda/registrar-demanda')}
            w={['160px', '280px']}
          >
            Cadastrar Demanda
          </Button>
        )}
      </Flex>
      <Text mt="36px" color="gray.500">
        Filtrar por:
      </Text>
      <Flex justifyContent="space-between">
        <Flex gap={['12px', '24px']}>
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

          {selectFilter === 'responsible' ? (
            <Select
              borderColor="gray.500"
              bg="gray.50"
              _placeholder={{ color: 'gray.500' }}
              color="gray.600"
              maxW="600px"
              name="selectResponsibleFilter"
              value={
                responsibles.find(
                  (responsible) => responsible.label === responsibleFilterField
                )?.value || ''
              }
              onChange={(e) => {
                const selectedValue = e.target.value;
                console.log('Event target value:', selectedValue);
                const selectedResponsible = responsibles.find(
                  (responsible) => responsible.value === selectedValue
                );
                if (selectedResponsible) {
                  setResponsibleFilterField(selectedResponsible.label);
                } else {
                  setResponsibleFilterField('');
                }
              }}
            >
              {responsibles.map((responsible, index) => {
                return (
                  <option value={responsible?.value} key={index}>
                    {responsible?.label}
                  </option>
                );
              })}
            </Select>
          ) : selectFilter === 'deadline' ? (
            <Input
              maxW="600px"
              type="tel"
              inputMode="numeric"
              onKeyPress={(e) => {
                if (!/\d/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              name="filterField"
              placeholder="Buscar"
              error={errors?.filterField}
              value={
                selectFilter === 'deadline' ? filterFieldDateMask : filterField
              }
              mb="24px"
              onChange={(e) => {
                const inputValue = e.target.value;
                handleDateOfBirthChange(inputValue);
              }}
              pattern="\d*"
              borderColor="gray.500"
              rightIcon={
                <Icon color="gray.500" fontSize="20px" as={IoSearchSharp} />
              }
            />
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
        <Button
          onClick={() => onOpenModal()}
          leftIcon={<Icon fontSize="20" as={IoPrintOutline} />}
          w={['160px', '280px']}
        >
          Imprimir
        </Button>
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
        <Table>
          <Thead
            position="sticky"
            top="0px"
            background="white"
            borderBottomWidth={'4px'}
            borderBottomStyle="solid"
            borderBottomColor={'gray.300'}
            backgroundColor="white"
            zIndex="1"
          >
            <Tr>
              <Th color="gray.600">Título</Th>
              <Th color="gray.600">Eleitor</Th>
              <Th color="gray.600">Prazo</Th>
              <Th color="gray.600">Criador</Th>
              <Th color="gray.600">Responsável</Th>

              {role?.demandas_page > 1 && (
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
                    case 'all':
                      return currentValue;
                    case 'title':
                      if (filterField?.length >= 3) {
                        return (
                          currentValue?.title &&
                          currentValue?.title
                            .toLowerCase()
                            .indexOf(filterField?.toLowerCase()) > -1
                        );
                      } else {
                        return currentValue;
                      }
                    case 'voter':
                      if (filterField?.length >= 3) {
                        return (
                          currentValue?.voter?.name &&
                          currentValue?.voter?.name
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
                    case 'responsible':
                      if (responsibleFilterField?.length >= 3) {
                        return (
                          currentValue?.responsible?.name &&
                          currentValue?.responsible?.name
                            .toLowerCase()
                            .indexOf(responsibleFilterField?.toLowerCase()) > -1
                        );
                      } else {
                        return currentValue;
                      }

                    case 'deadline':
                      if (filterField?.length >= 3) {
                        return (
                          getFormatDate(
                            new Date(currentValue?.deadline),
                            'dd/MM/yyyy'
                          ).indexOf(filterField) > -1
                        );
                      } else {
                        return currentValue;
                      }
                    case 'city':
                      if (filterField?.length >= 3) {
                        return (
                          currentValue?.voter?.city &&
                          currentValue?.voter?.city
                            .toLowerCase()
                            .indexOf(filterField?.toLowerCase()) > -1
                        );
                      } else {
                        return currentValue;
                      }
                    case 'neighborhood':
                      if (filterField?.length >= 3) {
                        return (
                          currentValue?.voter?.neighborhood &&
                          currentValue?.voter?.neighborhood
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
                        {task?.deadline
                          ? getFormatDate(
                              new Date(task?.deadline),
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
                        {task?.creator?.name}
                      </Td>
                      <Td
                        color="gray.600"
                        fontSize="14px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                        py="4px"
                      >
                        {task?.responsible?.name}
                      </Td>
                      {role?.demandas_page > 1 && (
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
