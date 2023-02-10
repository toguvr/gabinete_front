import { AddIcon } from '@chakra-ui/icons';
import { Badge, Box, Heading, IconButton, Stack } from '@chakra-ui/react';

import Task from './Task';
import { KanbanColumns } from '../utils/enums';
import useColumnTasks from '../hooks/useColumnTask';

const mockTasks = [
  {
    id: 1,
    title: 'Task 1',
    description: 'Description 1',
    column: KanbanColumns.TODO,
    color: 'red',
    priority: 1,
    owner: 'Owner 1',
    responsible: 'Responsible 1',
  },
  {
    id: 2,
    title: 'Task 2',
    description: 'Description 2',
    column: KanbanColumns.TODO,
    color: 'yellow',
    priority: 2,
    owner: 'Owner 2',
    responsible: 'Responsible 2',
  },
  {
    id: 3,
    title: 'Task 3',
    description: 'Description 3',
    column: KanbanColumns.TODO,
    color: 'green',
    priority: 3,
    owner: 'Owner 3',
    responsible: 'Responsible 3',
  },
];

export default function TaskColumn({ column }: { column: KanbanColumns }) {
  const { tasks, addEmptyTask, updateTask, deleteTask } = useColumnTasks(column);
  const ColumnTasks = tasks.map((task, index) => (
    <Task key={task.id} index={index} task={task} onDelete={deleteTask} onUpdate={updateTask} />
  ));
  return (
    <Box bg="gray.100" as="div" borderRadius="md" boxShadow="md" padding="20px" margin="10px">
      <Heading as="h2" size="md">
        <Badge p={1} rounded="lg">
          {column}
        </Badge>
      </Heading>
      <IconButton
        size="xs"
        w="full"
        color="black"
        bgColor="white"
        p={1}
        variant="solid"
        aria-label="add_task"
        icon={<AddIcon />}
        onClick={addEmptyTask}
      />
      <Stack
        direction={{ base: 'row', md: 'column' }}
        h={{ base: 300, md: 600 }}
        p={4}
        mt={2}
        spacing={4}
        bg="white"
        boxShadow="md"
        overflow="auto"
        rounded="lg"
      >
        {ColumnTasks}
      </Stack>
    </Box>
  );
}
