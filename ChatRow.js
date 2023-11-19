import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import useAuth from "./useAuth";
import tw from "tailwind-react-native-classnames";
import getMatchedUserInfo from "./getMatchedUserInfo";
import { db } from "./firebase";
import { collection, query, onSnapshot, orderBy } from "@firebase";

const ChatRow = ({ matchedDetails }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [matchedUserInfo, setMatchedUserInfo] = useState(null);

  const [lastMessage, setLastMessage] = useState("");

  useEffect(() => {
    setMatchedUserInfo(getMatchedUserInfo(matchedDetails.users, user.uid));
  }, [matchedDetails, user]);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches", matchedDetails.id, "messages"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setLastMessage(snapshot.docs[0]?.data()?.message)
      ),
    [matchedDetails, db]
  );

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Message", {
          matchedDetails,
        });
      }}
      style={[
        tw`flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg`,
        styles.cardShadow,
      ]}
    >
      <Image
        source={{ uri: matchedUserInfo?.photoURL }}
        style={tw`rounded-full h-16 w-16 mr-4`}
      />
      <View>
        <Text style={tw`text-lg font-semibold`}>
          {matchedUserInfo?.displayName}
        </Text>
        <Text>{lastMessage || "Say hi!"}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatRow;

const styles = StyleSheet.create({
  cardShadow: {},
});
