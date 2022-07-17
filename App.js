import { StatusBar } from "expo-status-bar";
import { View, Platform, SafeAreaView, StyleSheet, Text } from "react-native";
import GameBoard from "./src/components/GameBoard";
import { colors } from "./src/constants";

export default function App() {
  return (
    <SafeAreaView style={[styles.container, styles.safearea]}>
      <StatusBar style="auto" />
      <Text style={styles.title}>AQUAD</Text>
      <View style={styles.grid}>
        <GameBoard />
      </View>
      <Text style={styles.title}>AQUAD</Text>
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
  grid: {
    // backgroundColor: "#f700ff",
    flex: 1,
    alignSelf: "stretch",
    // padding: 10,
    justifyContent: "center",
    // alignItems: "center",
  },
});
