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
} from "@chakra-ui/react";
import { FormEvent, useEffect, useState } from "react";
import {
  IoPencilOutline,
  IoSearchSharp,
  IoTrashOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Button from "../components/Form/Button";
import Input from "../components/Form/Input";
import HeaderSideBar from "../components/HeaderSideBar";
import { useAuth } from "../contexts/AuthContext";
import { StateProps, TaskPropsDTO } from "../dtos";
import api from "../services/api";
import { getFormatDate } from "../utils/date";
import * as Yup from "yup";

type RegisterFormData = {
  cellphone: string;
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

  const verifyPermission = async () => {
    setErrors({});
    setLoading(true);

    try {
      const schema = Yup.object().shape({
        cellphone: Yup.string()
          .required("Telefone do eleitor obrigatório")
          .min(8, "Mínimo de oito números.")
          .max(9, "Máximo de nove números."),
      });

      await schema.validate(values, {
        abortEarly: false,
      });

      const response = await api.get(
        `/voter/check/office/${role?.office_id}/cellphone/${values?.cellphone}`
      );

      if (response.data.isVoterExist === false) {
        setVerify(true);
      }
    } catch (err: any) {
      return toast({
        title:
          err?.response?.data?.message || "Eleitor registrado no gabinete.",
        status: "warning",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <HeaderSideBar>
      <Text
        color="gray.500"
        fontWeight="semibold"
        fontSize="20px"
        ml={[0, "28px"]}
      >
        Cadastrar Demandas
      </Text>
      <Flex
        display={"flex"}
        alignItems={"flex-end"}
        gap={["20px", "30px"]}
        mt={["24px", "40px"]}
      >
        <Input
          label="Telefone do eleitor:"
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
      <Flex alignItems="center" justifyContent="center" as="form">
        <Stack spacing={[5, 10]} mt={["24px", "40px"]} w="852px"></Stack>
      </Flex>
    </HeaderSideBar>
  );
}
