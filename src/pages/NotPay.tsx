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
        <Button
          onClick={handleSignOut}
          width="100%"
          bg="blue.600"
          color="white"
          mt="24px"
          _hover={{
            bg: 'blue.700',
          }}
        >
          Voltar
        </Button>
      </Flex>
    </Flex>
  );
}
