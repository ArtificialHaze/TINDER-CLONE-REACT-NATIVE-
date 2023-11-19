import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "tailwind-react-native-classnames";
import useAuth from "./useAuth";
import ChatRow from "./ChatRow";

const ChatList = () => {
  const [matches, setMatches] = useState([]);
  const { user } = useAuth();

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches"),
          where("usersMatched", "array-contains", user.uid)
        ),
        (snapshot) =>
          setMatches(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          )
      ),
    [user]
  );

  return matches.length > 0 ? (
    <FlatList
      style={tw`h-full`}
      renderItem={({ item }) => <ChatRow matchedDetails={item} />}
      data={matches}
      keyExtractor={(item) => item.id}
    />
  ) : (
    <View style={tw`p-5`}>
      <Text style={tw`text-center text-lg`}>No matches at the moment.</Text>
    </View>
  );
};

export default ChatList;

const styles = StyleSheet.create({});
