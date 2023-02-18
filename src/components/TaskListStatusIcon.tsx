import { Button, Text, Select } from "@chakra-ui/react";
import { useState } from "react";

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
    1: {
      bg: "gray.100",
      text: "Backlog",
      color: "gray.500",
      hover: "gray.200",
    },
    2: {
      bg: "yellow.100",
      text: "Fazendo",
      color: "yellow.600",
      hover: "yellow.200",
    },
    3: {
      bg: "green.100",
      text: "Concluído",
      color: "green.600",
      hover: "green.200",
    },
  };

  return (
    <Select
      onChange={(e) => (
        handleStatusChange(e.target.value),
        statusChange(e.target.value, buttonId)
      )}
      fontSize={{ base: "12px", md: "14px", lg: "16px" }}
      variant="outline"
      value={status}
      // _hover={{ bg: `${BUTTONPROPS[statusButton]['hover']}` }}
      w={[12, 32, 36]}
      h="26px"
      // bg={BUTTONPROPS[statusButton]['bg']}
    >
      <option value="1">Backlog</option>
      <option value="2">Fazendo</option>
      <option value="3">Concluído</option>
    </Select>
  );
}
