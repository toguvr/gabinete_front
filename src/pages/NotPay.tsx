import { Flex, Text, Image, Button, useToast } from '@chakra-ui/react';
import NotPayImage from '../assets/notpay.png';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';
import api from '../services/api';

const stripePromise = loadStripe(
  process.env.REACT_APP_PUBLIC_STRIPE_KEY as string
);

export default function NotPay() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { office, user, updateOffice } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // Call your backend to create the Checkout session.
      const response = await api.get(
        `/office/sessionPayment/${office.id}
        `
        // ?${
        //   couponChecked?.id ? '/' + couponChecked?.id : ''
        // }
      );

      localStorage.setItem('session_id', response.data.id);
      // When the customer clicks on the button, redirect them to Checkout.

      if (response.data.url) {
        updateOffice({ ...office, active: true });
        return (window.location.href = response.data.url);
      }
      const stripe: any = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.id,
      });
      toast({
        title: error,

        status: 'error',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Algo de errado ocorreu, tente novamente.',

        status: 'error',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
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
          {user.id === office.owner_id
            ? 'O pagamento do seu plano não foi identificado.'
            : 'O pagamento do seu plano não foi identificado. Peça ao proprietário do Gabinete para regularizar.'}
        </Text>
        {user.id === office.owner_id && (
          <Button
            onClick={handleCheckout}
            isLoading={loading}
            width="100%"
            bg="#00A39C"
            color="white"
            mt="24px"
            _hover={{
              bg: '#265B5A',
            }}
          >
            Pagar
          </Button>
        )}
        <Button
          onClick={handleSignOut}
          width="100%"
          bg="red"
          color="white"
          mt="24px"
          _hover={{
            bg: 'darkred',
          }}
        >
          Voltar
        </Button>
      </Flex>
    </Flex>
  );
}
