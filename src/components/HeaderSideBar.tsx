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
import { RiTeamLine } from "react-icons/ri";
import { SiMicrosoftteams } from "react-icons/si";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import LogoWhite from "../assets/logoWhite.png";
import { useAuth } from "../contexts/AuthContext";
import { usePermission } from "../contexts/PermissionContext";

interface LinkItemProps {
  name: string;
  route: string;
  icon: IconType;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Home", route: "/", icon: FiHome },
  { name: "Equipe", route: "/equipe", icon: RiTeamLine },
  { name: "Eleitor", route: "/eleitor", icon: SiMicrosoftteams },
  { name: "Demandas", route: "/demanda", icon: BsListTask },
  { name: "Tarefas", route: "/tarefa", icon: BiTask },
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
  const { pathname } = useLocation();
  const { permissionData } = usePermission();
  console.log("permissionData", permissionData);
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
          <Image src={Logo} alt="Logo" />
        </Box>
        <CloseButton
          display={{ base: "flex", md: "none" }}
          onClick={onClose}
          bg="blue.600"
        />
      </Flex>
      {LinkItems.map((link) =>
        pathname === link.route ? (
          <Link
            style={{ textDecoration: "none" }}
            _focus={{ boxShadow: "none" }}
            onClick={() => navigate(`${link.route}`)}
            key={link.name}
          >
            <Flex
              align="center"
              p="4"
              mx="4"
              borderRadius="lg"
              role="group"
              cursor="pointer"
              color="white"
              bg="blue.600"
              {...rest}
            >
              <Icon
                mr="4"
                color="white"
                fontSize="16"
                _groupHover={{
                  color: "white",
                }}
                as={link.icon}
              />
              {link.name}
            </Flex>
          </Link>
        ) : (
          <Link
            style={{ textDecoration: "none" }}
            _focus={{ boxShadow: "none" }}
            onClick={() => navigate(`${link.route}`)}
            key={link.name}
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
                bg: "blue.600",
                color: "white",
              }}
              {...rest}
            >
              <Icon
                mr="4"
                color="gray.500"
                fontSize="16"
                _groupHover={{
                  color: "white",
                }}
                as={link.icon}
              />
              {link.name}
            </Flex>
          </Link>
        )
      )}
    </Box>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
  backRoute?: boolean;
}
const MobileNav = ({ onOpen, backRoute, ...rest }: MobileProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

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
                    "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                  }
                />
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Billing</MenuItem>
              <MenuDivider />
              <MenuItem onClick={signOut}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
