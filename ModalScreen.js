import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useLayoutEffect } from "react";
import tw from "tailwind-react-native-classnames";
import { Image } from "react-native-elements/dist/image/Image";
import useAuth from "./useAuth";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { setDoc, doc } from "@firebase/firestore";
import { db } from "./firebase";

const ModalScreen = () => {
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [job, setJob] = useState(null);
  const [age, setAge] = useState(null);

  const navigation = useNavigation();

  const incomplete = !image || !job || !age;

  //   useLayoutEffect(() => {
  //     navigation.setOptions({
  //       headerShown: true,
  //       headerTitle: "Update your profile",
  //       headerStyle: {
  //         backgroundColor: "#ff5864",
  //       },
  //       headerTitleStyle: { color: "white" },
  //     });
  //   }, []);

  const updateUserProfile = () => {
    setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: image,
      job: job,
      age: age,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <View style={tw`flex-1 items-center pt-1`}>
      <Image
        style={tw`h-20 w-full`}
        resizeMode="contain"
        source={{ uri: "" }}
      />
      <Text style={tw`text-xl text-gray-500 p-2 font-bold`}>
        Welcome {user.displayName}
      </Text>
      <Text style={tw`text-center p-4 font-bold text-red-400`}>
        Step 1: The profile pic
      </Text>
      <TextInput
        value={image}
        onChangeText={(text) => setImage(text)}
        style={tw`text-center text-xl pb-2`}
        placeholder="Enter a profile pic URL"
      />
      <Text style={tw`text-center p-4 font-bold text-red-400`}>
        Step 2: The Job
      </Text>
      <TextInput
        value={job}
        onChangeText={(text) => setJob(text)}
        style={tw`text-center text-xl pb-2`}
        placeholder="Enter your occupation"
      />
      <Text style={tw`text-center p-4 font-bold text-red-400`}>
        Step 3: The Age
      </Text>
      <TextInput
        value={age}
        onChangeText={(text) => setAge(text)}
        style={tw`text-center text-xl pb-2`}
        placeholder="Enter your Age"
        keyboardType="numeric"
        maxLength={2}
      />
      <TouchableOpacity
        disabled={incomplete}
        style={[
          tw`w-64 p-3 rounded-xl absolute bottom-10`,
          incomplete ? tw`bg-gray-400` : tw`bg-red-400`,
        ]}
        onPress={updateUserProfile}
      >
        <Text style={tw`text-center text-white text-xl`}>Update profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModalScreen;

const styles = StyleSheet.create({});
