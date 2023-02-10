import { DeleteIcon } from '@chakra-ui/icons';
import { Box, Heading, IconButton, Text, Textarea } from '@chakra-ui/react';
import { useTaskDragAndDrop } from '../hooks/useTaskDragAndDrop';
import { TaskModel } from '../utils/models';

interface TaskProps {
  index: number;
  task: TaskModel;
  onUpdate: (id: TaskModel['id'], updatedTask: TaskModel) => void;
  onDelete: (id: TaskModel['id']) => void;
}
export default function Task({
  index,
  task,
  onUpdate: handleUpdate,
  onDelete: handleDelete,
}: TaskProps) {
  const { ref, isDragging } = useTaskDragAndDrop<HTMLDivElement>({ task, index });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    handleUpdate(task.id, { ...task, title: newTitle });
  };

  function handleDeleteClick() {
    handleDelete(task.id);
  }
  return (
    <Box
      position="relative"
      bg={task.color}
      as="div"
      borderRadius="md"
      boxShadow="md"
      padding="20px"
      margin="10px"
      role="group"
    >
      <IconButton
        aria-label="Delete task"
        position="absolute"
        top={0}
        right={0}
        transition="all 0.2s"
        bg="transparent"
        icon={<DeleteIcon />}
        opacity={0}
        _groupHover={{ opacity: 1 }}
        onClick={handleDeleteClick}
      />
      <Textarea
        value={task.title}
        cursor="inherit"
        border="none"
        bg="transparent"
        p={0}
        resize="none"
        focusBorderColor="none"
        onChange={handleTitleChange}
      />

      <Text>{task.description}</Text>
      <Text>{task.owner}</Text>
    </Box>
  );
}
