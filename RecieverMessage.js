import { StyleSheet, Text, View } from "react-native";
import React from "react";
import tw from "tailwind-react-native-classnames";
import { Image } from "react-native-elements";

const RecieverMessage = ({ message }) => {
  return (
    <View
      style={[
        tw`bg-red-400 rounded-lg rounde-tl-none px-5 py-3 my-2 ml-4`,
        { alignSelf: "flex-start" },
      ]}
    >
      <Image
        source={{ uri: message.photoURL }}
        style={tw`h-12 w-12 rounded-full absolute top-0 -left-14`}
      />
      <Text style={tw`text-white`}>{message.message}</Text>
    </View>
  );
};

export default RecieverMessage;

const styles = StyleSheet.create({});
