import { Box, Container, Flex, Heading } from '@chakra-ui/react';

export enum KanbanColumns {
  TODO = 'A fazer',
  DOING = 'Fazendo',
  BLOCKED = 'Impedimento',
  DONE = 'Completa',
}

export interface TaskModel {
  id: string;
  title: string;
  description: string;
  column: KanbanColumns;
  color: string;
  priority: number;
  owner: string;
  responsible: string;
}

export default function Kanban() {
  return (
    <>
      <Heading textAlign="center" padding="20px">
        Tarefas
      </Heading>
      <Flex bg="pink" flex={1} height="100%" width="100%" px={5} py={10}></Flex>
    </>
  );
}
