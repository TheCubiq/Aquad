import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { colors } from "./../constants";
import Animated, {
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

String.prototype.hexToRgba = function (alpha = 1) {
  let c;
  // if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(this)){
  c = this.substring(1).split("");
  if (c.length == 3) {
    c = [c[0], c[0], c[1], c[1], c[2], c[2]];
  }
  c = "0x" + c.join("");
  return (
    "rgba(" + [(c >> 16) & 255, (c >> 8) & 255, c & 255, alpha].join(",") + ")"
  );
  // }
};

String.prototype.rgbaChange = function (alpha) {
  let c;
  c = this.replace(/[\d.]+\)$/g, alpha + ")");
  return c;
};

const Tile = (props) => {
  const { tile, size } = props;
  const { width, height } = useWindowDimensions();
  // const width = (windowWidth > 600) ? 600 : windowWidth;
  const tileSize = (width > height ? height : width) / size;

  const column = useSharedValue(tile.column * tileSize);
  const row = useSharedValue((size - 1 - tile.row) * tileSize);
  const color = useSharedValue(colors[`tile_${tile.color}`]);
  // const fillColor = useSharedValue(color.value.hexToRgba(0));
  // const borderColor = useSharedValue(color.value.hexToRgba(1));
  const isFilled = useSharedValue(0);
  const isActive = useSharedValue(0);

  useEffect(() => {
    column.value = tile.column * tileSize;
    row.value = (size - 1 - tile.row) * tileSize;
    color.value = colors[`tile_${tile.color}`];
    isActive.value = tile.active ? 1 : 1;
    // fillColor.value = color.value.hexToRgba(0);
    // borderColor.value = colors[`tile_${tile.color}`].hexToRgba(1);
    isFilled.value = tile.connected ? 1 : 0;
  });

  const filled = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isFilled.value, { duration: 1000 }),
    };
  });

  const mypos = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(column.value),
        },
        {
          translateY: withDelay(
            100,
            withSpring(row.value, { duration: 2000 }),
          ),
        },
        {
          scale: 0.8,
        },
      ],
      opacity: withTiming(isActive.value),
    };
  });

  return (
    <Pressable
      onPress={() => {
        props.onTileClick(tile);
      }}
    >
      <Animated.View
        style={[
          styles.cell,
          {
            borderColor: colors[`tile_${tile.color}`],
            width: tileSize,
            height: tileSize,
          },
          mypos,
        ]}
        exiting={FadeOut}
      >
        <Animated.View
          style={[
            {
              position: "absolute",
              // alignSelf: "center",
              width: tileSize,
              height: tileSize,
              backgroundColor: colors[`tile_${tile.color}`],
            },
            filled,
          ]}
        />
        <View
          style={[
            styles.textView,
            {
              position: "absolute",
              height: tileSize,
              width: tileSize,
            },
          ]}
        >
          <Text style={[styles.tiletext]}>
            {tile.column},{tile.row}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default Tile;

const styles = StyleSheet.create({
  cell: {
    position: "absolute",

    // borderWidth: 1,
    // borderBottomWidth: 8,

    borderWidth: 10,
    borderRadius: 30,

    opacity: 1,
    // margin: 5,
    // i had to use transform scale instead of margin as the margin was
    // not centering the tile correctly..
    // transform: [
    //   {
    //     scale: 0.9,
    //   },
    // ],

    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
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
