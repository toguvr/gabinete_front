import {
  Box,
  Checkbox,
  Flex,
  Icon,
  IconButton,
  Select,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { FormEvent, useEffect, useState } from 'react';
import { IoLogoWhatsapp, IoSearchSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import Input from '../components/Form/Input';
import HeaderSideBar from '../components/HeaderSideBar';
import Pagination from '../components/Pagination';
import { useAuth } from '../contexts/AuthContext';
import { VoterDTO } from '../dtos';
import { useDebounce } from '../hooks/useDebounce';
import api from '../services/api';
import { convertDateFormat } from '../utils/convertDateFormat';
import { messagingPage } from '../utils/filterTables';
import Button from '../components/Form/Button';

export default function Messaging() {
  const toast = useToast();
  const [values, setValues] = useState({
    message: '',
    voterMessages: [],
  } as {
    message: string;
    voterMessages: string[];
  });
  const [phonesToSendMessage, setPhonesToSendMessage] = useState<string[]>([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterFieldDateMask, setFilterFieldDateMask] = useState('');
  const [data, setData] = useState([] as VoterDTO[]);
  const { office } = useAuth();
  const [selectFilter, setSelectFilter] = useState('name');
  const [filterField, setFilterField] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const debouncedValue = useDebounce(filterFieldDateMask || filterField, 500);

  const perPage = 20;

  const getVoterList = async (currentPage = 1) => {
    setData([] as VoterDTO[]);

    setLoading(true);
    try {
      const filterMapping = {
        voter: 'voter.name',
        creator: 'creator.name',
        city: 'city',
        neighborhood: 'neighborhood',
      };

      const currentFilter =
        filterMapping[selectFilter as keyof typeof filterMapping] ||
        selectFilter;

      const response = await api.get(`/voter/office/${office.id}`, {
        params: {
          page: currentPage,
          quantity: perPage,
          field: currentFilter,
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

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const body = phonesToSendMessage.map((phone) => ({
        message: values.message,
        phone,
      }));

      // await api.post(`/whatsapp/message/${office.id}/bulk`, body);

      toast({
        title: 'Mensagem enviada',
        description: 'Sua mensagem foi enviada com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (err) {
      toast({
        title:
          'Ocorreu um erro ao enviar sua mensagem, tente novamente mais tarde',
        status: 'error',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckAllChange = (isChecked: boolean) => {
    setIsAllChecked(isChecked);

    if (isChecked) {
      const allPhones = data.map((voter) => voter.cellphone);
      const newPhones = allPhones.filter(
        (phone) => !phonesToSendMessage.includes(phone)
      );
      setPhonesToSendMessage([...phonesToSendMessage, ...newPhones]);
    } else {
      const filteredPhones = phonesToSendMessage.filter(
        (phone) => !data.some((voter) => voter.cellphone === phone)
      );
      setPhonesToSendMessage(filteredPhones);
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

  const handleCheckboxChange = (cellphone: string, isChecked: boolean) => {
    let updatedPhonesToSendMessage = [...phonesToSendMessage];

    if (isChecked && !phonesToSendMessage.includes(cellphone)) {
      updatedPhonesToSendMessage.push(cellphone);
    } else if (!isChecked) {
      updatedPhonesToSendMessage = updatedPhonesToSendMessage.filter(
        (phone) => phone !== cellphone
      );
    }

    setPhonesToSendMessage(updatedPhonesToSendMessage);
    setIsAllChecked(updatedPhonesToSendMessage.length === data.length);
  };

  useEffect(() => {
    getVoterList(page);
    setIsAllChecked(false);
  }, [page, debouncedValue]);

  useEffect(() => {
    setPage(1);
  }, [debouncedValue]);

  useEffect(() => {
    setFilterField('');
    setFilterFieldDateMask('');
  }, [selectFilter]);

  return (
    <HeaderSideBar>
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
            Mensageria
            {loading && (
              <Spinner color={office?.primary_color} ml="4" size="sm" />
            )}
          </Text>
          <Button onClick={handleSendMessage} w={['160px', '280px']}>
            {isSubmitting ? <Spinner color="white" /> : 'Enviar mensagem'}
          </Button>
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
              {messagingPage.map((voter) => {
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
            <Button
              w="300px"
              bg="red.500"
              _hover={{
                bg: 'red.500',
                opacity: '80%',
                _disabled: {
                  opacity: '40%',
                },
              }}
              onClick={() => {
                setValues({ ...values, message: '', voterMessages: [] });
                setPhonesToSendMessage([]);
                setIsAllChecked(false);
              }}
              isDisabled={
                phonesToSendMessage.length === 0 && values.message === ''
              }
            >
              Remover alterações
            </Button>
          </Flex>
        </Flex>

        <Box mb={4}>
          <Text mb="8px" color="gray.500">
            Mensagem
          </Text>
          <Textarea
            value={values.message}
            onChange={(e) => setValues({ ...values, message: e.target.value })}
            borderColor="gray.500"
            placeholder="Deixe aqui sua mensagem"
            borderRadius={6}
            size="sm"
          />
        </Box>
        <Box
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
                <Th color="gray.600">
                  <Checkbox
                    isChecked={isAllChecked}
                    onChange={(e) => handleCheckAllChange(e.target.checked)}
                  />
                </Th>
                <Th color="gray.600">Nome</Th>
                <Th color="gray.600">Telefone</Th>
                <Th color="gray.600">Endereço</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.length > 0 ? (
                data.map((voter) => {
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
                        <Checkbox
                          isChecked={phonesToSendMessage.includes(
                            voter.cellphone
                          )}
                          onChange={(e) =>
                            handleCheckboxChange(
                              voter.cellphone,
                              e.target.checked
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
      </Flex>
    </HeaderSideBar>
  );
}
