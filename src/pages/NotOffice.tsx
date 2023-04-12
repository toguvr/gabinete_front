import { Flex, Text, Image, Button } from '@chakra-ui/react';
import NotOfficeImage from '../assets/notOffice.png';
import { useNavigate } from 'react-router-dom';

export default function NotOffice() {
  const navigate = useNavigate();

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      flexDirection={'column'}
      bg="linear-gradient(180deg, #0084DE 0%, #004279 100%)"
      px={['16px', 0]}
    >
      <Flex
        bg="white"
        py="64px"
        px={['24px', '24px', '120px']}
        align="center"
        justify="center"
        flexDir={'column'}
        borderRadius="4px"
      >
        <Image src={NotOfficeImage} alt="Imagem de atenção" />
        <Text fontSize={'16px'} color="gray.500" mt="16px" textAlign={'center'}>
          Você não está vinculado a nenhum gabinete.
        </Text>
        <Button
          onClick={() => navigate('/cadastrar-gabinete')}
          bg={'blue.600'}
          color={'white'}
          _hover={{
            bg: 'blue.700',
          }}
          mt="20px"
          w={['240px', '372px']}
        >
          Cadastre seu Gabinete
        </Button>
      </Flex>
    </Flex>
  );
}
