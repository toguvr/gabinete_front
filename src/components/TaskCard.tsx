import {
  Heading,
  Avatar,
  Box,
  Center,
  Text,
  Stack,
  Button,
  Link,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { TaskProps } from '../dtos';
import { Flex } from '@chakra-ui/react';

interface TaskCardProps {
  task: TaskProps;
}

export default function SocialProfileSimple({ task }: TaskCardProps) {
  return (
    <Center py={4}>
      <Box w={'full'} bg={useColorModeValue('white', 'gray.900')} textAlign={'center'}>
        <Heading p="0 12px" textAlign="start" fontSize="16px" fontFamily={'body'} mb={2}>
          {task.title}
        </Heading>
        <Flex justifyContent="space-between" mb={8}>
          <Text p="0 12px" textAlign="start" fontWeight={600} color={'gray.500'}>
            Eleitor: {task.voterId}
          </Text>
          <Text p="0 12px" textAlign="start" fontWeight={600} color={'gray.500'}>
            Prazo: {task.deadline}
          </Text>
        </Flex>
        <Text textAlign={'center'} color={useColorModeValue('gray.700', 'gray.400')} px={3}>
          {task.description}
        </Text>
      </Box>
    </Center>
  );
}
