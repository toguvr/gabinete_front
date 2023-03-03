import { Flex, Image, Text } from '@chakra-ui/react';
import NotPermission from '../assets/notPermission.png';
import HeaderSideBar from '../components/HeaderSideBar';

export default function NotFound() {
  return (
    <HeaderSideBar>
      <Flex flexDir={'column'} alignItems="center" justifyContent="center" height="100%">
        <Image src={NotPermission} boxSize="large" />
        <Text color="gray.500" mt="42px">
          Você não tem permissão para acessar esta página
        </Text>
      </Flex>
    </HeaderSideBar>
  );
}
