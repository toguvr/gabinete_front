import { Flex } from '@chakra-ui/react';
import HeaderSideBar from '../components/HeaderSideBar';
import Isolation from '../assets/isolation.png';
import { Image, Text } from '@chakra-ui/react';

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
