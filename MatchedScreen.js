import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";
import { Image } from "react-native-elements";

const MatchedScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();

  const { loggedInProfile, userSwipe } = params;

  return (
    <View style={[tw`h-full bg-red-500 pt-20`, { opacity: 0.9 }]}>
      <View style={tw`justify-center px-10 pt-20`}>
        <Image style={tw`h-20 w-full`} source={{ uri: "" }} />
      </View>
      <Text style={tw`text-white text-center mt-5`}>
        You and {userSwipe.displayName} have liked each other.
      </Text>
      <View style={tw`justify-evenly mt-5 flex-row`}>
        <Image
          source={{ uri: loggedInProfile.photoURL }}
          style={tw`h-32 w-32 rounded-full`}
        />
        <Image
          source={{ uri: userSwipe.photoURL }}
          style={tw`h-32 w-32 rounded-full`}
        />
      </View>
      <TouchableOpacity>
        <Text
          style={tw`bg-white m-5 px-10 py-8 rounded-full mt-20`}
          onPress={() => {
            navigation.goBack();
            navigation.navigate("Chat");
          }}
        >
          Send a Message
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MatchedScreen;

const styles = StyleSheet.create({});
