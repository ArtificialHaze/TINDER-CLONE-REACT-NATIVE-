import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useLayoutEffect } from "react";
import useAuth from "./useAuth";
import { useNavigation } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";

const LoginScreen = () => {
  const { signInWithGoogle, isLoading } = useAuth();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <View style={tw`flex-1`}>
      <ImageBackground
        resizeMode="cover"
        style={tw`flex-1`}
        source={{ uri: "" }}
      >
        <TouchableOpacity
          onPress={signInWithGoogle}
          style={[
            tw`absolute bottom-40 p-4 rounded-2xl bg-white w-52`,
            { marginHorizontal: "25%" },
          ]}
        >
          <Text style={tw`font-semibold text-center`}>
            Sign in and get swiping
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
