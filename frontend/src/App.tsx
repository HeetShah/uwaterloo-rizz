import React from "react";
import "./App.css";
import Card from "./components/card";

import Profile from "./pages/profile";
import Navbar from "./components/Navbar";
import { Box, Flex, Heading, Text, Stack, Avatar, Button } from "@chakra-ui/react";

function App() {
  const handleData = () => {};

  return (
    <div className="App">
      <Navbar />

      <Flex minH={"100vh"} align={"center"} justify={"center"}>
        <Box
          maxW={"500px"}
          h={"full"}
          w={"full"}
          //   bg={useColorModeValue("white", "gray.900")}
          boxShadow={"2xl"}
          rounded={"lg"}
          p={6}
          textAlign={"center"}
        >
          <Heading fontSize={"2xl"} fontFamily={"body"}>
            Welcome to UWaterloo Rizz!
          </Heading>
        </Box>
      </Flex>
    </div>
  );
}

export default App;
