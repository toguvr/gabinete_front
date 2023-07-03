import { Box, Flex, Stack, Text, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Button from '../components/Form/Button';
import Input from '../components/Form/Input';
import HeaderSideBar from '../components/HeaderSideBar';
import { useAuth } from '../contexts/AuthContext';

interface CreditCard {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  active: boolean;
}

export default function PaymentMethodRegister() {
  const { office } = useAuth();
  const navigate = useNavigate();
  const [creditCard, setCreditCard] = useState<CreditCard>({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    active: false,
  });

  const [creditCards, setCreditCards] = useState<CreditCard[]>([
    {
      cardholderName: 'munir',
      cardNumber: '1111 2222 3333 4444',
      expiryDate: '12/2023',
      cvv: '123',
      active: true,
    },
    {
      cardholderName: 'sena',
      cardNumber: '5555 6666 7777 8888',
      expiryDate: '01/2024',
      cvv: '456',
      active: false,
    },
  ]);

  const handleAddCreditCard = () => {
    if (
      !creditCard.cardholderName ||
      !creditCard.cardNumber ||
      !creditCard.expiryDate ||
      !creditCard.cvv
    ) {
      alert('Please fill all the fields.');
      return;
    }
    setCreditCards([...creditCards, creditCard]);
    setCreditCard({
      cardholderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      active: false,
    });
  };

  const handleChangeCreditCard = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCreditCard({
      ...creditCard,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <HeaderSideBar backRoute={true}>
      <Text color="gray.500" fontWeight="semibold" fontSize="20px">
        Cadastrar Forma de Pagamento
      </Text>
      <Flex alignItems="center" justifyContent="center" as="form">
        <Stack spacing={[5, 8]} mt={['24px', '40px']} w="852px">
          <Box>
            <Stack spacing={3}>
              <Input
                labelColor={'gray.500'}
                placeholder="Nome no cartão"
                name="cardholderName"
                type="text"
                value={creditCard.cardholderName}
                onChange={handleChangeCreditCard}
                borderColor="gray.500"
              />
              <Input
                labelColor={'gray.500'}
                placeholder="Número no cartão"
                name="cardNumber"
                type="text"
                value={creditCard.cardNumber}
                onChange={handleChangeCreditCard}
                borderColor="gray.500"
              />
              <Input
                labelColor={'gray.500'}
                placeholder="Data de vencimento (MM/YYYY)"
                name="expiryDate"
                type="text"
                value={creditCard.expiryDate}
                onChange={handleChangeCreditCard}
                borderColor="gray.500"
              />
              <Input
                labelColor={'gray.500'}
                placeholder="CVV"
                name="cvv"
                type="password"
                value={creditCard.cvv}
                onChange={handleChangeCreditCard}
                borderColor="gray.500"
              />
            </Stack>
          </Box>
          <Button onClick={handleAddCreditCard}>Registrar Cartão</Button>
          <Box>
            <Text
              mt="20px"
              color="gray.500"
              fontWeight="semibold"
              fontSize="20px"
            >
              Cartōes Registrados
            </Text>
            {creditCards.map((card, index) => (
              <Box
                key={index}
                mt="20px"
                border="1px solid"
                borderColor={card.active ? 'green.200' : '#ccc'}
                padding="10px"
                borderRadius="5px"
              >
                <Text>Nome no cartão: {card.cardholderName}</Text>
                <Text>Número no cartão: {card.cardNumber}</Text>
                <Text>Data de vencimento: {card.expiryDate}</Text>
              </Box>
            ))}
          </Box>
        </Stack>
      </Flex>
    </HeaderSideBar>
  );
}
