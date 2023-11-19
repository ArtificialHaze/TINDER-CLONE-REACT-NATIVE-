import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import useAuth from "./useAuth";
import tw from "tailwind-react-native-classnames";
import { AntDesign, Entypo, Ionicons } from "react-native-vector-icons";
import Swiper from "react-native-deck-swiper";
import { useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  getDocs,
  where,
} from "@firebase/firestore";
import { db } from "./firebase";
import generateId from "./generateid";

const DUMMY_DATA = [
  {
    id: 1,
    firstName: "",
    lastName: "",
    occupation: "",
    photoURL: "",
    age: 28,
  },
  {
    id: 2,
    firstName: "",
    lastName: "",
    occupation: "",
    photoURL: "",
    age: 25,
  },
  {
    id: 3,
    firstName: "",
    lastName: "",
    occupation: "",
    photoURL: "",
    age: 18,
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const { logOut, user } = useAuth();
  const swiperRef = useRef(null);

  const [profiles, setProfiles] = useState([]);

  useLayoutEffect(() => {
    const unsub = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
      if (!snapshot.exists()) {
        navigation.navigate("Modal");
      }
    });

    return unsub();
  }, []);

  useEffect(() => {
    let unsub;

    const fetchCards = async () => {
      const passes = await getDocs(
        collection(db, "users", user.uid, "passes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const swipes = await getDocs(
        collection(db, "users", user.uid, "passes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const passedUserIds = passes.length > 0 ? passes : ["test-01"];
      const swipedUserIds = swipes.length > 0 ? swipes : ["test-02"];

      unsub = onSnapshot(
        query(
          collection(db, "users"),
          where("id", "not-in", [...passedUserIds, ...swipedUserIds])
        ),
        (snapshot) => {
          setProfiles(
            snapshot.docs
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        }
      );
    };

    fetchCards();
  }, [db]);

  const swipeLeft = async (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwipe = profiles[cardIndex];
    setDoc(doc(db, "users", user.uid, "passes", userSwipe.id), userSwipe);
  };

  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwipe = profiles[cardIndex];

    const loggedInProfile = await (await getDocs(db, "users", user.uid)).data();

    getDocs(doc(db, "users", userSwipe.id, "swipes", user.uid)).then(
      (documentSnapshot) => {
        if (documentSnapshot.exists()) {
          console.log("Matched before you did!");
          setDoc(doc(db, "users", user.uid, "swipes", userSwipe.id), userSwipe);
          setDoc();
        } else {
          console.log("Did not get swiped on!");
        }
        setDoc(
          doc(db, "mathces", generateId(user.uid, userSwipe.id), {
            users: {
              [user.uid]: loggedInProfile,
              [userSwipe.id]: userSwipe,
            },
            usersMatched: [user.uid, userSwipe.id],
            timestamp: serverTimestamp(),
          })
        );
        navigation.navigate("Match", {
          loggedInProfile,
          userSwipe,
        });
      }
    );

    setDoc(doc(db, "users", user.uid, "swipes", userSwipe.id), userSwipe);
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`items-center relative`}>
        <TouchableOpacity onPress={logOut} style={tw`absolute left-5 top-3`}>
          <Image
            style={tw`h-10 w-10 rounded-full`}
            source={{ uri: user.photoURL }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Image style={tw`h-14 w-14`} source={{ uri: "[LOGO.PNG]" }} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Chat")}
          style={tw`absolute right-5 top-3`}
        >
          <Ionicons name="chatbubbles-sharp" size={30} color="#ff5864" />
        </TouchableOpacity>
      </View>
      <Button
        title="Go to Chat"
        onPress={() => navigation.navigate("Chat")}
      ></Button>
      <Button title="Logout" onPress={() => logOut()} />
      <View style={tw`flex-1 -mt-6`}>
        <Swiper
          ref={swiperRef}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          containerStyle={{ backgroundColor: "transparent" }}
          cards={profiles}
          onSwipedLeft={(cardIndex) => {
            swipeLeft(cardIndex);
          }}
          onSwipedRight={(cardIndex) => {
            swipeRight(cardIndex);
          }}
          backgroundColor="#4fd0e9"
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "MATCH",
              style: {
                label: {
                  color: "#4DED30",
                },
              },
            },
          }}
          renderCard={(card) =>
            card ? (
              <View
                key={card.id}
                style={tw`bg-white h-3/4 rounded-xl relative`}
              >
                <Image
                  style={tw`h-full w-full rounded-xl absolute top-0`}
                  source={{ uri: card.photoURL }}
                />
                <View
                  style={[
                    tw(
                      `absolute bottom-0 justify-between items-center flex-row px-6 py-2 rounded-b-xl bg-white w-full`
                    ),
                    styles.cardShadow,
                  ]}
                >
                  <View>
                    <Text style={tw`text-xl font-bold`}>
                      {card.displayName}
                    </Text>
                    <Text>{card.occupation}</Text>
                  </View>
                  <Text style={tw`text-2xl`}>{card.age}</Text>
                </View>
              </View>
            ) : (
              <View>
                <Text>No more profiles</Text>
                <Image
                  style={tw`h-20 w-full`}
                  source={{ uri: "" }}
                  resizeMode="contain"
                />
              </View>
            )
          }
        />
      </View>
      <View style={tw`justify-evenly flex flex-row`}>
        <TouchableOpacity
          onPress={() => swiperRef.current.swipeLeft()}
          style={tw`items-center justify-center rounded-full w-16 h-16 bg-red-200`}
        >
          <Entypo name="cross" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swiperRef.current.swipeRight()}
          style={tw`items-center justify-center rounded-full w-16 h-16 bg-green-200`}
        >
          <AntDesign name="heart" size={24} color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
