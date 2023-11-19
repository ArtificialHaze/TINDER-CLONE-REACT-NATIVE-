import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Foundation } from "";
import { Ionicons } from "";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";

const Header = ({ title, callEnabled }) => {
  const navigation = useNavigation();

  return (
    <View style={tw`p-2 flex-row items-center justify-between`}>
      <View style={tw`flex flex-row items-center`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
          <Ionicons name="chevron-back-outline" size={34} color={"#ff5864"} />
        </TouchableOpacity>
        <Text style={tw`text-2xl font-bold pl-2`}>{title}</Text>
      </View>
      {callEnabled && (
        <TouchableOpacity style={tw`rounded-full mr-4 p-3 bg-red-300`}>
          <Foundation color="red" style={tw``} name="telephone" size={20} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
