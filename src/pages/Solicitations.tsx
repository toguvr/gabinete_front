import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Box,
  Divider,
  Flex,
  Icon,
  Select,
  Spinner,
  Text,
  useDisclosure,
  Button as ChakraButton,
  useToast,
} from '@chakra-ui/react';
import HeaderSideBar from '../components/HeaderSideBar';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { solicitationPage } from '../utils/filterTables';
import Input from '../components/Form/Input';
import { SolicitationDTO, StateProps } from '../dtos';
import { IoCheckmark, IoCloseOutline, IoSearchSharp } from 'react-icons/io5';
import api from '../services/api';

export default function Solicitations() {
  const [loading, setLoading] = useState(false);
  const { office } = useAuth();
  const [selectFilter, setSelectFilter] = useState('name');
  const [errors, setErrors] = useState({} as StateProps);
  const [filterField, setFilterField] = useState('');
  const [data, setData] = useState([] as SolicitationDTO[]);
  const auth = useAuth();
  const cancelRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const {
    isOpen: isOpenAlert,
    onOpen: onOpenAlert,
    onClose: onCloseAlert,
  } = useDisclosure();
  const [type, setType] = useState('');
  const [solicitationSelected, setSolicitationSelected] = useState({});
  const toast = useToast();

  const openDialog = (solicitation: SolicitationDTO) => {
    setSolicitationSelected(solicitation);
    onOpenAlert();
  };

  const getSolicitationsList = async () => {
    setData([] as SolicitationDTO[]);

    setLoading(true);
    try {
      const response = await api.get(`/solicitations/office/${auth.office.id}`);

      setData(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSolicitationsList();
  }, []);

  async function deleteSolicitation(solicitation: SolicitationDTO) {
    setLoading(true);

    try {
      await api.delete(`/solicitations/${solicitation?.id}`);
      getSolicitationsList();
      toast({
        title: 'Solicitação excluída.',
        status: 'success',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
    } catch (err: any) {
      if (err.response) {
        return toast({
          title:
            err.response.data.message ||
            'Ocorreu um erro ao excluir a solicitação, tente novamente',

          status: 'error',
          position: 'top-right',
          duration: 3000,
          isClosable: true,
        });
      }
      toast({
        title: 'Ocorreu um erro ao excluir a solicitação, tente novamente',
        status: 'error',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  async function confirmSolicitation(solicitation: SolicitationDTO) {
    setLoading(true);
    const body = {
      solicitation_id: solicitation?.id,
    };

    try {
      await api.put('/solicitation/confirm', body);
      getSolicitationsList();
      toast({
        title: 'Solicitação aceita com sucesso.',
        status: 'success',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
    } catch (err: any) {
      if (err.response) {
        return toast({
          title:
            err.response.data.message ||
            'Ocorreu um erro ao confirmar a solicitação, tente novamente',

          status: 'error',
          position: 'top-right',
          duration: 3000,
          isClosable: true,
        });
      }
      toast({
        title: 'Ocorreu um erro ao confirmar a solicitação, tente novamente',
        status: 'error',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <HeaderSideBar>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpenAlert}
        onClose={onCloseAlert}
        isCentered
      >
        {/* <AlertDialogOverlay > */}
        <AlertDialogContent mx="12px">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Deseja excluir este eleitor?
          </AlertDialogHeader>

          <AlertDialogBody>
            Essa ação é irreversível, ao deletar não será possível desfazer.
            Você deseja apagar mesmo assim?
          </AlertDialogBody>

          <AlertDialogFooter>
            <ChakraButton onClick={onCloseAlert}>Cancelar</ChakraButton>
            <ChakraButton
              colorScheme={'red'}
              isLoading={loading}
              onClick={
                () => {}
                // type === 'deletar'
                //   ? deleteSolicitation(solicitationSelected)
                //   : confirmSolicitation(solicitationSelected)
              }
              ml={3}
            >
              Continuar
            </ChakraButton>
          </AlertDialogFooter>
        </AlertDialogContent>
        {/* </AlertDialogOverlay> */}
      </AlertDialog>
      <Text
        color="gray.500"
        fontWeight="semibold"
        fontSize="20px"
        ml={[0, '28px']}
      >
        Solicitações
        {loading && <Spinner color={office?.primary_color} ml="4" size="sm" />}
      </Text>
      <Text mt="36px" color="gray.500">
        Filtar por:
      </Text>
      <Flex justifyContent="space-between">
        <Flex gap={['12px', '24px']} flex="1" mr={['0', '24px']}>
          <Select
            w="220px"
            borderColor="gray.500"
            name="filterType"
            value={selectFilter}
            onChange={(e) => {
              setSelectFilter(e.target.value);
            }}
          >
            {solicitationPage.map((solicitation) => {
              return (
                <option key={solicitation?.key} value={solicitation?.value}>
                  {solicitation?.label}
                </option>
              );
            })}
          </Select>

          <Input
            maxW="600px"
            type="text"
            name="filterField"
            placeholder="Buscar"
            error={errors?.filterField}
            value={filterField}
            mb="24px"
            onChange={(e) => {
              setFilterField(e.target.value);
            }}
            borderColor="gray.500"
            rightIcon={
              <Icon color="gray.500" fontSize="20px" as={IoSearchSharp} />
            }
          />
        </Flex>
      </Flex>
      <Box
        maxH="calc(100vh - 340px)"
        overflow="auto"
        mt="16px"
        sx={{
          '::-webkit-scrollbar': {
            bg: 'gray.50',
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            width: '2px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'gray.600',
            borderRadius: '8px',
          },
        }}
      >
        {Array.isArray(data) && data.length > 0 ? (
          data.map((solicitation) => {
            return (
              <Flex
                borderWidth={'1px'}
                borderColor="gray.500"
                borderRadius={'4px'}
              >
                <Flex bgColor={office?.primary_color} w="8px"></Flex>
                <Flex flexDir={'column'} px="28px" py="24px">
                  <Text color="gray.500" fontSize={'20px'} fontWeight={'600'}>
                    Nome do eleitor
                  </Text>
                  <Text color="gray.500" fontWeight={'300'} mt="16px">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Assumenda mollitia magni, culpa dolore, totam velit
                    reprehenderit adipisci quasi itaque aspernatur facere ipsum,
                    quis autem dignissimos ad laudantium! Nisi, laborum
                    sapiente!
                  </Text>
                </Flex>
                <Flex
                  minW={['48px', '60px']}
                  bg="#fff"
                  justify="center"
                  flexDir="column"
                  borderLeftWidth={'1px'}
                  borderLeftColor="gray.500"
                >
                  <Flex
                    onClick={() => {}}
                    align="center"
                    height="50%"
                    justify="center"
                    cursor="pointer"
                  >
                    <Icon
                      as={IoCheckmark}
                      color="green.500"
                      w="16px"
                      h="16px"
                    />
                  </Flex>
                  <Divider
                    // mx="12px"
                    orientation="horizontal"
                    color="gray.300"
                    h="1px"
                    borderColor="solid"
                  />
                  <Flex
                    onClick={() => openDialog(solicitation)}
                    align="center"
                    height="50%"
                    justify="center"
                    cursor="pointer"
                  >
                    <Icon
                      as={IoCloseOutline}
                      color="red.500"
                      w="16px"
                      h="16px"
                    />
                  </Flex>
                </Flex>
              </Flex>
            );
          })
        ) : (
          <Text>Não possui nenhuma solicitação</Text>
        )}
      </Box>
    </HeaderSideBar>
  );
}
