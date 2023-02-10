import { DeleteIcon } from '@chakra-ui/icons';
import { Box, Heading, IconButton, Text } from '@chakra-ui/react';
import { TaskModel } from './Kanban';

interface TaskProps {
  index: number;
  task: TaskModel;
}
export default function Task({ index, task }: TaskProps) {
  return (
    <Box bg={task.color} as="div" borderRadius="md" boxShadow="md" padding="20px" margin="10px">
      <IconButton
        aria-label="Delete task"
        position="absolute"
        top={0}
        transition="all 0.2s"
        left={0}
        icon={<DeleteIcon />}
        opacity={0}
        _groupHover={{ opacity: 1 }}
      />
      <Heading as="h3" size="md">
        {task.title}
      </Heading>
      <Text>{task.description}</Text>
      <Text>{task.owner}</Text>
    </Box>
  );
}
