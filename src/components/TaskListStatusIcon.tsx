import { Select } from '@chakra-ui/react';
import { useState } from 'react';

interface TaskListStatusIconProps {
  status: string;
  statusChange: (status: string, id: string) => void;
  buttonId: string;
}

export default function TaskListStatusIcon({
  status,
  statusChange,
  buttonId,
}: TaskListStatusIconProps) {
  const [statusButton, setStatusButton] = useState(status);

  function handleStatusChange(status: string) {
    setStatusButton(status);
  }
  const BUTTONPROPS = {
    BACKLOG: {
      bg: 'gray.100',
      text: 'Backlog',
      color: 'gray.500',
      hover: 'gray.200',
    },
    FAZENDO: {
      bg: 'yellow.100',
      text: 'Fazendo',
      color: 'yellow.600',
      hover: 'yellow.200',
    },
    CONCLUIDO: {
      bg: 'green.100',
      text: 'Concluído',
      color: 'green.600',
      hover: 'green.200',
    },
  };

  return (
    <Select
      onChange={(e) => (handleStatusChange(e.target.value), statusChange(e.target.value, buttonId))}
      fontSize={{ base: '12px', md: '14px', lg: '16px' }}
      variant="outline"
      value={status}
      _hover={{ bg: `${BUTTONPROPS[statusButton as keyof typeof BUTTONPROPS]['hover']}` }}
      w={[12, 32, 36]}
      h="26px"
      bg={BUTTONPROPS[statusButton as keyof typeof BUTTONPROPS]['bg']}
    >
      <option value={'BACKLOG'}>Backlog</option>
      <option value={'FAZENDO'}>Fazendo</option>
      <option value={'CONCLUIDO'}>Concluído</option>
    </Select>
  );
}
