import {
  Avatar,
  Box,
  BoxProps,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  HStack,
  Icon,
  IconButton,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { ReactNode, ReactText, useEffect, useState } from "react";
import { IconType } from "react-icons";
import { BiArrowBack, BiTask } from "react-icons/bi";
import { BsListTask } from "react-icons/bs";
import { FiHome, FiMenu } from "react-icons/fi";
import { IoAlbumsOutline } from "react-icons/io5";
import { RiTeamLine } from "react-icons/ri";
import { SiMicrosoftteams } from "react-icons/si";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import LogoWhite from "../assets/logoWhite.png";
import { useAuth } from "../contexts/AuthContext";

interface LinkItemProps {
  name: string;
  route: string;
  icon: IconType;
  permissionName: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Home", route: "/", icon: FiHome, permissionName: "home_page" },
  {
    name: "Cargos",
    route: "/cargo",
    icon: IoAlbumsOutline,
    permissionName: "cargo_page",
  },
  {
    name: "Equipe",
    route: "/equipe",
    icon: RiTeamLine,
    permissionName: "equipe_page",
  },
  {
    name: "Eleitor",
    route: "/eleitor",
    icon: SiMicrosoftteams,
    permissionName: "eleitor_page",
  },
  {
    name: "Demandas",
    route: "/demanda",
    icon: BsListTask,
    permissionName: "demandas_page",
  },
  {
    name: "Tarefas",
    route: "/tarefa",
    icon: BiTask,
    permissionName: "tarefas_page",
  },
];

export default function SidebarWithHeader({
  children,
  backRoute,
}: {
  children: ReactNode;
  backRoute?: boolean;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [screenHeight, setScreenHeight] = useState(`calc(100vh - 60px)`);

  useEffect(() => {
    setScreenHeight(`calc(${window.innerHeight}px - 60px)`);
  }, []);

  return (
    <Box minH={["100%", "100vh"]} bg="white">
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} backRoute={backRoute} />
      <Box ml={{ base: 0, md: 60 }} p="26px" bg="gray.100" h={screenHeight}>
        <Box
          bgColor="white"
          h={["100%", `calc(100vh - 112px)`]}
          borderRadius="8px"
          px="24px"
          py="40px"
          overflow={"auto"}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
  active?: boolean;
  icon?: IconType;
}

const SidebarContent = ({ onClose, icon, active, ...rest }: SidebarProps) => {
  const navigate = useNavigate();
  const { office, role } = useAuth();
  const { pathname } = useLocation();

  const teste = role as any;

  return (
    <Box
      transition="3s ease"
      bg="white"
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex alignItems="center" mx="8" my={4} justifyContent="space-between">
        <Box>
          <Image src={office?.logo_url ? office?.logo_url : Logo} alt="Logo" />
        </Box>
        <CloseButton
          display={{ base: "flex", md: "none" }}
          onClick={onClose}
          bg={office?.secondary_color}
          color={office?.primary_color}
        />
      </Flex>

      {LinkItems.map((link) => {
        if (teste[link?.permissionName] > 0) {
          return pathname === link.route ? (
            <Link
              style={{ textDecoration: "none" }}
              _focus={{ boxShadow: "none" }}
              onClick={() => navigate(link?.route)}
            >
              <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                color={office?.secondary_color}
                bg={office?.primary_color}
                {...rest}
              >
                <Icon
                  mr="4"
                  color={office?.secondary_color}
                  fontSize="16"
                  _groupHover={{
                    color: office?.secondary_color,
                  }}
                  as={link?.icon}
                />
                {link?.name}
              </Flex>
            </Link>
          ) : (
            <Link
              style={{ textDecoration: "none" }}
              _focus={{ boxShadow: "none" }}
              onClick={() => navigate(link?.route)}
            >
              <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                color="gray.500"
                _hover={{
                  bg: office?.primary_color,
                  color: office?.secondary_color,
                }}
                {...rest}
              >
                <Icon
                  mr="4"
                  color="gray.500"
                  fontSize="16"
                  _groupHover={{
                    color: office?.secondary_color,
                  }}
                  as={link?.icon}
                />
                {link?.name}
              </Flex>
            </Link>
          );
        }
      })}

      {/* {role?.home_page > 0 && pathname === "/" ? (
        <Link
          style={{ textDecoration: "none" }}
          _focus={{ boxShadow: "none" }}
          onClick={() => navigate("/")}
        >
          <Flex
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            color={office?.secondary_color}
            bg={office?.primary_color}
            {...rest}
          >
            <Icon
              mr="4"
              color={office?.secondary_color}
              fontSize="16"
              _groupHover={{
                color: office?.secondary_color,
              }}
              as={FiHome}
            />
            Home
          </Flex>
        </Link>
      ) : (
        <Link
          style={{ textDecoration: "none" }}
          _focus={{ boxShadow: "none" }}
          onClick={() => navigate(`/`)}
        >
          <Flex
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            color="gray.500"
            _hover={{
              bg: office?.primary_color,
              color: office?.secondary_color,
            }}
            {...rest}
          >
            <Icon
              mr="4"
              color="gray.500"
              fontSize="16"
              _groupHover={{
                color: office?.secondary_color,
              }}
              as={FiHome}
            />
            Home
          </Flex>
        </Link>
      )}
      {role?.cargo_page > 0 && pathname === "/cargo" ? (
        <Link
          style={{ textDecoration: "none" }}
          _focus={{ boxShadow: "none" }}
          onClick={() => navigate("/cargo")}
        >
          <Flex
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            color={office?.secondary_color}
            bg={office?.primary_color}
            {...rest}
          >
            <Icon
              mr="4"
              color={office?.secondary_color}
              fontSize="16"
              _groupHover={{
                color: office?.secondary_color,
              }}
              as={IoAlbumsOutline}
            />
            Cargo
          </Flex>
        </Link>
      ) : (
        <Link
          style={{ textDecoration: "none" }}
          _focus={{ boxShadow: "none" }}
          onClick={() => navigate(`/cargo`)}
        >
          <Flex
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            color="gray.500"
            _hover={{
              bg: office?.primary_color,
              color: office?.secondary_color,
            }}
            {...rest}
          >
            <Icon
              mr="4"
              color="gray.500"
              fontSize="16"
              _groupHover={{
                color: office?.secondary_color,
              }}
              as={IoAlbumsOutline}
            />
            Cargo
          </Flex>
        </Link>
      )}
      {role?.equipe_page > 0 && pathname === "/equipe" ? (
        <Link
          style={{ textDecoration: "none" }}
          _focus={{ boxShadow: "none" }}
          onClick={() => navigate("/equipe")}
        >
          <Flex
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            color={office?.secondary_color}
            bg={office?.primary_color}
            {...rest}
          >
            <Icon
              mr="4"
              color={office?.secondary_color}
              fontSize="16"
              _groupHover={{
                color: office?.secondary_color,
              }}
              as={RiTeamLine}
            />
            Equipe
          </Flex>
        </Link>
      ) : (
        <Link
          style={{ textDecoration: "none" }}
          _focus={{ boxShadow: "none" }}
          onClick={() => navigate(`/equipe`)}
        >
          <Flex
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            color="gray.500"
            _hover={{
              bg: office?.primary_color,
              color: office?.secondary_color,
            }}
            {...rest}
          >
            <Icon
              mr="4"
              color="gray.500"
              fontSize="16"
              _groupHover={{
                color: office?.secondary_color,
              }}
              as={RiTeamLine}
            />
            Equipe
          </Flex>
        </Link>
      )}
      {role?.eleitor_page > 0 && pathname === "/eleitor" ? (
        <Link
          style={{ textDecoration: "none" }}
          _focus={{ boxShadow: "none" }}
          onClick={() => navigate("/eleitor")}
        >
          <Flex
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            color={office?.secondary_color}
            bg={office?.primary_color}
            {...rest}
          >
            <Icon
              mr="4"
              color={office?.secondary_color}
              fontSize="16"
              _groupHover={{
                color: office?.secondary_color,
              }}
              as={SiMicrosoftteams}
            />
            Eleitor
          </Flex>
        </Link>
      ) : (
        <Link
          style={{ textDecoration: "none" }}
          _focus={{ boxShadow: "none" }}
          onClick={() => navigate(`/eleitor`)}
        >
          <Flex
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            color="gray.500"
            _hover={{
              bg: office?.primary_color,
              color: office?.secondary_color,
            }}
            {...rest}
          >
            <Icon
              mr="4"
              color="gray.500"
              fontSize="16"
              _groupHover={{
                color: office?.secondary_color,
              }}
              as={SiMicrosoftteams}
            />
            Eleitor
          </Flex>
        </Link>
      )}
      {role?.demandas_page > 0 && pathname === "/demanda" ? (
        <Link
          style={{ textDecoration: "none" }}
          _focus={{ boxShadow: "none" }}
          onClick={() => navigate("/demanda")}
        >
          <Flex
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            color={office?.secondary_color}
            bg={office?.primary_color}
            {...rest}
          >
            <Icon
              mr="4"
              color={office?.secondary_color}
              fontSize="16"
              _groupHover={{
                color: office?.secondary_color,
              }}
              as={BsListTask}
            />
            Demandas
          </Flex>
        </Link>
      ) : (
        <Link
          style={{ textDecoration: "none" }}
          _focus={{ boxShadow: "none" }}
          onClick={() => navigate(`/demanda`)}
        >
          <Flex
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            color="gray.500"
            _hover={{
              bg: office?.primary_color,
              color: office?.secondary_color,
            }}
            {...rest}
          >
            <Icon
              mr="4"
              color="gray.500"
              fontSize="16"
              _groupHover={{
                color: office?.secondary_color,
              }}
              as={BsListTask}
            />
            Demandas
          </Flex>
        </Link>
      )}
      {role?.tarefas_page > 0 && pathname === "/tarefa" ? (
        <Link
          style={{ textDecoration: "none" }}
          _focus={{ boxShadow: "none" }}
          onClick={() => navigate("/tarefa")}
        >
          <Flex
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            color={office?.secondary_color}
            bg={office?.primary_color}
            {...rest}
          >
            <Icon
              mr="4"
              color={office?.secondary_color}
              fontSize="16"
              _groupHover={{
                color: office?.secondary_color,
              }}
              as={BiTask}
            />
            Tarefas
          </Flex>
        </Link>
      ) : (
        <Link
          style={{ textDecoration: "none" }}
          _focus={{ boxShadow: "none" }}
          onClick={() => navigate(`/tarefa`)}
        >
          <Flex
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            color="gray.500"
            _hover={{
              bg: office?.primary_color,
              color: office?.secondary_color,
            }}
            {...rest}
          >
            <Icon
              mr="4"
              color="gray.500"
              fontSize="16"
              _groupHover={{
                color: office?.secondary_color,
              }}
              as={BiTask}
            />
            Tarefas
          </Flex>
        </Link>
      )} */}
    </Box>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
  backRoute?: boolean;
}
const MobileNav = ({ onOpen, backRoute, ...rest }: MobileProps) => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleNavigatePerfil = () => {
    navigate(`/perfil`);
  };

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="60px"
      alignItems="center"
      background="blue.600"
      justifyContent={{ base: "space-between", md: "space-between" }}
      {...rest}
    >
      {backRoute ? (
        <Flex align="center" display={{ base: "none", md: "flex" }}>
          <IconButton
            display={{ base: "none", md: "flex" }}
            size="lg"
            variant="ghost"
            height="40px"
            width="40px"
            color="white"
            aria-label="open menu"
            icon={<BiArrowBack />}
            onClick={() => navigate(-1)}
            _hover={{
              bg: "transparent",
            }}
          />
          <Text color="white">Voltar</Text>
        </Flex>
      ) : (
        <Flex></Flex>
      )}

      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Box height="40px" display={{ base: "flex", md: "none" }}>
        <Image src={LogoWhite} alt="Logo" />
      </Box>

      <HStack spacing={{ base: "0", md: "6" }}>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar
                  size={"sm"}
                  src={
                    user?.avatar_url
                      ? user?.avatar_url
                      : "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                  }
                />
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem onClick={handleNavigatePerfil}>Perfil</MenuItem>
              <MenuDivider />
              <MenuItem onClick={signOut}>Sair</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
