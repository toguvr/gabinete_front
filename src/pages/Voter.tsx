import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  HStack,
  Icon,
  IconButton,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { FormEvent, useCallback, useState } from "react";
import HeaderSideBar from "../components/HeaderSideBar";
import { StateProps } from "../dtos";
import * as Yup from "yup";
import getValidationErrors from "../utils/validationError";
import Input from "../components/Form/Input";
import { IoPencilOutline, IoTrashOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

type VoterData = {
  id: number;
  name: string;
  email: string;
  birthday: string;
  cell: string;
  adress: string;
};

export default function Voter() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [data, setData] = useState<VoterData[]>([
    {
      id: 1,
      name: "Augusto Telles",
      email: "marketing@gmail.com",
      birthday: "14/05/1993",
      cell: "24999569920",
      adress: "Rua 544, jardim amalia",
    },
    {
      id: 2,
      name: "Otavio Augusto Chrispim de Paiva",
      email: "financeiro@gmail.com",
      birthday: "11/01/1983",
      cell: "24999569920",
      adress: "Rua Jose Correa, jardim amalia",
    },
    {
      id: 3,
      name: "Hugo Não sei o que",
      email: "social@gmail.com",
      birthday: "13/01/2003",
      cell: "24999569920",
      adress: "Rua Jose Correa Fonseca, 21, jardim amalia",
    },
  ]);

  return (
    <HeaderSideBar>
      <Flex
        justifyContent={"space-between"}
        gap={["20px", "0"]}
        alignItems={["center", "flex-start"]}
      >
        <Text
          color="gray.500"
          fontWeight="semibold"
          fontSize="20px"
          ml={[0, "28px"]}
        >
          Eleitor
        </Text>
        <Button
          onClick={() => navigate("/eleitor/registrar-eleitor")}
          bg={"blue.600"}
          color={"white"}
          alignSelf="center"
          w={["160px", "280px"]}
          _hover={{
            bg: "blue.500",
          }}
        >
          Cadastrar eleitor
        </Button>
      </Flex>
      <Box
        maxH="calc(100vh - 340px)"
        overflow="auto"
        mt="84px"
        sx={{
          "::-webkit-scrollbar": {
            bg: "gray.50",
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            width: "2px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "gray.600",
            borderRadius: "8px",
          },
        }}
      >
        <Table>
          <Thead
            position="sticky"
            top="0px"
            background="white"
            borderBottomWidth={"4px"}
            borderBottomStyle="solid"
            borderBottomColor={"gray.300"}
          >
            <Tr>
              <Th color="gray.600">Nome</Th>
              <Th color="gray.600">E-mail</Th>
              <Th color="gray.600">Data de nascimento</Th>
              <Th color="gray.600">Telefone</Th>
              <Th color="gray.600">Endereço</Th>
              <Th color="gray.600" w="8">
                Ações
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((team) => {
                return (
                  <Tr key={team.id} whiteSpace="nowrap">
                    <Td
                      color="gray.600"
                      fontSize="14px"
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor="gray.300"
                      py="4px"
                    >
                      {team?.name}
                    </Td>
                    <Td
                      color="gray.600"
                      fontSize="14px"
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor="gray.300"
                      py="4px"
                    >
                      {team?.email}
                    </Td>
                    <Td
                      color="gray.600"
                      fontSize="14px"
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor="gray.300"
                      py="4px"
                    >
                      {team?.birthday}
                    </Td>
                    <Td
                      color="gray.600"
                      fontSize="14px"
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor="gray.300"
                      py="4px"
                    >
                      {team?.cell}
                    </Td>
                    <Td
                      color="gray.600"
                      fontSize="14px"
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor="gray.300"
                      py="4px"
                    >
                      {team?.adress}
                    </Td>
                    <Td
                      py="4px"
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor="gray.300"
                    >
                      <HStack spacing="4px">
                        <IconButton
                          onClick={() => {}}
                          aria-label="Open navigation"
                          variant="unstyled"
                          icon={
                            <Icon
                              cursor="pointer"
                              fontSize="24"
                              as={IoPencilOutline}
                              color="gray.600"
                            />
                          }
                        />

                        <IconButton
                          onClick={() => {}}
                          aria-label="Open alert"
                          variant="unstyled"
                          icon={
                            <Icon
                              cursor="pointer"
                              fontSize="24"
                              as={IoTrashOutline}
                              color="gray.600"
                            />
                          }
                        />
                      </HStack>
                    </Td>
                  </Tr>
                );
              })
            ) : (
              <Tr>Nenhum dado cadastrado</Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </HeaderSideBar>
  );
}
