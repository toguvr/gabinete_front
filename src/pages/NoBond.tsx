import { Flex, Image, Text } from '@chakra-ui/react';
import Isolation from '../assets/isolation.png';
import HeaderSideBar from '../components/HeaderSideBar';

export default function NoBond() {
  return (
    <HeaderSideBar>
      <Flex flexDir={'column'} alignItems="center" justifyContent="center" height="100%">
        <Image src={Isolation} height={[100, 250]} />
        <Text color="gray.500" mt="42px">
          Você não possui vínculo com nenhum gabinete.
        </Text>
      </Flex>
    </HeaderSideBar>
  );
}
