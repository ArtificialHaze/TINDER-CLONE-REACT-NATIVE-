import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./HomeScreen";
import ChatScreen from "./ChatScreen";
import LoginScreen from "./LoginScreen";
import useAuth, { AuthProvider } from "./useAuth";
import ModalScreen from "./ModalScreen";
import MatchedScreen from "./MatchedScreen";
import MessageScreen from "./MessageScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {user ? (
            <>
              <Stack.Group>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Chat" component={ChatScreen} />
                <Stack.Screen name="Message" component={MessageScreen} />
              </Stack.Group>
              <Stack.Group screenOptions={{ presentation: "modal" }}>
                <Stack.Screen name="Chat" component={ModalScreen} />
              </Stack.Group>
              <Stack.Group screenOptions={{ presentation: "transparentModal" }}>
                <Stack.Screen name="Match" component={MatchedScreen} />
              </Stack.Group>
            </>
          ) : (
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              // options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}
