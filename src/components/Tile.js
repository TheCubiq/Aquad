import { StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import React, { useEffect } from "react";
import { colors } from "./../constants";
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// import { AntDesign } from "@expo/vector-icons";


const SPRING_CONF = {
  stiffness: 300,
  damping: 20,
};

const Tile = (props) => {
  const { tile, tileS } = props;
  // const width = (windowWidth > 600) ? 600 : windowWidth;

  const row = useSharedValue(-tile.row * tileS);

  const connected = useDerivedValue(() => {
    return withSpring(tile.connected ? 1 : 0, { duration: 10000 });
  });

  useEffect(() => {
    row.value = -tile.row * tileS;
  });

  const iconFillColor = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      connected.value,
      [0, 1],
      [colors[`tile_${tile.color}`], "transparent"]
    );

    const borderWidth = interpolate(connected.value, [0, 1], [0, 100]);

    const width = interpolate(connected.value, [0, 1], [26, 230]);
    const height = width;

    return {
      backgroundColor,
      borderWidth,
      width,
      height,
    };
  });

  const myPos = useAnimatedStyle(() => {
    const borderWidth = interpolate(connected.value, [0, 1], [10, 0]);
    return {
      transform: [
        {
          translateY: withSpring(row.value, SPRING_CONF),
        },
        {
          scale: 0.8,
        },
      ],
      borderWidth,
    };
  });

  return (
    <TouchableWithoutFeedback
      style={{ backgroundColor: "#ff636392" }}
      onPress={() => {
        props.onTileClick(tile);
      }}
    >
      <Animated.View
        entering={FadeIn}
        style={[
          styles.tile,
          {
            // width: width,
            borderColor: colors[`tile_${tile.color}`],
            width: tileS,
          },
          myPos,
        ]}
        exiting={FadeOut}
      >
        <Animated.View
          style={[
            {
              width: 26,
              height: 26,
              borderRadius: 1000,
              borderColor: colors[`tile_${tile.color}`],
              backgroundColor: "white",
            },
            iconFillColor,
          ]}
        ></Animated.View>
        {/* <AntDesign name="heart" size={30} color={iconColor.value} /> */}
        {/* <Text style={styles.tiletext}>
          {tile.color}
        </Text> */}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default Tile;

const styles = StyleSheet.create({
  tile: {
    borderRadius: 30,
    aspectRatio: 1,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",

    // shadowOffset: {
    //   width: 0,
    //   height: 5,
    // },
    // shadowOpacity: 0.34,
    // shadowRadius: 6.27,
    // elevation: 10,

    overflow: "hidden",
  },
  tiletext: {
    // position: "absolute",
    // top: "45%",
    // left: "48%",
    // flex: 1,
    fontSize: 30,
    fontWeight: "bold",
    color: colors.secondary,
    // textAlign: "center",
  },
  textView: {
    // backgroundColor: "red",
    // display: "flex",
    // alignSelf: "center",

    justifyContent: "center",
    alignItems: "center",
  },
});
