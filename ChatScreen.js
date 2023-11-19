import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import Header from "./Header";
import ChatList from "./ChatList";

const ChatScreen = () => {
  return (
    <SafeAreaView>
      <Header title="Chat" />
      <ChatList />
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
