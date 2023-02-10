import { Box, Container, Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import TaskColumn from './TaskColumn';
import { KanbanColumns } from './utils/enums';



export default function Kanban() {
  return (
    <>
      <Heading textAlign="center" padding="20px">
        Tarefas
      </Heading>
      <Flex bg="pink" flex={1} height="100%" width="100%" px={5} py={10}>
        <SimpleGrid columns={{ base: 1, md: 4 }}>
          <TaskColumn column={KanbanColumns.TODO} />
          <TaskColumn column={KanbanColumns.DOING} />
          <TaskColumn column={KanbanColumns.BLOCKED} />
          <TaskColumn column={KanbanColumns.DONE} />
        </SimpleGrid>
      </Flex>
    </>
  );
}
