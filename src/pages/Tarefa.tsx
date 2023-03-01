import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Icon,
  Text,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Select,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import Button from '../components/Form/Button';
import HeaderSideBar from '../components/HeaderSideBar';
import TaskCard from '../components/TaskCard';
import TaskListStatusIcon from '../components/TaskListStatusIcon';
import { useAuth } from '../contexts/AuthContext';
import { StateProps, TaskPropsDTO } from '../dtos';
import api from '../services/api';
import { IoSearchSharp } from 'react-icons/io5';
import Input from '../components/Form/Input';
import { taskPage } from '../utils/filterTables';

export default function Tarefa() {
  const [selectedTask, setSelectedTask] = useState({} as TaskPropsDTO);
  const [taskList, setTaskList] = useState<TaskPropsDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const [filterField, setFilterField] = useState('');
  const [errors, setErrors] = useState({} as StateProps);
  const [selectFilter, setSelectFilter] = useState('title');

  async function getOfficeList() {
    setTaskList([] as TaskPropsDTO[]);

    setLoading(true);
    try {
      const response = await api.get(`/task/office/${auth.office.id}/responsible`);
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

  async function statusChange(statusChange: string, id: string) {
    try {
      const response = await api.put(`/task/status/responsible`, {
        status: statusChange,
        taskId: String(id),
      });
      const taskListUpdated = taskList.map((task) => {
        if (task.id === id) {
          task.status = statusChange;
        }
        return task;
      });

      taskListUpdated.sort((a, b) => {
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

      setTaskList(taskListUpdated);
    } catch (err) {
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

          <ModalFooter display="flex" alignItems="center" justifyContent="center">
            <Button alignSelf="center" onClick={onClose} w="85px">
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex flexDirection="column">
        <Text mt="36px" color="gray.500">
          Filtrar por:
        </Text>
        <Flex height="40px">
          <Flex flex={1} gap={['12px', '24px']}>
            <Select
              w="220px"
              borderColor="gray.500"
              name="filterType"
              value={selectFilter}
              onChange={(e) => {
                setSelectFilter(e.target.value);
              }}
            >
              {taskPage.map((task) => {
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
              rightIcon={<Icon color="gray.500" fontSize="20px" as={IoSearchSharp} />}
            />
          </Flex>
        </Flex>

        <TableContainer marginTop="40px" padding={2}>
          <Table>
            <Thead
              position="sticky"
              top="0px"
              background="white"
              borderBottomWidth={'4px'}
              borderBottomStyle="solid"
              borderBottomColor={'gray.300'}
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
                  Foco
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {Array.isArray(taskList) && taskList.length > 0 ? (
                taskList
                  .filter((currentValue: any) => {
                    switch (selectFilter) {
                      case 'title':
                        if (filterField?.length >= 3) {
                          return (
                            currentValue?.title.toLowerCase().indexOf(filterField?.toLowerCase()) >
                            -1
                          );
                        } else {
                          return currentValue;
                        }
                      case 'status':
                        if (filterField?.length >= 3) {
                          return (
                            currentValue?.status.toLowerCase().indexOf(filterField?.toLowerCase()) >
                            -1
                          );
                        } else {
                          return currentValue;
                        }
                      case 'priority':
                        if (filterField?.length >= 3) {
                          return (
                            currentValue?.priority
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
                  .map((task) => (
                    <Tr key={task.id} bg="white" cursor={'pointer'}>
                      <Td
                        onClick={() => {
                          handleSelectTask(task.id);
                        }}
                        color="gray.600"
                        fontSize="14px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                        py="4px"
                        textAlign="center"
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
                        h="56px"
                      >
                        <div
                          style={{
                            alignSelf: 'center',
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          <TaskListStatusIcon
                            buttonId={task.id}
                            statusChange={statusChange}
                            status={task.status}
                          />
                        </div>
                      </Td>
                      <Td
                        onClick={() => {
                          handleSelectTask(task.id);
                        }}
                        color="gray.600"
                        fontSize="14px"
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor="gray.300"
                        py="4px"
                        textAlign="center"
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
                      >
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
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
                    </Tr>
                  ))
              ) : (
                <Tr>Nenhuma tarefa encontrada</Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </HeaderSideBar>
  );
}
