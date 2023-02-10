import { Box, Container, Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import TaskColumn from './TaskColumn';
import { KanbanColumns } from '../utils/enums';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function Kanban() {
  return (
    <>
      <Heading textAlign="center" padding="20px">
        Tarefas
      </Heading>
      <Flex bg="white" flex={1} height="100%" width="100%" px={5} py={10}>
        <DndProvider backend={HTML5Backend}>
          <SimpleGrid columns={{ base: 1, md: 4 }}>
            <TaskColumn column={KanbanColumns.TODO} />
            <TaskColumn column={KanbanColumns.DOING} />
            <TaskColumn column={KanbanColumns.BLOCKED} />
            <TaskColumn column={KanbanColumns.DONE} />
          </SimpleGrid>
        </DndProvider>
      </Flex>
    </>
  );
}
