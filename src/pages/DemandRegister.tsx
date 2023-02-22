import {
  Box,
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
  Button as ChakraButton,
  Avatar,
  Textarea,
  FormLabel,
  Switch,
  Select,
} from "@chakra-ui/react";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  IoCloudUpload,
  IoPencilOutline,
  IoSearchSharp,
  IoTrashOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Button from "../components/Form/Button";
import Input from "../components/Form/Input";
import HeaderSideBar from "../components/HeaderSideBar";
import { useAuth } from "../contexts/AuthContext";
import { PermissionByIdDTO, StateProps, TaskPropsDTO, UserDTO } from "../dtos";
import api from "../services/api";
import { getFormatDate } from "../utils/date";
import * as Yup from "yup";

type RegisterFormData = {
  cellphone: string;
  title: string;
  description: string;
  date: string;
  priority: string;
};

export type SelectProps = {
  label: string;
  value: string;
};

export default function DemandRegister() {
  const [values, setValues] = useState<RegisterFormData>(
    {} as RegisterFormData
  );
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [verify, setVerify] = useState(false);
  const { role } = useAuth();
  const toast = useToast();
  const auth = useAuth();
  const [image, setImage] = useState({} as File);
  const [responsibles, setResponsibles] = useState([] as SelectProps[]);
  const [responsible, setResponsible] = useState({} as SelectProps);

  const verifyPermission = async () => {
    setErrors({});
    setLoading(true);
    try {
      if (values?.cellphone?.length === 0 || values?.cellphone === undefined) {
        setErrors({
          cellphone: "Telefone do eleitor obrigatório.",
        });
        return;
      }

      if (values?.cellphone?.length < 10) {
        setErrors({
          cellphone: "Telefone do eleitor deve ter mais de 10 caracteres.",
        });
        return;
      }

      const response = await api.get(
        `/voter/check/office/${role?.office_id}/cellphone/${values?.cellphone}`
      );

      if (response.data.isVoterExist === false) {
        setVerify(true);
      }
    } catch (err: any) {
      return toast({
        title: err?.response?.data?.message,
        status: "warning",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getPermissions = async () => {
    setResponsibles([] as SelectProps[]);

    setLoading(true);
    try {
      const response = await api.get(`/permission/office/${role?.office_id}`);

      setResponsibles(
        response.data.map((responsible: PermissionByIdDTO) => ({
          value: responsible?.user?.id,
          label: responsible?.user?.name,
        }))
      );
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  const postDocument = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files;

      if (file.length === 0) {
        return; // se não selecionar nenhum file
      }

      if (file[0].type !== "application/pdf") {
        return toast({
          title:
            "Apenas documento em formato de pdf é permitido, tente novamente",
          status: "error",
          position: "top-right",
          duration: 3000,
          isClosable: true,
        });
      }
      // const reader = new FileReader();

      // reader.onloadend = () => {
      //   setUserData({ ...userData, file, preview: reader.result });
      // };

      // reader.readAsDataURL(file[0]);

      // funcao de resize
      if (file[0].type === "application/pdf") {
        setImage(file[0]);
        return;
      }
    }
  }, []);

  return (
    <HeaderSideBar>
      <Text
        color="gray.500"
        fontWeight="semibold"
        fontSize="20px"
        ml={[0, "28px"]}
      >
        Cadastrar Demanda
      </Text>

      <Flex alignItems="center" justifyContent="center" as="form">
        <Stack spacing={["16px", "30px"]} mt={["24px", "40px"]} w="852px">
          <Box>
            <Flex
              display={"flex"}
              alignItems={errors?.cellphone ? "center" : "flex-end"}
              gap={["20px", "30px"]}
              w="100%"
            >
              <Input
                name="cellphone"
                type="number"
                error={errors?.cellphone}
                value={values?.cellphone}
                onChange={(e) =>
                  setValues({
                    ...values,
                    [e.target.name]: Math.max(0, parseInt(e.target.value))
                      .toString()
                      .slice(0, 11),
                  })
                }
                placeholder="Telefone"
                borderColor="gray.500"
                isDisabled={verify}
                rightIcon={
                  <Icon color="gray.500" fontSize="20px" as={IoSearchSharp} />
                }
              />

              <Button onClick={verifyPermission} w="200px" isDisabled={verify}>
                {loading ? <Spinner color="white" /> : "Procurar"}
              </Button>
            </Flex>
            <Flex
              mt="8px"
              borderWidth={"1px"}
              borderColor="gray.200"
              px={"20px"}
              py={"8px"}
              alignItems="center"
              gap="16px"
              borderRadius="4px"
              cursor="pointer"
            >
              <Avatar boxSize="10" />
              <Box>
                <Text color="gray.400">Nome do eleitor</Text>
                <Text color="gray.400">00000-0000</Text>
              </Box>
            </Flex>
          </Box>
          <Box>
            <Input
              placeholder="Título"
              name="title"
              type="text"
              error={errors?.title}
              value={values?.title}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              borderColor="gray.500"
            />
            <Textarea
              placeholder="Descrição"
              name="description"
              value={values?.description}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              borderColor="gray.500"
              mt="8px"
              resize="none"
            />
          </Box>

          <Select
            placeholder="Selecionar responsável"
            borderColor="gray.500"
            bg="gray.50"
            _placeholder={{ color: "gray.500" }}
            color="gray.600"
            value={responsible?.value}
            name="responsible"
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
          >
            {responsibles.map((responsible) => {
              return (
                <option value={responsible?.value} key={responsible?.value}>
                  {responsible?.label}
                </option>
              );
            })}
          </Select>
          <Flex alignItems={"flex-end"} gap="36px">
            <Input
              labelColor="gray.500"
              label="Prazo:"
              name="date"
              type="date"
              error={errors?.date}
              value={values?.date}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              placeholder="00/00/0000"
              borderColor="gray.500"
              css={{
                "&::-webkit-calendar-picker-indicator": {
                  color: "gray.500",
                },
              }}
              w="220px"
            />
            <Select
              placeholder="Prioridade"
              borderColor="gray.500"
              bg="gray.50"
              _placeholder={{ color: "gray.500" }}
              color="gray.600"
              value={values?.priority}
              name="priority"
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
            >
              <option value="MALE">Masculino</option>
              <option value="FEMALE">Feminino</option>
            </Select>
          </Flex>
          {/* <FormLabel htmlFor="document" m="0" cursor="pointer">
            <Flex
              p="12px"
              borderRadius="md"
              alignItems="center"
              borderWidth="1px"
              borderColor="gray.500"
              justifyContent="space-between"
            >
              <Flex gap="20px">
                <Flex
                  userSelect="none"
                  w="200px"
                  alignItems="center"
                  justifyContent="center"
                  color="gray.500"
                  bgColor="transparent"
                  borderWidth="1px"
                  borderColor="gray.100"
                  borderRadius="6px"
                  fontFamily="Roboto"
                  fontStyle="normal"
                  fontSize="16px"
                  lineHeight="24px"
                  boxShadow="2px 2px 2px 2px rgba(58, 59, 59, 0.1)"
                  _hover={{ bg: "gray.50" }}
                  _active={{
                    bg: "gray.50",
                  }}
                  _focus={{
                    boxShadow: "0 0 0 3px rgba(60, 62, 63, 0.6)",
                  }}
                >
                  {loading ? <Spinner /> : "Escolher arquivo"}
                </Flex>
                <Text fontSize={"14px"} color="gray.500">
                  {image?.name ? image?.name : "Nenhum arquivo selecionado"}
                </Text>
              </Flex>
              <Icon
                as={IoCloudUpload}
                boxSize="24px"
                color="gray.500"
                _hover={{ color: "gray.600" }}
                _active={{
                  color: "green.700",
                }}
              />
              <Input
                name="document"
                onChange={postDocument}
                display="none"
                type="file"
                accept="application/pdf"
                id="document"
              />
            </Flex>
          </FormLabel> */}
          <Flex gap="24px">
            <Text color="gray.500">Recurso:</Text>
            <HStack>
              <Text color="gray.500">Não</Text>
              <Switch />
              <Text color="gray.500">Sim</Text>
            </HStack>
          </Flex>
          <Flex
            w="100%"
            alignItems="center"
            justifyContent="center"
            mt={["40px", "95px"]}
          >
            <Button onClick={() => {}} width="280px">
              {loading ? <Spinner color="white" /> : "Enviar demanda"}
            </Button>
          </Flex>
        </Stack>
      </Flex>
    </HeaderSideBar>
  );
}
