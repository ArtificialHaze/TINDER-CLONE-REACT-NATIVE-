import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import getMatchedUserInfo from "./getMatchedUserInfo";
import useAuth from "./useAuth";
import { useRoute } from "@react-navigation/native";
import { Button } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import SendMessage from "./SendMessage";
import RecieverMessage from "./RecieverMessage";
import { collection, query, onSnapshot, orderBy } from "@firebase";
import { db } from "./firebase";

const MessageScreen = () => {
  const { user } = useAuth();
  const { params } = useRoute();
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState("");

  const { matchedDetails } = params;

  const sendMessage = () => {
    addDoc(collection(db, "matches", matchedDetails.id, "messages"), {
      timestamp: serverTimestamp(),
      userId: user.uid,
      displayName: user.displayName,
      photoURL: matchedDetails.users[user.uid].photoURL,
    });

    setInput("");
  };

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches", matchedDetails.id, "messages"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) =>
          setMessages(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          )
      ),
    [matchedDetails, db]
  );

  return (
    <SafeAreaView style={tw`flex-1`}>
      <Header
        callEnabled
        title={getMatchedUserInfo(matchedDetails.users, user.uid).displayName}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            inverted={-1}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ message }) =>
              message.userId === user.uid ? (
                <SendMessage key={message.id} message={message} />
              ) : (
                <RecieverMessage key={message.id} message={message} />
              )
            }
            style={tw`pl-4`}
          />
        </TouchableWithoutFeedback>
        <View
          style={tw`flex-row bg-white justify-between items-center border-t border-gray-200 px-5 py-2`}
        >
          <TextInput
            style={tw`h-10 text-lg`}
            placeholder="Send a Message"
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            value={input}
          />
          <Button title={"Send"} color="#ff5864" onPress={sendMessage} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({});
