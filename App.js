import { StatusBar } from "expo-status-bar";
import { View, Platform, SafeAreaView, StyleSheet } from "react-native";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import GameBoard from "./src/components/GameBoard";
import { colors } from "./src/constants";

import BG from "./assets/Screen.svg";
import LottieView from "lottie-react-native";
import { useRef, useState } from "react";

export default function App() {
  const lottieRef = useRef(null);

  const [_, setPlayCount] = useState(0);

  const playConfetti = () => {
    replayAnim(true);
  };

  const replayAnim = (reset) => {
    setPlayCount((prevCount) => {
      const nextCount = reset ? 0 : prevCount + 1;
      if (nextCount < 2) {
        lottieRef.current?.play();
      }
      return nextCount;
    });
  };

  return (
    <>
      <BG style={styles.backdrop} />
      <SafeAreaView style={[styles.container, styles.safeArea]}>
        <StatusBar style="auto" />
        <Animated.Text
          entering={FadeInDown.duration(1000).delay(200)}
          style={styles.title}
        >
          AQUAD
        </Animated.Text>
        <View style={styles.grid}>
          <GameBoard size={5} onWin={playConfetti} />
        </View>
        {/* <Text style={styles.title}>omg it works-ish</Text> */}
      </SafeAreaView>

      {Platform.OS !== "web" && (
        <LottieView
          source={require("./assets/confetti.json")}
          // autoPlay
          loop={false}
          style={styles.backdrop}
          ref={lottieRef}
          onAnimationFinish={() => replayAnim()}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    width: "100%",
    pointerEvents: "none",
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center',
  },
  safeArea: {
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
