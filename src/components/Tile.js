import { StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import React, { useEffect } from "react";
import { colors, tileIcons } from "./../constants";
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

import { AntDesign, Octicons, Ionicons } from "@expo/vector-icons";

const SPRING_CONF = {
  stiffness: 300,
  damping: 20,
  // mass: 1,
  // overshootClamping: true,
};

// eslint-disable-next-line no-unused-vars
const TileStatus = ({ tile }) => {
  return (
    <Text style={styles.tileText}>
      {tile.hasConnections()
        ? tile.isParent()
          ? "master\n" + (tile.connectedList.length || "none")
          : "slave"
        : ""}
    </Text>
  );
};

const Tile = (props) => {
  const { tile, tileS } = props;
  // const width = (windowWidth > 600) ? 600 : windowWidth;

  // const row = useSharedValue(-tile.row * tileS);
  const row = useSharedValue(tileS);

  const connected = useDerivedValue(() => {
    return withTiming(tile.connected ? 1 : 0, { duration: 500 });
  });

  const iconColor = useDerivedValue(() => {
    return interpolateColor(
      connected.value,
      [0, 1],
      [colors[`tile_${tile.color}`], colors.bg]
      // ["red", "green"]
    );
  });

  useEffect(() => {
    row.value = -tile.row * tileS;
  });

  const iconConnected = useAnimatedStyle(() => {
    return {
      opacity: connected.value,
    };
  });

  const iconNotConnected = useAnimatedStyle(() => {
    return {
      opacity: 1 - connected.value,
    };
  });

  const relativeIconSize = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: tileS / 100,
        },
      ],
    };
  });

  const tileInside = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      connected.value,
      [0, 1],
      [colors[`tile_${tile.color}`], colors.bg]
    );

    // const width = interpolate(connected.value, [0, 1], [26, 230]);
    const width = tileS / 3;
    const height = width;

    return {
      backgroundColor,

      // borderWidth,
      width,
      height,
    };
  });

  const tileStyle = useAnimatedStyle(() => {
    const borderWidth = interpolate(connected.value, [0, 1], [tileS / 8, 0]);
    const backgroundColor = interpolateColor(
      connected.value,
      [0, 1],
      ["transparent", colors[`tile_${tile.color}`]]
    );
    const shadowColor = backgroundColor;
    const borderRadius = tileS / 2.5;

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
      backgroundColor,
      shadowColor,
      borderRadius,
    };
  });

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        props.onTileClick(tile);
      }}
    >
      <Animated.View
        // entering={FadeIn}
        style={[
          styles.tile,
          {
            borderColor: colors[`tile_${tile.color}`],
            width: tileS,
          },
          tileStyle,
        ]}
        exiting={FadeOut}
      >
        <Animated.View style={relativeIconSize}>
          <Animated.View style={iconConnected}>
            <Ionicons
              name={tileIcons[tile.color]}
              size={40} 
              color={colors.bg} 
            />
          </Animated.View>
          <Animated.View style={[iconNotConnected, { position: "absolute" }]}>
            <Ionicons
              name={tileIcons[tile.color]}
              size={40}
              color={colors[`tile_${tile.color}`]}
            />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default Tile;

const styles = StyleSheet.create({
  tile: {
    aspectRatio: 1,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",

    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,

    overflow: "hidden",
  },
  tileText: {
    position: "absolute",
    // top: 40,
    // left: "48%",
    // flex: 1,

    fontSize: 25,
    // fontSize: 18,
    // fontWeight: "bold",
    lineHeight: 20,
    // color: colors.secondary,
    color: "#ffffff",
    textShadowColor: "#000000",
    textShadowRadius: 5,
    textAlign: "center",
    zIndex: 2,
  },
});
