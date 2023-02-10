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
  VStack,
} from "@chakra-ui/react";
import { ReactNode, ReactText, useEffect, useState } from "react";
import { IconType } from "react-icons";
import { BiArrowBack, BiTask } from "react-icons/bi";
import { BsListTask } from "react-icons/bs";
import { FiChevronDown, FiHome, FiMenu } from "react-icons/fi";
import { RiTeamLine } from "react-icons/ri";
import { SiMicrosoftteams } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import LogoWhite from "../assets/logoWhite.png";
interface LinkItemProps {
  name: string;
  route: string;
  icon: IconType;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Home", route: "/", icon: FiHome },
  { name: "Cadastro Equipe", route: "/equipe", icon: RiTeamLine },
  { name: "Cadastro Eleitor", route: "/eleitor", icon: SiMicrosoftteams },
  { name: "Demandas", route: "/demanda", icon: BsListTask },
  { name: "Tarefas", route: "/tarefa", icon: BiTask },
];

export default function SidebarWithHeader({
  children,
}: {
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [screenHeight, setScreenHeight] = useState(`calc(100vh - 60px)`);

  useEffect(() => {
    setScreenHeight(`calc(${window.innerHeight}px - 60px)`);
  }, []);

  return (
    <Box minH="100vh" bg="white">
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
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="26px" bg="gray.100" h={screenHeight}>
        <Box bgColor="white" h="100%" borderRadius="8px">
          {children}
        </Box>
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const navigate = useNavigate();
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

      {LinkItems.map((link) => (
        <NavItem
          onClick={() => navigate(`${link.route}`)}
          key={link.name}
          icon={link.icon}
        >
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Link
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
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
          bg: "#0066AA",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            color="gray.500"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="60px"
      alignItems="center"
      background="#0066AA"
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "space-between" }}
      {...rest}
    >
      <Flex align="center">
        <IconButton
          display={{ base: "none", md: "flex" }}
          size="lg"
          variant="ghost"
          height="40px"
          width="40px"
          color="white"
          aria-label="open menu"
          icon={<BiArrowBack />}
        />
        <Text>Voltar</Text>
      </Flex>
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
              <MenuItem>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
