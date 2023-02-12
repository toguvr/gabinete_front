import {
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { useState } from 'react';
import HeaderSideBar from '../components/HeaderSideBar';
import TaskListStatusIcon from '../components/TaskListStatusIcon';
import { useDisclosure } from '@chakra-ui/react';
import TaskCard from '../components/TaskCard';
import { TaskProps } from '../dtos';

export default function Tarefa() {
  const [tasksList, setTasksList] = useState<TaskProps[]>([
    {
      id: '1',
      title: 'Ajudar com Cirurgia de Catarata',
      description:
        'Essa e uma descricao aleatoria de alguma task que vai ser atribuida a um assessor por um politico qualquer',
      createdAt: '15/012/2022',
      deadline: '10/03/2023',
      doneDate: '10/03/2023',
      status: '1',
      priority: 'Alta',
      responsible: 'João da Silva',
      creator: 'Maria da Silva',
      office: 'Munir',
      files: 'asd',
      voterId: '123',
    },
    {
      id: '2',
      title: 'Ajudar com Cirurgia de Catarata',
      description:
        'Essa e uma descricao aleatoria de alguma task que vai ser atribuida a um assessor por um politico qualquer',
      createdAt: '15/012/2022',
      deadline: '10/03/2023',
      doneDate: '10/03/2023',
      status: '3',
      priority: 'Alta',
      responsible: 'João da Silva',
      creator: 'Maria da Silva',
      office: 'Munir',
      files: 'asd',
      voterId: '123',
    },
    {
      id: '3',
      title: 'Ajudar com Cirurgia de Catarata',
      description:
        'Essa e uma descricao aleatoria de alguma task que vai ser atribuida a um assessor por um politico qualquer',
      createdAt: '15/012/2022',
      deadline: '10/03/2023',
      doneDate: '10/03/2023',
      status: '1',
      priority: 'Alta',
      responsible: 'João da Silva',
      creator: 'Maria da Silva',
      office: 'Munir',
      files: 'asd',
      voterId: '123',
    },
    {
      id: '4',
      title: 'Ajudar com Cirurgia de Catarata',
      description:
        'Essa e uma descricao aleatoria de alguma task que vai ser atribuida a um assessor por um politico qualquer',
      createdAt: '15/012/2022',
      deadline: '10/03/2023',
      doneDate: '10/03/2023',
      status: '2',
      priority: 'Alta',
      responsible: 'João da Silva',
      creator: 'Maria da Silva',
      office: 'Munir',
      files: 'asd',
      voterId: '123',
    },
  ]);
  const [selectedTask, setSelectedTask] = useState<TaskProps>({} as TaskProps);

  function statusChange(statusChange: string, id: string) {
    console.log('newStatus: ', statusChange, 'id: ', id);
    const newTasksList = tasksList.map((task) => {
      if (task.id === id) {
        task.status = statusChange;
      }
      return task;
    });
    setTasksList(newTasksList);
  }

  function handleSelectTask(id: string) {
    const selectedTaskByUser = tasksList.find((task) => task.id === id);
    setSelectedTask(selectedTaskByUser as TaskProps);
    onOpen();
  }

  const { isOpen, onOpen, onClose } = useDisclosure();

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
          <ModalContent alignSelf="center" justifyItems="center">
            <ModalHeader py={2}>Tarefa</ModalHeader>
            <ModalCloseButton />

            <ModalBody bg="white" p={0} m={0}>
              <TaskCard task={selectedTask} />
            </ModalBody>

            <ModalFooter py={2}>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
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
                  display="flex"
                  flex={1}
                  textAlign="start"
                >
                  Título
                </Th>

                <Th
                  fontSize={{ base: '10px', md: '12px', lg: '14px' }}
                  maxW={[1, 4, 4]}
                  color="white"
                  textAlign="center"
                  p={0}
                >
                  Prioridade
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {tasksList.map((task) => (
                <Tr key={task.id} bg="white">
                  <Td
                    onClick={() => handleSelectTask(task.id)}
                    h="56px"
                    maxW={[1]}
                    fontWeight="bold"
                    textAlign="center"
                  >
                    41523
                  </Td>
                  <Td
                    p={0}
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
                    textAlign="start"
                    p={0}
                  >
                    {task.title}
                  </Td>

                  <Td
                    onClick={() => handleSelectTask(task.id)}
                    h="56px"
                    maxW={[1, 4, 4]}
                    textAlign="center"
                  >
                    {task.priority}
                  </Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th></Th>
                <Th></Th>
                <Th></Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </Flex>
    </HeaderSideBar>
  );
}