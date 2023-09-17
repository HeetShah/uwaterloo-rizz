import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Box, Center, Flex, Image, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { FaFacebook, FaInstagram, FaPhone } from "react-icons/fa";
import { SiLinkedin, SiPhonepe, SiVsco } from "react-icons/si";
import { Input } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";

import { useAuth } from "../context/AuthContext";

// Define an interface for the user profile
interface UserProfile {
  name: string;
  bio: string;
  instagramLink: string;
  facebookLink: string;
  vscoLink: string;
  linkedinLink: string;
  phoneLink: string;
  image?: string;
  profileID: string;
}

export default function Matches() {
  const [matchedProfiles, setMatchedProfiles] = useState<UserProfile[]>([]);

  const { user } = useAuth();

  const [userID, setUserID] = useState(user?.uid);

  const fetchMatchedProfiles = async (userID: string) => {
    console.log("Fetching matched profiles for user ID:", userID);

    try {
      const userDocRef = doc(db, "users", userID);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const matchedProfiles = userDoc.data().matches;

        console.log("Matched profiles:", matchedProfiles);

        const matchedProfilesArray: UserProfile[] = [];

        for (const profileID in matchedProfiles) {
          const profileDocRef = doc(db, "users", profileID);
          const profileDoc = await getDoc(profileDocRef);

          if (profileDoc.exists()) {
            const profile = profileDoc.data();
            const userProfile: UserProfile = {
              name: profile.profile.name,
              bio: profile.profile.bio,
              instagramLink: profile.profile.instagramLink,
              facebookLink: profile.profile.facebookLink,
              vscoLink: profile.profile.vscoLink,
              linkedinLink: profile.profile.linkedinLink,
              phoneLink: profile.profile.phoneLink,
              image: profile.profile.image,
              profileID: profileID,
            };

            const imageUrl = await fetchUserProfilePicture(profileID);
            userProfile.image = imageUrl;

            matchedProfilesArray.push(userProfile);
          }
        }

        setMatchedProfiles(matchedProfilesArray);
      }
    } catch (error) {
      console.error("Error fetching matched profiles:", error);
    }
  };

  const fetchUserProfilePicture = async (userID: string) => {
    try {
      const storage = getStorage();
      const imageUrl = await getDownloadURL(ref(storage, "images/" + userID));

      // Set the downloaded image URL in the state
      return imageUrl;
    } catch (error) {
      console.error("Error fetching user profile picture:", error);
    }
  };

  useEffect(() => {
    // setUserId after 2 seconds
    setTimeout(() => {
      setUserID(user?.uid);
      fetchMatchedProfiles(user?.uid);
    }, 2000);

    console.log("User ID:", userID);
  }, [user?.uid, userID]);

  return (
    <div>
      <Navbar />

      <SimpleGrid columns={{ base: 1, md: 1 }} spacing={10} mt={10}>
        {matchedProfiles.map((profile, index) => (
          <Flex key={index} direction={"column"} shadow={"lg"}>
            <Stack
              direction={"column"}
              justify={"center"}
              align={"center"}
              p={8}
              rounded={"xl"}
              minH={"240px"}
            >
              <Box
                position={"relative"}
                rounded={"full"}
                boxShadow={"lg"}
                boxSize={"150px"}
                overflow={"hidden"}
              >
                <Image fit={"cover"} align={"center"} w={"100%"} h={"100%"} src={profile.image} />
              </Box>

              <Text fontSize={"xl"} fontWeight={600} mt={4}>
                {profile.name}
              </Text>

              <Text fontSize={"md"} color={"gray.500"} mt={2}>
                {profile.bio}
              </Text>

              <Box mt={4} pt={20}>
                {/* Instagram */}
                <Button w={"full"} backgroundColor={"purple.300"} leftIcon={<FaInstagram />}>
                  <Center>
                    <Input value={profile.instagramLink} variant="unstyled" />
                  </Center>
                </Button>

                {/* Facebook */}
                <Button w={"full"} backgroundColor={"blue.300"} leftIcon={<FaFacebook />}>
                  <Center>
                    <Input value={profile.facebookLink} variant="unstyled" />
                  </Center>
                </Button>

                {/* VSCO */}
                <Button w={"full"} backgroundColor={"black.400"} leftIcon={<SiVsco />}>
                  <Center>
                    <Input value={profile.vscoLink} variant="unstyled" />
                  </Center>
                </Button>

                {/* LinkedIn */}
                <Button w={"full"} backgroundColor={"blue.500"} leftIcon={<SiLinkedin />}>
                  <Center>
                    <Input value={profile.linkedinLink} variant="unstyled" />
                  </Center>
                </Button>

                {/* Phone */}
                <Button w={"full"} backgroundColor={"blue.500"} leftIcon={<FaPhone />}>
                  <Center>
                    <Input value={profile.phoneLink} variant="unstyled" />
                  </Center>
                </Button>
              </Box>
            </Stack>
          </Flex>
        ))}
      </SimpleGrid>
    </div>
  );
}
