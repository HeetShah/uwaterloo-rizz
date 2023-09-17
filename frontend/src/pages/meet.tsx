import Navbar from "../components/Navbar";
import { Box, Heading, SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { Flex } from "@chakra-ui/layout";

// Define an interface for the user profile
interface UserProfile {
  name: string;
  bio: string;
  instagramLink: string;
  facebookLink: string;
  vscoLink: string;
  linkedinLink: string;
  phoneLink: string;
  image: string; // You might want to change this to the appropriate type
}

export default function Meet() {
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const { user } = useAuth();

  const fetchAllUserProfiles = async () => {
    try {
      // Create a reference to the collection of user profiles
      const profilesRef = collection(db, "users");

      // Fetch the documents from the collection
      const snapshot = await getDocs(profilesRef);

      // Initialize an array to store user profiles
      const profiles: UserProfile[] = [];

      // Iterate through the documents and extract user profiles
      snapshot.forEach((doc) => {
        const profileData = doc.data().profile;
        const profileObject: UserProfile = {
          name: profileData.name,
          bio: profileData.bio,
          instagramLink: profileData.instagramLink,
          facebookLink: profileData.facebookLink,
          vscoLink: profileData.vscoLink,
          linkedinLink: profileData.linkedinLink,
          phoneLink: profileData.phoneLink,
          image: profileData.image,
        };

        profiles.push(profileObject);
      });

      setUserProfiles(profiles);

      console.log("User profiles:", userProfiles);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
    }
  };

  useEffect(() => {
    // Fetch user profiles when the component mounts
    fetchAllUserProfiles();
  }, []);

  return (
    <div>
      <Navbar />

      <SimpleGrid columns={3} spacing={10} mt={10}>
        {userProfiles.map((profile, index) => (
          <Flex key={index} direction={"column"} shadow={"lg"}>
            <Box
              h={"120px"}
              bg={"gray.100"}
              mt={-6}
              mx={-6}
              mb={6}
              pos={"relative"}
              _after={{
                content: '""',
                w: "full",
                h: "full",
                pos: "absolute",
                top: 5,
                left: 0,
                backgroundImage: `url(${profile.image})`,
                filter: "blur(15px)",
                zIndex: -1,
              }}
              _groupHover={{
                _after: {
                  filter: "blur(20px)",
                },
              }}
            >
              <Box
                bg={"gray.100"}
                bgPos={"center"}
                bgSize={"cover"}
                w={"full"}
                h={"full"}
                pos={"relative"}
                bgImage={`url(${profile.image})`}
              >
                <Box
                  w={"full"}
                  h={"full"}
                  pos={"absolute"}
                  top={0}
                  left={0}
                  bgGradient={"linear(to-b, transparent, black)"}
                  opacity={0.4}
                />
              </Box>
            </Box>
            <Box px={6} py={10}>
              <Heading fontSize={"2xl"} fontFamily={"body"} fontWeight={500} mb={2}>
                {profile.name}
              </Heading>
              <Text textAlign={"center"} px={3} mb={3} fontSize={"lg"}>
                {profile.bio}
              </Text>
              <Text textAlign={"center"} color={"gray.500"} px={3}>
                {profile.instagramLink}
              </Text>
            </Box>
          </Flex>
        ))}
      </SimpleGrid>
    </div>
  );
}
