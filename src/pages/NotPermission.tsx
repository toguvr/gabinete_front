import { Flex } from "@chakra-ui/react";
import HeaderSideBar from "../components/HeaderSideBar";
import NotPermission from "../assets/notPermission.png";
import { Image, Text } from "@chakra-ui/react";

export default function NotFound() {
  return (
    <HeaderSideBar>
      <Flex
        flexDir={"column"}
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Image src={NotPermission} boxSize="large" />
        <Text color="gray.500" mt="42px">
          Você não tem permissão para acessar esta página
        </Text>
      </Flex>
    </HeaderSideBar>
  );
}
