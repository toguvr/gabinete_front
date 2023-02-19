import { Box, Center, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { TaskPropsDTO } from '../dtos';

interface TaskCardProps {
  task: TaskPropsDTO;
}

export default function SocialProfileSimple({ task }: TaskCardProps) {
  return (
    <Center py={4}>
      <Box w={'full'} bg={useColorModeValue('white', 'gray.900')} textAlign={'center'}>
        <Box p="12px" borderRadius="8px" m="12px" border="1px solid #D3D3D3">
          <Text textAlign={'center'} color={useColorModeValue('gray.700', 'gray.400')} px={3}>
            {task.description}
          </Text>
        </Box>

        <Box paddingLeft="6px">
          <Text marginBottom="6px" p="0 12px" textAlign="start" fontWeight={600} color={'gray.400'}>
            Eleitor: {task.voterId}
          </Text>
          <Text marginBottom="6px" p="0 12px" textAlign="start" fontWeight={600} color={'gray.400'}>
            Criado por: {task.creator}
          </Text>
          <Text marginBottom="6px" p="0 12px" textAlign="start" fontWeight={600} color={'gray.400'}>
            Criado há:{' '}
            {Math.ceil((new Date().getTime() - new Date(task.date).getTime()) / (1000 * 3600 * 24))}{' '}
            dias
          </Text>
          <Text marginBottom="6px" p="0 12px" textAlign="start" fontWeight={600} color={'gray.400'}>
            Recurso: {task.resources ? 'Sim' : 'Não'}
          </Text>
          <Text marginBottom="6px" p="0 12px" textAlign="start" fontWeight={600} color={'gray.400'}>
            Prioridade: {task.priority}
          </Text>
          <Flex flexDirection="column">
            <Text
              marginBottom="6px"
              p="0 12px"
              textAlign="start"
              fontWeight={600}
              color={'gray.400'}
            >
              Arquivo:
            </Text>
            <Text p="0 24px" textAlign="start">
              <Icon color="blue.600" fontSize="20px" as={IoDocumentTextOutline} />
            </Text>
          </Flex>
        </Box>
      </Box>
    </Center>
  );
}
