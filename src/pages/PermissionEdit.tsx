import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Checkbox,
  CheckboxGroup,
  Flex,
  Select,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import HeaderSideBar from "../components/HeaderSideBar";
import { RoleDTO, StateProps } from "../dtos";
import * as Yup from "yup";
import getValidationErrors from "../utils/validationError";
import Input from "../components/Form/Input";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import Button from "../components/Form/Button";
import { useLocation, useParams } from "react-router-dom";

type RegisterFormData = {
  name: string;
  cellphone: string;
  email: string;
  office_id: string;
  role_id: string;
  ddd: string;
  user_id: string;
  permissionId: string;
  active: string;
  gender: string;
};

export default function PermissionEdit() {
  const { id } = useParams();
  const [values, setValues] = useState<RegisterFormData>(
    {} as RegisterFormData
  );
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [roles, setRoles] = useState([] as RoleDTO[]);
  const { office } = useAuth();

  const getRoles = async () => {
    setRoles([] as RoleDTO[]);

    setLoading(true);
    try {
      const response = await api.get(`/role/office/${office?.id}`);
      setRoles(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  const handleUpdatePermission = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      setErrors({});

      setLoading(true);
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required("Nome completo obrigatório"),
          email: Yup.string()
            .email("Email inválido")
            .required("Email obrigatório"),
        });

        await schema.validate(values, {
          abortEarly: false,
        });

        const body = {
          role_id: values?.role_id,
          permissionId: id,
        };

        await api.put("/permission", body);

        return toast({
          title: "Ataulizado com sucesso",
          description: "Você atualizou uma equipe.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          setErrors(getValidationErrors(err));

          return;
        }
        if (err.response) {
          return toast({
            title:
              err.response.data.message ||
              "Ocorreu um erro ao cadastrar a equipe, cheque as credenciais",

            status: "error",
            position: "top-right",
            duration: 3000,
            isClosable: true,
          });
        }
        return toast({
          title: "Ocorreu um erro ao cadastrar a equipe, cheque as credenciais",

          status: "error",
          position: "top-right",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [values]
  );

  const getPermissionById = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/permission/${id}`);
      setValues({
        ddd: response?.data?.user?.cellphone.slice(0, 2),
        cellphone: response?.data?.user?.cellphone.slice(2),
        name: response?.data?.user?.name,
        email: response?.data?.user?.email,
        permissionId: response?.data?.id,
        user_id: response?.data?.user_id,
        role_id: response?.data?.role_id,
        office_id: response?.data?.office_id,
        active: response?.data?.active,
        gender: response?.data?.user?.gender,
      });
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPermissionById();
  }, []);

  return (
    <HeaderSideBar backRoute={true}>
      <Text color="gray.500" fontWeight="semibold" fontSize="20px">
        Editar Equipe
      </Text>
      <Flex alignItems="center" justifyContent="center" as="form">
        <Stack spacing={[5, 10]} mt={["24px", "40px"]} w="852px">
          <Flex display={"flex"} alignItems={"flex-end"} gap={["20px", "40px"]}>
            <Input
              color="gray.500"
              label="E-mail:"
              placeholder="E-mail"
              name="email"
              type="email"
              error={errors?.email}
              value={values.email}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              borderColor="gray.500"
              w="100%"
              disabled
            />
          </Flex>
          <Input
            labelColor="gray.500"
            label="Nome:"
            placeholder="Nome completo"
            name="name"
            type="text"
            error={errors?.name}
            value={values.name}
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            borderColor="gray.500"
            disabled
          />
          <Box w="100%">
            <Text color="gray.500" fontWeight="400" margin="0">
              Gênero:
            </Text>
            <Select
              placeholder="Gênero"
              borderColor="gray.500"
              bg="gray.50"
              _placeholder={{ color: "gray.500" }}
              color="gray.600"
              value={values?.gender}
              name="gender"
              disabled
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
            >
              <option value="MALE">Masculino</option>
              <option value="FEMALE">Feminino</option>
            </Select>
          </Box>
          <Flex flexDir={"column"}>
            <Text color="gray.500">Telefone:</Text>
            <Flex>
              <Input
                name="ddd"
                type="number"
                error={errors?.ddd}
                value={values.ddd}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                placeholder="DDD"
                w="72px"
                mr="8px"
                borderColor="gray.500"
                disabled
              />
              <Input
                name="cellphone"
                type="number"
                error={errors?.cellphone}
                value={values.cellphone}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                placeholder="00000-0000"
                w="180px"
                borderColor="gray.500"
                disabled
              />
            </Flex>
          </Flex>
          <Box flexDirection={"column"}>
            <Text color={"gray.500"}>Cargo:</Text>
            <Select
              borderColor={"gray.500"}
              bg="gray.50"
              _placeholder={{ color: "gray.500" }}
              color={"gray.500"}
              name="role_id"
              value={values?.role_id}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
            >
              {roles?.map((role) => {
                return (
                  <option key={role?.id} value={role?.id}>
                    {role?.name}
                  </option>
                );
              })}
            </Select>
          </Box>
          <Flex
            w="100%"
            alignItems="center"
            justifyContent="center"
            mt={["40px", "95px"]}
          >
            <Button onClick={handleUpdatePermission} width="280px">
              {loading ? <Spinner color="white" /> : "Atualizar"}
            </Button>
          </Flex>
        </Stack>
      </Flex>
    </HeaderSideBar>
  );
}
