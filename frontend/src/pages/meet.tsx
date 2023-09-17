import Navbar from "../components/Navbar";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { FaFacebook, FaInstagram, FaPhone, FaSave } from "react-icons/fa";
import { SiLinkedin, SiVsco } from "react-icons/si";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  SimpleGrid,
  useColorModeValue,
  Input,
} from "@chakra-ui/react";
import { doc, setDoc } from "firebase/firestore";
import { addDoc } from "firebase/firestore";
import { getDoc } from "firebase/firestore";

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

export default function Meet() {
  const { user } = useAuth();
  const [userID, setUserID] = useState(user?.uid);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);

  const likedHandler = (profileID: string, userID: string) => async () => {
    try {
      const userDocRef = doc(db, "users", userID);

      // Step 1: Add the liked profile's ID to the current user's liked collection
      await setDoc(
        userDocRef,
        {
          liked: {
            [profileID]: true,
          },
        },
        { merge: true }
      );

      // Step 2: Check if there's a mutual like (match)
      const likedProfileDocRef = doc(db, "users", profileID);
      const likedProfileDoc = await getDoc(likedProfileDocRef);

      if (likedProfileDoc.exists()) {
        const likedProfileData = likedProfileDoc.data();

        console.log("Liked profile data:", likedProfileData);

        // Check if the current user's ID exists in the liked profile's liked collection
        if (likedProfileData?.liked[userID]) {
          console.log("Match!");
          // Add the current user's ID to the liked profile's matches collection
          await setDoc(
            likedProfileDocRef,
            {
              matches: {
                [userID]: true,
              },
            },
            { merge: true }
          );

          // Add the liked profile's ID to the current user's matches collection
          await setDoc(
            userDocRef,
            {
              matches: {
                [profileID]: true,
              },
            },
            { merge: true }
          );
        } else {
          console.log("No match!");
        }
      }
    } catch (error) {
      console.error("Error liking profile:", error);
    }
  };

  const dislikedHandler = (profileID: string) => async () => {
    try {
      const userDocRef = doc(db, "users", userID);

      await setDoc(
        userDocRef,
        {
          disliked: {
            [profileID]: true,
          },
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error disliking profile:", error);
    }
  };

  const fetchUserProfilePicture = async (userID: string) => {
    try {
      const storage = getStorage();
      const imageURL = await getDownloadURL(ref(storage, "images/" + userID));
      return imageURL;
    } catch (error) {
      console.error("Error fetching user profile picture:", error);
    }
  };

  const fetchAllUserProfiles = async () => {
    try {
      const profilesRef = collection(db, "users");
      const snapshot = await getDocs(profilesRef);
      const profiles: UserProfile[] = [];

      snapshot.forEach(async (doc) => {
        const profileData = doc.data().profile;
        const profileObject: UserProfile = {
          name: profileData.name,
          bio: profileData.bio,
          instagramLink: profileData.instagramLink,
          facebookLink: profileData.facebookLink,
          vscoLink: profileData.vscoLink,
          linkedinLink: profileData.linkedinLink,
          phoneLink: profileData.phoneLink,
          profileID: profileData.userID,
        };

        const imageURL = await fetchUserProfilePicture(doc.id);
        profileObject.image = imageURL;

        profiles.push(profileObject);
      });

      setUserProfiles(profiles);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setUserID(user?.uid);
    }, 2000);
  }, [user?.uid, userID]);

  useEffect(() => {
    fetchAllUserProfiles();
  }, []);

  return (
    <div>
      <Navbar />

      <SimpleGrid columns={{ base: 1, md: 1 }} spacing={10} mt={10}>
        {userProfiles.map((profile, index) => (
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
                <Image
                  alt={"Profile image"}
                  fit={"cover"}
                  align={"center"}
                  w={"100%"}
                  h={"100%"}
                  src={profile.image}
                />
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

                {/* No */}
                <Button
                  onClick={dislikedHandler(profile.profileID)}
                  w={"50%"}
                  backgroundColor={"green.500"}
                >
                  <Center>
                    <Input value={"Noooooo"} variant="unstyled" />
                  </Center>
                </Button>

                {/* Yes */}
                <Button
                  onClick={likedHandler(profile.profileID, userID)}
                  w={"50%"}
                  backgroundColor={"red.500"}
                >
                  <Center>
                    <Input value={"Yes"} variant="unstyled" />
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
