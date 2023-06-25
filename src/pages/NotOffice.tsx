import { Flex, Text, Image, Button } from '@chakra-ui/react';
import NotOfficeImage from '../assets/notOffice.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function NotOffice() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const handleSignOut = () => {
    signOut();
    navigate('/');
  };
  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      flexDirection={'column'}
      bg="linear-gradient(180deg, #265B5A 0%, #073431 100%)"
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
          bg={'#00A39C'}
          color={'white'}
          _hover={{
            bg: '#265B5A',
          }}
          mt="20px"
          w={['240px', '372px']}
        >
          Cadastre seu Gabinete
        </Button>
        <Button
          onClick={handleSignOut}
          bg={'transparent'}
          border={'1px solid'}
          borderColor={'#00A39C'}
          color={'#00A39C'}
          _hover={{
            bg: '#265B5A',
            color: 'white',
          }}
          mt="20px"
          w={['240px', '372px']}
        >
          Voltar
        </Button>
      </Flex>
    </Flex>
  );
}
