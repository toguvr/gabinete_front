import { Flex, Image, Text } from '@chakra-ui/react';
import NotFound from '../assets/404.png';

export default function PageNotFound() {
  return (
    <Flex flexDir={'column'} alignItems="center" justifyContent="center" height="100vh">
      <Image src={NotFound} boxSize="large" />
      <Text color="gray.500" mt="24px">
        Página não encontrada
      </Text>
    </Flex>
  );
}
