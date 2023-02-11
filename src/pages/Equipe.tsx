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
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import HeaderSideBar from "../components/HeaderSideBar";

export default function Equipe() {
  const [checkedItems, setCheckedItems] = useState([false, false]);

  return (
    <HeaderSideBar>
      <Text color="gray.500" fontWeight="semibold" fontSize="20px">
        Cadastrar Equipe
      </Text>
      <Flex alignItems="center" justifyContent="center">
        <Stack spacing={10} mt="40px" w="852px">
          <Input
            placeholder="Nome completo"
            bgColor="gray.50"
            color="gray.500"
            borderColor="gray.500"
            _placeholder={{ color: "gray.500" }}
            _hover={{
              borderColor: "gray.500",
            }}
          />
          <Input
            placeholder="E-mail"
            bgColor="gray.50"
            color="gray.500"
            borderColor="gray.500"
            _placeholder={{ color: "gray.500" }}
            type="email"
          />
          <Flex>
            <Input
              placeholder="DDD"
              bgColor="gray.50"
              color="gray.500"
              padding="10px"
              w="64px"
              borderColor="gray.500"
              _placeholder={{ color: "gray.500" }}
              type="number"
              mr="8px"
            />
            <Input
              placeholder="00000-0000"
              bgColor="gray.50"
              w="180px"
              color="gray.500"
              borderColor="gray.500"
              _placeholder={{ color: "gray.500" }}
              type="tel"
            />
          </Flex>
          <Accordion
            defaultIndex={[0]}
            allowMultiple
            bgColor="gray.50"
            color="gray.500"
          >
            <AccordionItem
              borderColor="gray.500"
              borderRightWidth="1px"
              borderLeftWidth="1px"
              borderRadius="md"
            >
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    Cargo
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} display="flex" flexDirection="column">
                <CheckboxGroup colorScheme="blue" defaultValue={[]}>
                  <Stack
                    spacing={[1, 2]}
                    maxH="120px"
                    overflow="auto"
                    sx={{
                      "::-webkit-scrollbar": {
                        bg: "gray.50",
                        width: "12px",
                      },
                      "&::-webkit-scrollbar-track": {
                        width: "2px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "gray.500",
                        borderRadius: "8px",
                      },
                    }}
                  >
                    <Checkbox value="parlamentar" borderColor="gray.400">
                      Parlamentar
                    </Checkbox>
                    <Checkbox value="acessoradm" borderColor="gray.400">
                      Acessor administrativo
                    </Checkbox>
                    <Checkbox value="acessormark" borderColor="gray.400">
                      Acessor marketing
                    </Checkbox>
                    <Checkbox value="acessorfina" borderColor="gray.400">
                      Acessor financeiro
                    </Checkbox>
                  </Stack>
                </CheckboxGroup>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Stack>
      </Flex>
      <Flex w="100%" alignItems="center" justifyContent="center" mt="95px">
        <Button
          bg={"blue.600"}
          color={"white"}
          alignSelf="center"
          w="280px"
          _hover={{
            bg: "blue.500",
          }}
        >
          Entrar
        </Button>
      </Flex>
    </HeaderSideBar>
  );
}
