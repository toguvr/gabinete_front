import {
  Box,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { IoSearchSharp } from 'react-icons/io5';
import Button from '../components/Form/Button';
import Input from '../components/Form/Input';
import HeaderSideBar from '../components/HeaderSideBar';
import TaskCard from '../components/TaskCard';
import TaskListStatusIcon from '../components/TaskListStatusIcon';
import { useAuth } from '../contexts/AuthContext';
import { StateProps, TaskPropsDTO } from '../dtos';
import api from '../services/api';
import { taskPage } from '../utils/filterTables';

export default function Tarefa() {
  const [selectedTask, setSelectedTask] = useState({} as TaskPropsDTO);
  const [taskList, setTaskList] = useState<TaskPropsDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const { office } = useAuth();
  const [filterField, setFilterField] = useState('');
  const [filters, setFilters] = useState([
    { filterType: 'title', filterValue: '' },
  ]);
  const [errors, setErrors] = useState({} as StateProps);
  const [selectFilter, setSelectFilter] = useState('title');

  const addFilter = () => {
    setFilters([...filters, { filterType: 'title', filterValue: '' }]);
  };

  const handleFilterChange = (
    index: number,
    field: 'filterType' | 'filterValue',
    value: string
  ) => {
    const newFilters = [...filters];
    newFilters[index][field] = value;
    setFilters(newFilters);
  };

  async function getOfficeList() {
    setTaskList([] as TaskPropsDTO[]);

    setLoading(true);
    try {
      const response = await api.get(
        `/task/office/${auth.office.id}/responsible`
      );
      response.data.sort((a: any, b: any) => {
        if (a.status === 'BACKLOG') {
          return -1;
        }
        if (a.status === 'FAZENDO' && b.status === 'BACKLOG') {
          return 1;
        }
        if (a.status === 'FAZENDO' && b.status === 'CONCLUIDO') {
          return -1;
        }
        if (a.status === 'CONCLUIDO') {
          return 1;
        }
        return 0;
      });
      setTaskList(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  const filterTasks = (tasks: any) => {
    return tasks.filter((task: any) => {
      return filters.every(({ filterType, filterValue }) => {
        if (!filterValue) return true;
        switch (filterType) {
          case 'id':
            return task.id
              .toString()
              .toLowerCase()
              .includes(filterValue.toLowerCase());
          case 'title':
            return task.title.toLowerCase().includes(filterValue.toLowerCase());
          case 'status':
            return task.status
              .toLowerCase()
              .includes(filterValue.toLowerCase());
          case 'priority':
            return task.priority
              .toLowerCase()
              .includes(filterValue.toLowerCase());
          case 'voter':
            return task.voter?.name
              .toLowerCase()
              .includes(filterValue.toLowerCase());
          default:
            return true;
        }
      });
    });
  };

  async function statusChange(statusChange: string, id: string) {
    try {
      const taskListUpdated = taskList.map((task) => {
        if (task.id === id) {
          task.status = statusChange;
        }
        return task;
      });

      setTaskList(taskListUpdated);
      await api.put(`/task/status/responsible`, {
        status: statusChange,
        taskId: String(id),
      });
    } catch (err) {
      getOfficeList();
    } finally {
      setLoading(false);
    }
  }

  function handleSelectTask(id: string) {
    const selectedTaskByUser = taskList.find((task) => task.id === id);
    setSelectedTask(selectedTaskByUser as TaskPropsDTO);
    onOpen();
  }

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (auth.office.id) {
      getOfficeList();
    }
  }, [auth.office.id]);

  useEffect(() => {
    setFilterField('');
  }, [selectFilter]);

  return (
    <HeaderSideBar>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent p={6} alignSelf="center" justifyItems="center">
          <ModalHeader color="blue.600" textAlign="center" py={2}>
            {selectedTask.title}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody bg="white" p={0} m={0}>
            <TaskCard task={selectedTask} />
          </ModalBody>

          <ModalFooter
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Button alignSelf="center" onClick={onClose} w="85px">
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex flexDirection="column">
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
            Tarefa
            {loading && (
              <Spinner color={office?.primary_color} ml="4" size="sm" />
            )}
          </Text>
          <Button onClick={getOfficeList} w={['160px', '280px']}>
            Atualizar
          </Button>
        </Flex>
        <Text mt="36px" color="gray.500">
          Filtrar por:
        </Text>

        <Flex direction="column" gap={4}>
          {filters.map((filter, index) => (
            <Flex key={index} gap={2}>
              <Select
                w="220px"
                value={filter.filterType}
                onChange={(e) =>
                  handleFilterChange(index, 'filterType', e.target.value)
                }
              >
                {taskPage.map((task) => (
                  <option key={task?.key} value={task?.value}>
                    {task?.label}
                  </option>
                ))}
              </Select>

              {/* Adjust the input type based on the selected filter type */}
              {filter.filterType === 'status' ? (
                <Select
                  name={`filterValue-${index}`}
                  value={filter.filterValue}
                  onChange={(e) =>
                    handleFilterChange(index, 'filterValue', e.target.value)
                  }
                  placeholder="Selecione o status"
                  maxW="600px"
                >
                  <option value="BACKLOG">Pendente</option>
                  <option value="FAZENDO">Executando</option>
                  <option value="CONCLUIDO">Concluído</option>
                </Select>
              ) : filter.filterType === 'priority' ? (
                <Select
                  name={`filterValue-${index}`}
                  value={filter.filterValue}
                  onChange={(e) =>
                    handleFilterChange(index, 'filterValue', e.target.value)
                  }
                  placeholder="Selecione a prioridade"
                  maxW="600px"
                >
                  <option value="ALTA">Alta</option>
                  <option value="MEDIA">Média</option>
                  <option value="BAIXA">Baixa</option>
                </Select>
              ) : (
                <Input
                  name={`filterValue-${index}`}
                  maxW="600px"
                  type="text"
                  value={filter.filterValue}
                  placeholder="Buscar"
                  onChange={(e) =>
                    handleFilterChange(index, 'filterValue', e.target.value)
                  }
                />
              )}
            </Flex>
          ))}

          <Button onClick={addFilter} w="200px">
            Adicionar Filtro
          </Button>
        </Flex>

        <TableContainer height="35rem" overflowY="auto" padding={2}>
          <Table variant="simple">
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
                <Th
                  textAlign="center"
                  fontSize={{ base: '10px', md: '12px', lg: '14px' }}
                  color="gray.600"
                >
                  Id
                </Th>
                <Th
                  textAlign="center"
                  fontSize={{ base: '10px', md: '12px', lg: '14px' }}
                  color="gray.600"
                >
                  Status
                </Th>
                <Th
                  textAlign="center"
                  fontSize={{ base: '10px', md: '12px', lg: '14px' }}
                  color="gray.600"
                >
                  Título
                </Th>

                <Th
                  textAlign="center"
                  fontSize={{ base: '10px', md: '12px', lg: '14px' }}
                  color="gray.600"
                >
                  Prioridade
                </Th>
                <Th
                  textAlign="center"
                  fontSize={{ base: '10px', md: '12px', lg: '14px' }}
                  color="gray.600"
                >
                  Apoiador
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {Array.isArray(taskList) && taskList.length > 0 ? (
                filterTasks(taskList).map((task: any) => (
                  <Tr key={task.id} bg="white" cursor="pointer">
                    <Td
                      onClick={() => handleSelectTask(task.id)}
                      color="gray.600"
                      fontSize="14px"
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor="gray.300"
                      py="4px"
                      textAlign="center"
                      width="20%"
                    >
                      {task.id}
                    </Td>

                    <Td
                      color="gray.600"
                      fontSize="14px"
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor="gray.300"
                      py="4px"
                      textAlign="center"
                      width="20%"
                      h="56px"
                    >
                      <div
                        style={{ display: 'flex', justifyContent: 'center' }}
                      >
                        <TaskListStatusIcon
                          buttonId={task.id}
                          statusChange={statusChange}
                          status={task.status}
                        />
                      </div>
                    </Td>

                    <Td
                      onClick={() => handleSelectTask(task.id)}
                      color="gray.600"
                      fontSize="14px"
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor="gray.300"
                      py="4px"
                      textAlign="center"
                      maxWidth="600px"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {task.title}
                    </Td>

                    <Td
                      onClick={() => handleSelectTask(task.id)}
                      color={
                        task.priority === 'ALTA'
                          ? 'red.500'
                          : task.priority === 'MEDIA'
                          ? 'yellow.500'
                          : 'gray.500'
                      }
                      fontSize="14px"
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor="gray.300"
                      py="4px"
                      textAlign="center"
                      width="20%"
                    >
                      <div
                        style={{ display: 'flex', justifyContent: 'center' }}
                      >
                        <Text
                          justifyContent="center"
                          background={
                            task.priority === 'ALTA'
                              ? 'red.100'
                              : task.priority === 'MEDIA'
                              ? 'yellow.100'
                              : 'gray.100'
                          }
                          borderRadius="4px"
                          padding="4px"
                          width="80px"
                        >
                          {task.priority}
                        </Text>
                      </div>
                    </Td>

                    <Td
                      onClick={() => handleSelectTask(task.id)}
                      color="gray.600"
                      fontSize="14px"
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor="gray.300"
                      py="4px"
                      textAlign="center"
                      width="20%"
                    >
                      {task.voter?.name || 'N/A'}
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td textAlign="center" colSpan={5}>
                    Nenhuma tarefa encontrada
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </HeaderSideBar>
  );
}
