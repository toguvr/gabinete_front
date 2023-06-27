import { Flex, Text, Image, Button } from '@chakra-ui/react';
import NotPayImage from '../assets/notpay.png';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function NotPay() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

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
        <Button
          onClick={handleSignOut}
          width="100%"
          bg="#00A39C"
          color="white"
          mt="24px"
          _hover={{
            bg: '#265B5A',
          }}
        >
          Voltar
        </Button>
      </Flex>
    </Flex>
  );
}
