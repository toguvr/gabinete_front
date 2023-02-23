import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import Button from '../components/Form/Button';
import HeaderSideBar from '../components/HeaderSideBar';
import TaskCard from '../components/TaskCard';
import TaskListStatusIcon from '../components/TaskListStatusIcon';
import { useAuth } from '../contexts/AuthContext';
import { TaskPropsDTO } from '../dtos';
import api from '../services/api';

export default function Tarefa() {
  const [selectedTask, setSelectedTask] = useState({} as TaskPropsDTO);
  const [taskList, setTaskList] = useState<TaskPropsDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  async function getOfficeList() {
    setTaskList([] as TaskPropsDTO[]);

    setLoading(true);
    try {
      const response = await api.get(`/task/office/${auth.office.id}/responsible`);
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
          console.log('task.status', task.status);
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

      // getOfficeList();
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
      <Flex
        height="100%"
        width="100%"
        flexDir="column"
        bg="gray.100"
        justifyContent="space-between"
        position="relative"
      >
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent p={6} alignSelf="center" justifyItems="center">
            <ModalHeader color="blue.600" textAlign="center" py={2}>
              Título da Demanda
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
        <TableContainer padding={2}>
          <Table fontSize={{ base: '10px', md: '12px', lg: '14px' }} size="md">
            <Thead>
              <Tr bg="blue.600">
                <Th
                  fontSize={{ base: '10px', md: '12px', lg: '14px' }}
                  maxW={[1]}
                  color="white"
                  textAlign="center"
                >
                  Id
                </Th>
                <Th
                  fontSize={{ base: '10px', md: '12px', lg: '14px' }}
                  color="white"
                  textAlign="center"
                >
                  Status
                </Th>
                <Th
                  fontSize={{ base: '10px', md: '12px', lg: '14px' }}
                  color="white"
                  textAlign="center"
                >
                  Título
                </Th>

                <Th
                  fontSize={{ base: '10px', md: '12px', lg: '14px' }}
                  maxW={[1, 4, 4]}
                  color="white"
                  textAlign="center"
                  flexWrap="wrap"
                  p={0}
                >
                  Foco
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {taskList.map((task) => (
                <Tr key={task.id} bg="white">
                  <Td
                    onClick={() => handleSelectTask(task.id)}
                    fontWeight="bold"
                    textAlign="center"
                  >
                    {task.id}
                  </Td>
                  <Td
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDir="column"
                    flex="1"
                    h="56px"
                  >
                    <TaskListStatusIcon
                      buttonId={task.id}
                      statusChange={statusChange}
                      status={task.status}
                    />
                  </Td>
                  <Td
                    onClick={() => handleSelectTask(task.id)}
                    overflow="hidden"
                    h="56px"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                    maxW={[1, 4, 32]}
                    textAlign="center"
                    p={0}
                  >
                    {task.title}
                  </Td>

                  <Td
                    onClick={() => handleSelectTask(task.id)}
                    h="56px"
                    textAlign="center"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {task.priority}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </HeaderSideBar>
  );
}
