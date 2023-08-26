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
  Modal,
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
  IoAddCircleSharp,
  IoLogoWhatsapp,
  IoPencilOutline,
  IoPrintOutline,
  IoSearchSharp,
  IoTrashOutline,
} from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Form/Button';
import Input from '../components/Form/Input';
import HeaderSideBar from '../components/HeaderSideBar';
import Pagination from '../components/Pagination';
import { useAuth } from '../contexts/AuthContext';
import { VoterDTO } from '../dtos';
import { useDebounce } from '../hooks/useDebounce';
import api from '../services/api';
import { getFormatDate } from '../utils/date';
import { voterPage } from '../utils/filterTables';

export default function Voter() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [filterFieldDateMask, setFilterFieldDateMask] = useState('');
  const toast = useToast();
  const [data, setData] = useState([] as VoterDTO[]);
  const [voterToDeleteId, setVoterToDeleteId] = useState('');
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
  const [selectFilter, setSelectFilter] = useState('name');
  const [filterField, setFilterField] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const debouncedValue = useDebounce(filterFieldDateMask || filterField, 500);

  const perPage = 20;

  function convertDateFormat(dateStr: string): string {
    const parts = dateStr.split('/');
    const newDate = new Date(
      parseInt(parts[2]),
      parseInt(parts[1]) - 1,
      parseInt(parts[0]),
      13,
      0,
      0
    );
    return newDate.toISOString();
  }
  const openDialog = (voter_id: string) => {
    setVoterToDeleteId(voter_id);
    onOpenAlert();
  };

  const getVoterList = async (currentPage = 1) => {
    setData([] as VoterDTO[]);

    setLoading(true);
    try {
      const response = await api.get(`/voter/office/${auth.office.id}`, {
        params: {
          page: currentPage,
          quantity: perPage,
          field: selectFilter,
          value: filterFieldDateMask
            ? convertDateFormat(filterFieldDateMask)
            : filterField,
        },
      });

      setData(response.data.items);
      setTotalPages(response.data.total);
    } catch (err) {
    } finally {
      setLoading(false);
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
    getVoterList(page);
  }, [page, debouncedValue]);

  useEffect(() => {
    setPage(1);
  }, [debouncedValue]);

  const deleteVoter = async () => {
    setLoading(true);
    try {
      await api.delete(`/voter/${voterToDeleteId}`);

      toast({
        title: 'Usuário excluído com sucesso',
        status: 'success',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
      getVoterList(page);
      setVoterToDeleteId('');
    } catch (err: any) {
      return toast({
        title:
          err?.response?.data?.message ||
          'Ocorreu um erro ao excluir o apoiador, tente novamente',
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
    columnTitle: {
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center',
    },
    summary: {
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: 10,
    },
    summaryTitle: {
      flexDirection: 'row',
      justifyContent: 'center',
      textAlign: 'center',
      fontSize: 10,
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
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
      backgroundColor: 'red',
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
    voter: {
      width: '40%',
      padding: 1,
    },
    descriptionBold: {
      width: '20%',
      fontWeight: 'bold',
    },
    reference: {
      width: '40%',
      padding: 1,
    },
    cellphone: {
      width: '20%',
      padding: 1,
    },
    xyzColumn: {
      width: '12%',
      flexDirection: 'column',
      display: 'flex',
    },
    image: {
      width: 25,
      height: 25,
      alignSelf: 'center',
    },
  });

  useEffect(() => {
    setFilterField('');
    setFilterFieldDateMask('');
  }, [selectFilter]);

  const MyDocument = () => {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.table}>
            <View style={styles.flexBetween}>
              {office?.logo_url && (
                <Image style={styles.image} src={office?.logo_url} />
              )}
              <TextPDF style={styles.tableTitle}>{office?.name}</TextPDF>
            </View>

            <TextPDF style={styles.tableSubTitle}>Lista de Apoiadores</TextPDF>

            <View style={styles.tableContainer}>
              <View style={styles.rowTitle}>
                <TextPDF style={styles.voter}>Apoiador</TextPDF>
                <TextPDF style={styles.reference}>Referência</TextPDF>
                <TextPDF style={styles.cellphone}>Telefone</TextPDF>
              </View>

              {data.map((pageItem) => {
                return (
                  <View
                    style={
                      pageItem?.id === data[data.length - 1]?.id
                        ? styles.finalRow
                        : styles.row
                    }
                    key={pageItem.id}
                  >
                    <TextPDF style={styles.voter}>{pageItem?.name}</TextPDF>
                    <TextPDF style={styles.reference}>
                      {pageItem?.reference}
                    </TextPDF>
                    <TextPDF style={styles.cellphone}>
                      {pageItem?.cellphone}
                    </TextPDF>
                  </View>
                );
              })}
            </View>
          </View>
        </Page>
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
        <AlertDialogOverlay>
          <AlertDialogContent mx="12px">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Deseja excluir este apoiador?
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
        </AlertDialogOverlay>
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

          {/* <ModalBody>
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
					</ModalBody> */}

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
          Apoiador
          {loading && (
            <Spinner color={office?.primary_color} ml="4" size="sm" />
          )}
        </Text>
        {role?.eleitor_page > 1 && (
          <Button
            onClick={() => navigate('/eleitor/registrar-eleitor')}
            w={['160px', '280px']}
          >
            Cadastrar apoiador
          </Button>
        )}
      </Flex>
      <Text mt="36px" color="gray.500">
        Filtrar por:
      </Text>
      <Flex justifyContent="space-between" flexDir={['column', 'row']}>
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
            {voterPage.map((voter) => {
              return (
                <option key={voter?.key} value={voter?.value}>
                  {voter?.label}
                </option>
              );
            })}
          </Select>

          {selectFilter === 'birthdate' ? (
            <Input
              maxW="600px"
              name="filterField"
              type="tel"
              inputMode="numeric"
              onKeyPress={(e) => {
                if (!/\d/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              placeholder="Buscar"
              value={filterFieldDateMask}
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
              {role?.demandas_page > 1 && <Th color="gray.600"></Th>}
              <Th color="gray.600">Nome</Th>
              <Th color="gray.600">Referência</Th>
              <Th color="gray.600">Telefone</Th>
              <Th color="gray.600">Nascimento</Th>
              <Th color="gray.600">E-mail</Th>
              <Th color="gray.600">Criador</Th>
              <Th color="gray.600">Demandas</Th>
              <Th color="gray.600">Endereço</Th>
              {role?.eleitor_page > 1 && (
                <Th textAlign="center" color="gray.600" w="8">
                  Ações
                </Th>
              )}
            </Tr>
          </Thead>
          <Tbody>
            {data.length > 0 ? (
              data.map((voter) => {
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
                        '-'
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
                      {voter?.birthdate
                        ? getFormatDate(
                            new Date(voter?.birthdate),
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
                      {voter?.email ? voter?.email : '-'}
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
                    <Td
                      color="gray.600"
                      fontSize="14px"
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor="gray.300"
                      py="4px"
                      textAlign="center"
                    >
                      {voter?.tasks?.length}
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
                <Td fontSize={'14px'} w="100%">
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

      <Flex alignItems="center" justifyContent="center">
        <Pagination
          currentPage={page}
          perPage={perPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </Flex>
    </HeaderSideBar>
  );
}
