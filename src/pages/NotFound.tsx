import { Flex } from "@chakra-ui/react";
import HeaderSideBar from "../components/HeaderSideBar";
import NotFound from "../assets/404.png";
import { Image, Text } from "@chakra-ui/react";

export default function PageNotFound() {
  return (
    <Flex
      flexDir={"column"}
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Image src={NotFound} boxSize="large" />
      <Text color="gray.500" mt="24px">
        Página não encontrada
      </Text>
    </Flex>
  );
}
