import {
  Badge,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useColorModeValue,
  Input,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaFacebook, FaInstagram, FaPhone, FaSave } from "react-icons/fa";
import { SiLinkedin, SiVsco } from "react-icons/si";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export default function ProfileCard() {
  const { user } = useAuth();

  const [userID, setUserID] = useState(user?.uid); // [state, setState
  const [name, setName] = useState("First last");
  const [bio, setBio] = useState("A few words about yourself? ");
  const [instagramLink, setInstagramLink] = useState("We know you have one!");
  const [facebookLink, setFacebookLink] = useState("If you're a boomer");
  const [vscoLink, setVscoLink] = useState("Ones not on instagram?");
  const [linkedinLink, setLinkedinLink] = useState("It's Waterloo...");
  const [phoneLink, setPhoneLink] = useState("Call me maybe?");
  const [image, setImage] = useState("");

  useEffect(() => {
    // setUserId after 2 seconds
    setTimeout(() => {
      setUserID(user?.uid);
      getProfileDataFromFirestore();
    }, 2000);

    console.log("User ID:", userID);
  }, [user?.uid, userID]);

  const getProfileDataFromFirestore = async () => {
    try {
      // Create a reference to the user's document
      const userDocRef = doc(db, "users", userID);

      // Fetch the document
      const userDoc = await getDoc(userDocRef);

      // If the document exists
      if (userDoc.exists()) {
        setName(userDoc.data().profile.name);
        setBio(userDoc.data().profile.bio);
        setInstagramLink(userDoc.data().profile.instagramLink);
        setFacebookLink(userDoc.data().profile.facebookLink);
        setVscoLink(userDoc.data().profile.vscoLink);
        setLinkedinLink(userDoc.data().profile.linkedinLink);
        setPhoneLink(userDoc.data().profile.phoneLink);

        const storage = getStorage();
        const imageUrl = await getDownloadURL(ref(storage, "images/" + userID));

        // Set the downloaded image URL in the state
        setImage(imageUrl);
      } else {
        // User does not exist
        console.log("User does not exist");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getProfileDataFromFirestore();
  }, [userID]);

  // @ts-ignore
  const handleImageUpload = (event) => {
    setUserID(user?.uid);
    console.log("User ID:", userID);
    const file = event.target.files[0]; // Get the uploaded file
    const storage = getStorage();
    const fileRef = ref(storage, "images/" + userID);
    uploadBytes(fileRef, file);

    setImage(file);
  };

  const saveProfileDataToFirestore = async () => {
    try {
      // Define the data to be sa   ved

      const storage = getStorage();
      const imageRef = ref(storage, "images/" + userID).toString();

      const userData = {
        name,
        bio,
        instagramLink,
        facebookLink,
        vscoLink,
        linkedinLink,
        phoneLink,
        imageRef,
        userID,
      };

      console.log(userData);

      setUserID(user?.uid);

      // Create a reference to the user's document
      const userDocRef = doc(db, "users", userID);

      await setDoc(userDocRef, {
        profile: {
          name,
          bio,
          instagramLink,
          facebookLink,
          vscoLink,
          linkedinLink,
          phoneLink,
          imageRef,
          userID,
        },
      });

      console.log("Profile data saved to Firestore");
    } catch (error) {
      console.error("Error saving profile data:", error);
    }
  };

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"}>
      <Stack
        borderWidth="1px"
        borderRadius="lg"
        w={{ sm: "100%", md: "800px" }}
        height={{ sm: "600px", md: "30rem" }}
        direction={{ base: "column", md: "row" }}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        padding={4}
      >
        <Flex flex={1} bg="blue.200">
          {image ? (
            <Image
              objectFit="cover"
              boxSize="100%"
              // @ts-ignore
              src={image}
              alt="#"
            />
          ) : (
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          )}
        </Flex>
        <Stack
          flex={1}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          p={2}
          pt={20}
        >
          <Heading fontSize={"2xl"} fontFamily={"body"} w={"full"}>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Heading>

          <Text w={"full"} color={useColorModeValue("gray.700", "gray.400")}>
            <Input h={"100px"} value={bio} onChange={(e) => setBio(e.target.value)} />
          </Text>

          {/* Instagram */}
          <Button w={"full"} backgroundColor={"purple.300"} leftIcon={<FaInstagram />}>
            <Center>
              <Input
                value={instagramLink}
                onChange={(e) => setInstagramLink(e.target.value)}
                variant="unstyled"
              />
            </Center>
          </Button>

          {/* Facebook */}
          <Button w={"full"} backgroundColor={"blue.300"} leftIcon={<FaFacebook />}>
            <Center>
              <Input
                value={facebookLink}
                onChange={(e) => setFacebookLink(e.target.value)}
                variant="unstyled"
              />
            </Center>
          </Button>

          {/* VSCO */}
          <Button w={"full"} backgroundColor={"black.400"} leftIcon={<SiVsco />}>
            <Center>
              <Input
                value={vscoLink}
                onChange={(e) => setVscoLink(e.target.value)}
                variant="unstyled"
              />
            </Center>
          </Button>

          {/* LinkedIn */}
          <Button w={"full"} backgroundColor={"blue.500"} leftIcon={<SiLinkedin />}>
            <Center>
              <Input
                value={linkedinLink}
                onChange={(e) => setLinkedinLink(e.target.value)}
                variant="unstyled"
              />
            </Center>
          </Button>

          {/* Phone */}
          <Button w={"full"} backgroundColor={"green.300"} leftIcon={<FaPhone />}>
            <Center>
              <Input
                value={phoneLink}
                onChange={(e) => setPhoneLink(e.target.value)}
                variant="unstyled"
              />
            </Center>
          </Button>

          <Button
            w={"full"}
            backgroundColor={"teal.300"}
            leftIcon={<FaSave />}
            onClick={saveProfileDataToFirestore}
          >
            <Center>
              <Text>Save</Text>
            </Center>
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
