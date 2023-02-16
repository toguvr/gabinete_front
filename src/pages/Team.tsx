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

type TeamData = {
  id: number;
  name: string;
  email: string;
  cell: string;
  office: string;
};

export default function Team() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [data, setData] = useState<TeamData[]>([
    {
      id: 1,
      name: "Marketing",
      email: "marketing@gmail.com",
      cell: "24999569920",
      office: "Diretor",
    },
    {
      id: 2,
      name: "Financeiro",
      email: "financeiro@gmail.com",
      cell: "24999569920",
      office: "Supervisão",
    },
    {
      id: 3,
      name: "Social",
      email: "social@gmail.com",
      cell: "24999569920",
      office: "Acessor",
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
          Equipe
        </Text>
        <Button
          onClick={() => navigate("/equipe/registrar-equipe")}
          bg={"blue.600"}
          color={"white"}
          alignSelf="center"
          w={["160px", "280px"]}
          _hover={{
            bg: "blue.500",
          }}
        >
          Cadastrar equipe
        </Button>
      </Flex>
      <Box maxH="calc(100vh - 340px)" overflow="auto" mt={["32px", "84px"]}>
        <Table variant="simple">
          <Thead position="sticky" top="0px">
            <Tr
              borderBottomWidth={"4px"}
              borderBottomStyle="solid"
              borderBottomColor={"gray.300"}
            >
              <Th color="gray.600">Nome</Th>
              <Th color="gray.600">E-mail</Th>
              <Th color="gray.600">Telefone</Th>
              <Th color="gray.600">Cargo</Th>
              <Th color="gray.600" w="8">
                Ações
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((team) => {
                return (
                  <Tr key={team.id}>
                    <Td
                      color="gray.600"
                      fontSize="14px"
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor="gray.300"
                      py="0px"
                    >
                      {team?.name}
                    </Td>
                    <Td
                      color="gray.600"
                      fontSize="14px"
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor="gray.300"
                      py="0px"
                    >
                      {team?.email}
                    </Td>
                    <Td
                      color="gray.600"
                      fontSize="14px"
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor="gray.300"
                      py="0px"
                    >
                      {team?.cell}
                    </Td>
                    <Td
                      color="gray.600"
                      fontSize="14px"
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor="gray.300"
                      py="0px"
                    >
                      {team?.office}
                    </Td>
                    <Td
                      py="0px"
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor="gray.300"
                    >
                      <HStack spacing="8px">
                        <IconButton
                          onClick={() => {}}
                          aria-label="Open navigation"
                          variant="unstyled"
                          minW={6}
                          icon={
                            <Icon
                              cursor="pointer"
                              fontSize="20"
                              as={IoPencilOutline}
                              color="gray.600"
                            />
                          }
                        />

                        <IconButton
                          onClick={() => {}}
                          aria-label="Open alert"
                          variant="unstyled"
                          minW={6}
                          icon={
                            <Icon
                              cursor="pointer"
                              fontSize="20"
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
