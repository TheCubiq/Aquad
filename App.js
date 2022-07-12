import { StatusBar } from "expo-status-bar";
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
} from "react-native";
import GameBoard from "./src/components/GameBoard";
import { colors } from "./src/constants";

export default function App() {
  return (
    <SafeAreaView style={[styles.container, styles.safearea]}>
      <StatusBar style="auto" />
      <Text style={styles.title}>AQUAD</Text>
      <GameBoard />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    // justifyContent: 'center',
  },
  safearea: {
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  title: {
    fontSize: 32,
    letterSpacing: 7,
    fontWeight: "bold",
    color: colors.primary,
  },
  map: {
    // backgroundColor: "red",
    alignSelf: "stretch",
    // height: 100,
    aspectRatio: 1,
    flexDirection: "row",
    // alignContent: "center",
    // justifyContent: "center",
    // padding: 10,
    // flex:1,
  },
  column: {
    // backgroundColor: "blue",
    flex: 1,
    alignSelf: "stretch",

    // marginHorizontal: 5,
    // flexDirection: "column",
    flexDirection: "column-reverse",
    // justifyContent: "flex-end",
    // show items in reverse order
    // alignItems: "center",
    // alignContent: "center",
  },
  tile: {
    // backgroundColor: "green",
    transform: [
      {
        scale: 0.9,
      },
    ],
    borderWidth: 8,
    borderRadius: 10,

    // margin: 5,

    // i had to use transform scale instead of margin as the margin was
    // not centering the tile correctly..
    aspectRatio: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
  },
  tile_text: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.secondary,
  },
  grid: {
    // backgroundColor: "#f700ff",
    flex: 1,
    alignSelf: "stretch",
    padding: 10,
    justifyContent: "center",
    // alignItems: "center",
  },
  btn: {
    backgroundColor: "#5a0059",
    padding: 10,
    borderRadius: 10,
    margin: 10,
  },
});
