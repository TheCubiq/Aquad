import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import React from "react";
import { colors, tileIcons } from "./../constants";
import Animated, {
  FadeOut,
  FlipInEasyY,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { Ionicons } from "@expo/vector-icons";

const SPRING_CONF = {
  stiffness: 300,
  damping: 20,
};

const Tile = (props) => {
  const { tile, tileS } = props;

  const tileShake = useSharedValue(0);

  const row = useDerivedValue(() => {
    return withSpring(tile.row, SPRING_CONF);
  });

  const connected = useDerivedValue(() => {
    return withTiming(tile.connected ? 1 : 0, { duration: 500 });
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
        {
          rotateZ: `${tileShake.value}deg`,
        },
      ],
    };
  });

  // eslint-disable-next-line no-unused-vars
  const tileInside = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      connected.value,
      [0, 1],
      [colors[`tile_${tile.color}`], colors.bg]
    );

    const width = tileS / 3;
    const height = width;

    return {
      backgroundColor,
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

    const bottom = interpolate(row.value, [0, 1], [0, tileS]);

    return {
      bottom,
      borderWidth,
      backgroundColor,
      shadowColor,
      borderRadius,
    };
  });

  function triggerShake() {
    const speed = {duration:100};
    tileShake.value = withSequence(
      withTiming(-10,speed),
      withRepeat(withTiming(10,speed), 4, true),
      withTiming(0,speed)
    );
  }

  return (
    <Animated.View
      entering={FlipInEasyY.delay(500 + 50 * (tile.row + tile.column)).duration(
        500
      )}
      exiting={FadeOut.delay(1)}
    >
      <TouchableWithoutFeedback
        touchSoundDisabled={true}
        onPress={() => {
          if (!tile.connected) {
            triggerShake();
          }
          props.onTileClick(tile);
        }}
      >
        <Animated.View
          style={[
            styles.tile,
            {
              borderColor: colors[`tile_${tile.color}`],
              width: tileS,
            },
            tileStyle,
          ]}
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
    </Animated.View>
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

    transform: [
      {
        scale: 0.8,
      },
    ],
  },
  tileText: {
    position: "absolute",

    fontSize: 25,
    lineHeight: 20,
    color: "#ffffff",
    textShadowColor: "#000000",
    textShadowRadius: 5,
    textAlign: "center",
    zIndex: 2,
  },
});
