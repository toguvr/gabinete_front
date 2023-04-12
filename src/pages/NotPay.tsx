import {
  Avatar,
  Flex,
  Icon,
  Progress,
  Spinner,
  Text,
  Input as ChakraInput,
  useToast,
  Image,
  VStack,
  Box,
  Select,
  Button,
} from '@chakra-ui/react';
import {
  IoAddCircleSharp,
  IoCamera,
  IoEyeOffOutline,
  IoEyeOutline,
  IoLockClosedOutline,
} from 'react-icons/io5';
import resize from '../components/Resize';
import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import api from '../services/api';
import Input from '../components/Form/Input';
import { StateProps } from '../dtos';
import * as Yup from 'yup';
import getValidationErrors from '../utils/validationError';
import { PatternFormat } from 'react-number-format';
import { useNavigate } from 'react-router-dom';
import NotPayImage from '../assets/notpay.png';

interface SignUpProps {
  name: string;
  gender: string;
  email: string;
  password: string;
  cellphoneMask: string;
  cellphone: string;
}

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
