import { ChangeEvent, useCallback, useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  Icon,
  Select,
  Spinner,
  Stack,
  Text,
  Input as ChakraInput,
  useToast,
} from "@chakra-ui/react";
import HeaderSideBar from "../components/HeaderSideBar";
import { StateProps, UserDTO } from "../dtos";
import Input from "../components/Form/Input";
import { useAuth } from "../contexts/AuthContext";
import { IoCamera } from "react-icons/io5";
import resize from "../components/Resize";
import api from "../services/api";
import Button from "../components/Form/Button";
import * as Yup from "yup";
import getValidationErrors from "../utils/validationError";
import { useNavigate } from "react-router";

export default function Perfil() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const { user, office, updateUser } = useAuth();
  const toast = useToast();
  const [values, setValues] = useState({
    ...user,
  } as UserDTO);

  const callback = async (image: any) => {
    setLoading(true);
    // criando um formData para upload do arquivo
    const formData = new FormData();
    formData.append("avatar", image);

    console.log("avatar", image);
    console.log("formData", formData);
    try {
      const response = await api.patch("/users/avatar", formData);
      updateUser(response.data);

      return toast({
        title: "Foto atualizada!",
        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Foto não atualizada, tente novamente.",
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files;

        if (file.length === 0) {
          return; // se não selecionar nenhum file
        }

        // const reader = new FileReader();

        // reader.onloadend = () => {
        //   setUserData({ ...userData, file, preview: reader.result });
        // };

        // reader.readAsDataURL(file[0]);

        // funcao de resize
        resize(file[0], callback);
      }
    },
    []
  );

  const updateProfile = async () => {
    setLoading(true);

    setErrors({} as StateProps);

    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Nome obrigatório"),
        cellphone: Yup.string().required("Celular obrigatório"),
      });

      await schema.validate(values, {
        abortEarly: false,
      });

      delete values.id;
      delete values.avatar;
      delete values.avatar_url;
      delete values.need_update_password;
      delete values.created_at;
      delete values.updated_at;

      const response = await api.put("/profile", values);

      updateUser(response.data);

      toast({
        title: "Perfil atualizados",
        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
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
            "Ocorreu um erro ao atualizar os dados, tente novamente",

          status: "error",
          position: "top-right",
          duration: 3000,
          isClosable: true,
        });
      }
      return toast({
        title: "Ocorreu um erro ao atualizar os dados, tente novamente",

        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <HeaderSideBar backRoute={true}>
      <Text
        color="gray.500"
        fontWeight="semibold"
        fontSize="20px"
        ml={[0, "28px"]}
      >
        Perfil
        {loading && <Spinner color="blue.600" ml="4" size="sm" />}
      </Text>
      <Flex
        w="100%"
        alignItems="center"
        justify="center"
        position="relative"
        mt="28px"
      >
        <Flex justifyContent={"center"} position="relative">
          <label htmlFor="avatar">
            <Avatar
              bg="gray.100"
              name={values?.name}
              src={values?.avatar_url}
              position="unset"
              size="xl"
              color={office?.primary_color}
            />
            <Flex
              position="absolute"
              justify="center"
              align="center"
              borderRadius="full"
              bg={office?.primary_color}
              right="0"
              bottom="0"
              width="32px"
              height="32px"
              cursor={"pointer"}
            >
              {loading ? (
                <Spinner />
              ) : (
                <Icon
                  as={IoCamera}
                  color={office?.secondary_color}
                  boxSize={5}
                />
              )}
            </Flex>
            <ChakraInput
              type="file"
              onChange={handleAvatarChange}
              id="avatar"
              display="none"
            />
          </label>
        </Flex>
      </Flex>
      <Flex alignItems="center" justifyContent="center" as="form">
        <Stack spacing={[5, 10]} mt={["24px", "40px"]} w="852px">
          <Input
            labelColor="gray.500"
            label="Nome:"
            placeholder="Nome completo"
            name="name"
            type="text"
            error={errors?.name}
            value={values?.name}
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            borderColor="gray.500"
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
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
            >
              <option value="MALE">Masculino</option>
              <option value="FEMALE">Feminino</option>
            </Select>
          </Box>
          <Input
            color="gray.500"
            label="E-mail:"
            placeholder="E-mail"
            name="email"
            type="email"
            error={errors?.email}
            value={values?.email}
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            borderColor="gray.500"
            w="100%"
          />
          <Flex
            gap="20px"
            flexDir={"column"}
            alignItems={"center"}
            justifyContent="center"
          >
            <Button
              onClick={() => navigate("/trocar-senha")}
              bg="transparent"
              borderWidth="1px"
              borderColor={office?.primary_color}
              color={office?.primary_color}
              _hover={{
                bg: "gray.100",
              }}
              w="280px"
              mt="24px"
            >
              Trocar senha
            </Button>
            <Button onClick={updateProfile} w="280px">
              Salvar Alterações
            </Button>
          </Flex>
        </Stack>
      </Flex>
    </HeaderSideBar>
  );
}
