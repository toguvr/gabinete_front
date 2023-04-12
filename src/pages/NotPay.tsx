import { Flex, Text, Image } from '@chakra-ui/react';
import NotPayImage from '../assets/notpay.png';

export default function NotPay() {
  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      flexDirection={'column'}
      bg="linear-gradient(180deg, #0084DE 0%, #004279 100%)"
    >
      <Flex
        bg="white"
        w={['320px', '500px']}
        py="64px"
        px={['24px', '24px', '60px']}
        align="center"
        justify="center"
        flexDir={'column'}
        borderRadius="4px"
      >
        <Image src={NotPayImage} alt="Imagem de atenção" />
        <Text fontSize={'16px'} color="gray.500" mt="16px">
          O pagamento do seu plano não foi identificado. Peça ao proprietário do
          Gabinete para regularizar.
        </Text>
      </Flex>
    </Flex>
  );
}
