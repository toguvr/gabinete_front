import {
  Avatar,
  Flex,
  Progress,
  Spinner,
  Text,
  Input as ChakraInput,
  useToast,
  Icon,
  VStack,
  Button,
} from '@chakra-ui/react';
import { useCallback, useState, ChangeEvent } from 'react';
import { IoAddCircleSharp } from 'react-icons/io5';
import resize from '../components/Resize';
import api from '../services/api';
import Input from '../components/Form/Input';
import { StateProps } from '../dtos';

interface SignUpOfficeProps {
  name: string;
  logo_url: string;
  city: string;
  state: string;
  owner_position: string;
  primary_color: string;
  secondary_color: string;
}

export default function SignUpOffice() {
  const [values, setValues] = useState({} as SignUpOfficeProps);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const toast = useToast();
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [loading, setLoading] = useState(false);

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      padding={['12px', '56px 156px']}
      flexDirection={'column'}
      bg="linear-gradient(180deg, #0084DE 0%, #004279 100%)"
    >
      <Flex
        bg="white"
        w="100%"
        py="36px"
        px={['24px', '24px', '120px']}
        align="center"
        justify="center"
        flexDir={'column'}
        borderRadius="8px"
      >
        <Progress value={100} w={['100%', '100%', '450px']} />
        <Text fontSize={'24px'} color="gray.500" fontWeight="600" mt="24px">
          Cadastrar Gabinete
        </Text>
        <Flex justifyContent={'center'} position="relative" mt="48px">
          <label htmlFor="avatar">
            <Avatar bg="gray.100" position="unset" size="xl" />
            <Flex
              position="absolute"
              justify="center"
              align="center"
              borderRadius="full"
              right="0"
              bottom="0"
              width="32px"
              height="32px"
              cursor={'pointer'}
            >
              {loadingPhoto ? (
                <Spinner />
              ) : (
                <Icon
                  as={IoAddCircleSharp}
                  boxSize={5}
                  color="blue.500"
                  w={8}
                  h={8}
                />
              )}
            </Flex>
            <ChakraInput
              type="file"
              onChange={() => {}}
              id="avatar"
              display="none"
            />
          </label>
        </Flex>
        <VStack spacing={6} maxW="850px" w="100%" mt="32px">
          <Input
            labelColor="gray.500"
            label="Nome:"
            placeholder="Nome do Gabinete"
            name="name"
            type="text"
            error={errors?.name}
            value={values?.name}
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            borderColor="gray.500"
          />
          <Flex w="100%" gap={['20px', '44px']}>
            <Input
              labelColor="gray.500"
              label="Cidade:"
              placeholder="Cidade do Gabinete"
              name="city"
              type="text"
              error={errors?.city}
              value={values?.city}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              borderColor="gray.500"
            />
            <Input
              labelColor="gray.500"
              label="Estado:"
              placeholder="Estado do Gabinete"
              name="state"
              type="text"
              error={errors?.state}
              value={values?.state}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              borderColor="gray.500"
            />
          </Flex>
          <Input
            color="gray.500"
            label="Cargo:"
            placeholder="Cargo do líder"
            name="owner_position"
            type="text"
            error={errors?.owner_position}
            value={values?.owner_position}
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            borderColor="gray.500"
            w="100%"
          />
          <Flex w="100%" gap={['20px', '44px']}>
            <Input
              color="gray.500"
              label="Cor primária:"
              name="primary_color"
              type="color"
              error={errors?.primary_color}
              value={values?.primary_color}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              borderColor="gray.500"
              w="100%"
            />
            <Input
              color="gray.500"
              label="Cor secundária:"
              placeholder="Cargo do líder"
              name="secondary_color"
              type="color"
              error={errors?.secondary_color}
              value={values?.secondary_color}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              borderColor="gray.500"
              w="100%"
            />
          </Flex>
        </VStack>
        <Button
          onClick={() => {}}
          bg={'blue.600'}
          color={'white'}
          _hover={{
            bg: 'blue.700',
          }}
          mt="40px"
          w={'280px'}
        >
          {loading ? <Spinner color="white" /> : 'Cadastrar'}
        </Button>
      </Flex>
    </Flex>
  );
}
