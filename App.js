import { StatusBar } from "expo-status-bar";
import { View, Platform, SafeAreaView, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import GameBoard from "./src/components/GameBoard";
import { colors } from "./src/constants";

export default function App() {
  return (
    <SafeAreaView style={[styles.container, styles.safearea]}>
      <StatusBar style="auto" />
      <Animated.Text entering={FadeInDown.duration(1000).delay(200)} style={styles.title}>AQUAD</Animated.Text>
      <View style={styles.grid}>
        <GameBoard size={5}/>
      </View>
      {/* <Text style={styles.title}>omg it works-ish</Text> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: 'center',
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
  grid: {
    // backgroundColor: "#f700ff",
    flex: 1,
    alignSelf: "stretch",
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
