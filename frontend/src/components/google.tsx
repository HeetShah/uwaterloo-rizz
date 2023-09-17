import { Box, Text, Button, Flex } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import React from "react";

type GoogleButtonProps = {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export default function GoogleButton({ onClick }: GoogleButtonProps) {
  const handleButtonClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (onClick) {
      await onClick(event);
    }
  };

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"}>
      <Box maxW={"500px"} h={"full"} w={"full"} rounded={"lg"} p={6} textAlign={"center"}>
        <Button w={"full"} variant={"outline"} leftIcon={<FcGoogle />} onClick={handleButtonClick}>
          <Text>Sign in with Google</Text>
        </Button>
      </Box>
    </Flex>
  );
}
