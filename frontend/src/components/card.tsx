import { Heading, Avatar, Box, Center, Text, Stack, Button, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/react";

export default function Card() {
  const [response, setResponse] = useState("");

  const handleData = async () => {
    await fetch("https://randomuser.me/api/")
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setResponse(data.results[0]);
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(response);
  };

  useEffect(() => {
    handleData();
  }, []);

  if (response !== "") {
    return (
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
          <Avatar
            size={"xl"}
            src={"https://avatars.githubusercontent.com/u/1961952?v=4"}
            mb={4}
            pos={"relative"}
            _after={{
              content: '""',
              w: 4,
              h: 4,
              bg: "green.300",
              border: "2px solid white",
              rounded: "full",
              pos: "absolute",
              bottom: 0,
              right: 3,
            }}
          />
          <Heading fontSize={"2xl"} fontFamily={"body"}>
            "Heet Shah"
          </Heading>
          <Text fontWeight={600} color={"gray.500"} mb={4}>
            "someone@gmail.com"
          </Text>
          {/* <Text textAlign={"center"} color={useColorModeValue("gray.700", "gray.400")} px={3}> */}
          {/* <Text textAlign={"center"} px={3}>
              Actress, musician, songwriter and artist. PM for work inquires or #tag me in your posts
            </Text> */}

          {/* <Stack align={"center"} justify={"center"} direction={"row"} mt={6}>
              <Badge px={2} py={1} bg={useColorModeValue("gray.50", "gray.800")} fontWeight={"400"}>
                #art
              </Badge>
              <Badge px={2} py={1} bg={useColorModeValue("gray.50", "gray.800")} fontWeight={"400"}>
                #photography
              </Badge>
              <Badge px={2} py={1} bg={useColorModeValue("gray.50", "gray.800")} fontWeight={"400"}>
                #music
              </Badge>
            </Stack> */}

          <Stack mt={8} direction={"row"} spacing={4}>
            <Button
              flex={1}
              fontSize={"md"}
              backgroundColor={"red.300"}
              _focus={{
                bg: "red.200",
              }}
              onClick={handleData}
            >
              Nah :(
            </Button>
            <Button
              flex={1}
              fontSize={"md"}
              _focus={{
                bg: "green.200",
              }}
              backgroundColor={"green.300"}
              onClick={handleData}
            >
              Oh Yeah!
            </Button>
            {/* <Button
                flex={1}
                fontSize={"sm"}
                rounded={"full"}
                bg={"blue.400"}
                color={"white"}
                boxShadow={
                  "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
                }
                _hover={{
                  bg: "blue.500",
                }}
                _focus={{
                  bg: "blue.500",
                }}
              >
                Follow
              </Button> */}
          </Stack>
        </Box>
      </Flex>
    );
  } else {
    return (
      <Center py={6}>
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Center>
    );
  }
}
