import {
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IoPencilOutline, IoTrashOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Button from "../components/Form/Button";
import HeaderSideBar from "../components/HeaderSideBar";
import { useAuth } from "../contexts/AuthContext";
import { TaskPropsDTO } from "../dtos";
import api from "../services/api";
import { getFormatDate } from "../utils/date";

export default function Demand() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [data, setData] = useState([] as TaskPropsDTO[]);
  const { office } = useAuth();

  async function getTasks() {
    setData([] as TaskPropsDTO[]);

    setLoading(true);
    try {
      const response = await api.get(`/task/office/${office?.id}`);
      setData(response?.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (office?.id) {
      getTasks();
    }
  }, [office?.id]);

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
          Demandas
        </Text>
        <Button
          onClick={() => navigate("/demanda/registrar-demanda")}
          w={["160px", "280px"]}
        >
          Cadastrar Demanda
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
              <Th color="gray.600">Título</Th>
              <Th color="gray.600">Eleitor</Th>
              <Th color="gray.600">Prazo</Th>
              <Th color="gray.600" w="8">
                Ações
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((task) => {
                return (
                  <Tr key={task.id} whiteSpace="nowrap">
                    <Td
                      color="gray.600"
                      fontSize="14px"
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor="gray.300"
                      py="4px"
                    >
                      {task?.title}
                    </Td>
                    <Td
                      color="gray.600"
                      fontSize="14px"
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor="gray.300"
                      py="4px"
                    >
                      {task?.voter?.name}
                    </Td>
                    <Td
                      color="gray.600"
                      fontSize="14px"
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor="gray.300"
                      py="4px"
                    >
                      {getFormatDate(task?.date)}
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
