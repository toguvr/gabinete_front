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
import { useNavigate } from 'react-router-dom';
import Button from '../components/Form/Button';
import Input from '../components/Form/Input';
import HeaderSideBar from '../components/HeaderSideBar';
import Pagination from '../components/Pagination';
import { useAuth } from '../contexts/AuthContext';
import { PermissionByIdDTO, TaskPropsDTO } from '../dtos';
import { useDebounce } from '../hooks/useDebounce';
import api from '../services/api';
import { convertDateFormat } from '../utils/convertDateFormat';
import { getFormatDate } from '../utils/date';
import { demandPage } from '../utils/filterTables';
import { paginationArray } from '../utils/pdfPagination';

type SelectProps = {
  label: string;
  value: string;
};

export default function Demand() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [data, setData] = useState([] as TaskPropsDTO[]);
  const { office, role } = useAuth();
  const [demandToDeleteId, setDemandToDeleteId] = useState('');
  const [responsibles, setResponsibles] = useState([] as SelectProps[]);
  const [responsibleFilterField, setResponsibleFilterField] = useState('');
  const cancelRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectFilter, setSelectFilter] = useState('title');
  const [filterField, setFilterField] = useState('');
  const [filterFieldDateMask, setFilterFieldDateMask] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const debouncedValue = useDebounce(
    responsibleFilterField || filterFieldDateMask || filterField,
    500
  );
  const [filters, setFilters] = useState([
    { filterType: 'title', filterValue: '' },
  ]);

  // Add a new filter
  const addFilter = () => {
    setFilters([...filters, { filterType: 'title', filterValue: '' }]);
  };

  // Handle filter type or value change
  const handleFilterChange = (
    index: number,
    field: 'filterType' | 'filterValue',
    value: string
  ) => {
    const newFilters = [...filters];
    newFilters[index][field] = value;
    setFilters(newFilters);
  };
  useEffect(() => {
    getTasks(1);
  }, [filters]);

  const perPage = 7;

  const isResponsible = selectFilter === 'responsible';

  const openDialog = (task_id: string) => {
    setDemandToDeleteId(task_id);
    onOpen();
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

  async function getTasks(currentPage = 1) {
    setData([] as TaskPropsDTO[]);
    setLoading(true);

    try {
      // Convert filters into query parameters as a key-value object
      const filterParams = filters.reduce((acc: any, filter) => {
        if (filter.filterValue) {
          const filterMapping = {
            voter: 'voter.name',
            creator: 'creator.name',
            responsible: 'responsible.name',
            city: 'voter.city',
            neighborhood: 'voter.neighborhood',
          };

          // Map the filterType to the correct field name
          const field =
            filterMapping[filter.filterType as keyof typeof filterMapping] ||
            filter.filterType;

          // Accumulate filters into the query parameter object
          acc[field] = filter.filterValue;
        }
        return acc;
      }, {});

      const response = await api.get(`/task/office/${office?.id}`, {
        params: {
          page: currentPage,
          quantity: perPage,
          ...filterParams, // Spread the filterParams object into the query params
        },
      });

      setData(response.data.items);
      setTotalPages(response.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

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

  useEffect(() => {
    if (office.id) {
      getPermissions();
    }
  }, [office.id]);

  useEffect(() => {
    getTasks(page);
  }, [page, debouncedValue]);

  useEffect(() => {
    getTasks(1);
  }, [debouncedValue]);

  const handleEditTask = (task_id: string) => {
    navigate(`/demanda/${task_id}`);
  };
  useEffect(() => {
    setFilterField('');
    setFilterFieldDateMask('');
    setResponsibleFilterField('');
  }, [selectFilter]);

  const styles = StyleSheet.create({
    title: {
      width: '20%',
      fontSize: 10,
      textAlign: 'left',
      paddingRight: 8,
    },
    status: {
      width: '10%',
      fontSize: 10,
      textAlign: 'center',
    },
    description: {
      width: '30%',
      fontSize: 10,
      textAlign: 'left',
      paddingLeft: 8,
    },
    voter: {
      width: '10%',
      fontSize: 10,
      textAlign: 'center',
      paddingLeft: 8,
    },
    cell: {
      width: '10%',
      fontSize: 10,
      textAlign: 'center',
      paddingLeft: 8,
      paddingRight: 8,
    },
    address: {
      width: '20%',
      fontSize: 10,
      textAlign: 'left',
      paddingLeft: 8,
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
        {paginationArray(data, 5).map((pageItems, index) => (
          <Page
            key={index}
            size="A4"
            style={styles.page}
            orientation="landscape"
          >
            <View style={styles.table}>
              <View style={styles.flexBetween}>
                {office?.logo_url && (
                  <Image style={styles.image} src={office?.logo_url} />
                )}
                <TextPDF style={styles.tableTitle}>{office?.name}</TextPDF>
              </View>
              {isResponsible ? (
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
                  <TextPDF style={styles.voter}>Apoiador</TextPDF>
                  <TextPDF style={styles.status}>Status</TextPDF>
                  <TextPDF style={styles.title}>Título</TextPDF>
                  <TextPDF style={styles.description}>Descrição</TextPDF>
                  <TextPDF style={styles.cell}>Telefone</TextPDF>
                  <TextPDF style={styles.address}>Endereço</TextPDF>
                </View>

                {pageItems.map((item: TaskPropsDTO) => (
                  <View
                    style={
                      item?.id === pageItems[pageItems.length - 1]?.id
                        ? styles.finalRow
                        : styles.row
                    }
                    key={item.id}
                  >
                    <TextPDF style={styles.voter}>{item?.voter.name}</TextPDF>
                    <TextPDF style={styles.status}>{item?.status}</TextPDF>
                    <TextPDF style={styles.title}>{item?.title}</TextPDF>

                    <TextPDF style={styles.description}>
                      {parseHTMLToText(item?.description)}
                    </TextPDF>
                    <TextPDF style={styles.cell}>
                      {item?.voter.cellphone}
                    </TextPDF>
                    <TextPDF style={styles.address}>
                      {item?.voter?.zip
                        ? `${
                            item?.voter?.street ? item?.voter?.street + ',' : ''
                          }
                              ${
                                item?.voter?.address_number
                                  ? item?.voter?.address_number + ','
                                  : ''
                              }
                              ${
                                item?.voter?.neighborhood
                                  ? item?.voter?.neighborhood + ','
                                  : ''
                              }
                              ${
                                item?.voter?.complement
                                  ? item?.voter?.complement + ','
                                  : ''
                              }
                              ${
                                item?.voter?.city ? item?.voter?.city + ',' : ''
                              }
                              ${
                                item?.voter?.state
                                  ? item?.voter?.state + ','
                                  : ''
                              }`
                        : '-'}
                    </TextPDF>
                  </View>
                ))}
              </View>
            </View>
          </Page>
        ))}
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
        <AlertDialogOverlay>
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
        </AlertDialogOverlay>
      </AlertDialog>
      <Flex direction="column" h="100%">
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
        <Flex justifyContent="space-between" flexDir={['column', 'row']}>
          <Flex gap={['12px', '24px']} direction="column" w="100%">
            {filters.map((filter, index) => (
              <Flex key={index} gap={['12px', '24px']} alignItems="center">
                <Select
                  w="220px"
                  borderColor="gray.500"
                  name={`filterType-${index}`}
                  value={filter.filterType}
                  onChange={(e) =>
                    handleFilterChange(index, 'filterType', e.target.value)
                  }
                >
                  {demandPage.map((task) => (
                    <option key={task?.key} value={task?.value}>
                      {task?.label}
                    </option>
                  ))}
                </Select>

                {filter.filterType === 'responsible' ? (
                  <Select
                    borderColor="gray.500"
                    bg="gray.50"
                    _placeholder={{ color: 'gray.500' }}
                    color="gray.600"
                    maxW="400px"
                    name={`filterValue-${index}`}
                    value={
                      responsibles.find(
                        (responsible) =>
                          responsible.label === filter.filterValue
                      )?.value || ''
                    }
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      const selectedResponsible = responsibles.find(
                        (responsible) => responsible.value === selectedValue
                      );
                      handleFilterChange(
                        index,
                        'filterValue',
                        selectedResponsible ? selectedResponsible.label : ''
                      );
                    }}
                  >
                    <option value="0">Escolher responsável</option>
                    {responsibles.map((responsible, index) => (
                      <option value={responsible?.value} key={index}>
                        {responsible?.label}
                      </option>
                    ))}
                  </Select>
                ) : filter.filterType === 'deadline' ? (
                  <Input
                    maxW="400px"
                    type="tel"
                    inputMode="numeric"
                    onKeyPress={(e) => {
                      if (!/\d/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    name={`filterValue-${index}`}
                    placeholder="Buscar"
                    value={filter.filterValue}
                    onChange={(e) =>
                      handleFilterChange(index, 'filterValue', e.target.value)
                    }
                    pattern="\d*"
                    borderColor="gray.500"
                    rightIcon={
                      <Icon
                        color="gray.500"
                        fontSize="20px"
                        as={IoSearchSharp}
                      />
                    }
                  />
                ) : (
                  <Input
                    maxW="400px"
                    type="text"
                    name={`filterValue-${index}`}
                    placeholder="Buscar"
                    value={filter.filterValue}
                    onChange={(e) =>
                      handleFilterChange(index, 'filterValue', e.target.value)
                    }
                    borderColor="gray.500"
                    rightIcon={
                      <Icon
                        color="gray.500"
                        fontSize="20px"
                        as={IoSearchSharp}
                      />
                    }
                  />
                )}
              </Flex>
            ))}

            <Button onClick={addFilter} w="200px" mt="4">
              Adicionar Filtro
            </Button>
          </Flex>

          <PDFDownloadLink
            document={<MyDocument />}
            fileName={`demandas-${office?.name}.pdf`}
          >
            <Button
              w={['160px', '280px']}
              leftIcon={<Icon fontSize="20" as={IoPrintOutline} />}
            >
              Imprimir
            </Button>
          </PDFDownloadLink>
        </Flex>

        <Box
          w={'100%'}
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
          h={'100%'}
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
                <Th color="gray.600">Apoiador</Th>
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
              {data.length > 0 ? (
                data.map((task) => {
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
        <Flex alignItems="center" justifyContent="center">
          <Pagination
            currentPage={page}
            perPage={perPage}
            totalPages={isResponsible ? 1 : totalPages}
            onPageChange={setPage}
          />
        </Flex>
      </Flex>
    </HeaderSideBar>
  );
}
