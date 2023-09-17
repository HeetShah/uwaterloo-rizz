import {
  Box,
  Flex,
  Avatar,
  HStack,
  Text,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook

const Links = ["Home", "Profile", "Matches"]; // Define your navigation links

// @ts-ignore
const NavLink = (props) => {
  const { children } = props;
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={"#"}
    >
      {children}
    </Box>
  );
};

export default function Navbar() {
  const navBarLogout = () => {
    logout().then(() => {
      window.location.href = "/";
    });
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout } = useAuth(); // Get user and logout function from AuthContext

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box onClick={() => (window.location.href = "/")}>UWaterloo Rizz</Box>
          </HStack>

          {/* Need to put Home, Profile and Match */}

          <Flex alignItems={"center"}>
            {user ? (
              <div>
                <Button
                  variant={"solid"}
                  size={"sm"}
                  mr={4}
                  onClick={() => (window.location.href = "/meet")}
                >
                  Meet
                </Button>
                <Button
                  variant={"solid"}
                  size={"sm"}
                  mr={4}
                  onClick={() => (window.location.href = "/profile")}
                >
                  Profile
                </Button>

                <Button
                  variant={"solid"}
                  size={"sm"}
                  mr={4}
                  onClick={() => (window.location.href = "/matches")}
                >
                  Matches
                </Button>

                <Button
                  variant={"solid"}
                  colorScheme={"teal"}
                  size={"sm"}
                  mr={4}
                  onClick={navBarLogout} // Call the logout function
                >
                  Logout
                </Button>
              </div>
            ) : (
              // Display a login button when the user is not signed in

              <div>
                <Button
                  onClick={() => (window.location.href = "/getstarted")}
                  variant={"solid"}
                  colorScheme={"teal"}
                  size={"sm"}
                  mr={4}
                >
                  Get Started
                </Button>
              </div>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
