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
  useAnimatedStyle,
  useSharedValue,
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
  const { width } = useWindowDimensions();
  const tileSize = width / size;

  const column = useSharedValue(tile.column * tileSize);
  const row = useSharedValue(tile.row * tileSize);
  const color = useSharedValue(colors[`tile_${tile.color}`]);
  const fillColor = useSharedValue(color.value.hexToRgba(0));
  const borderColor = useSharedValue(color.value.hexToRgba(1));
  const active = useSharedValue(0);

  useEffect(() => {
    column.value = tile.column * tileSize;
    row.value = tile.row * tileSize;
    color.value = colors[`tile_${tile.color}`];
    fillColor.value = color.value.hexToRgba(0);
    borderColor.value = colors[`tile_${tile.color}`].hexToRgba(1);
    active.value = tile.active ? 1 : 0;
  });

  const mypos = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(column.value),
        },
        {
          translateY: withSpring(row.value),
        },
        {
          scale: 0.8,
        },
      ],
      opacity: withTiming(active.value),
      backgroundColor: withTiming(fillColor.value, { duration: 250 }),
      borderColor: withTiming(borderColor.value, { duration: 500 }),
    };
  });

  return (
    <Animated.View
      style={[
        styles.cell,
        {
          //   transform x and y
          width: tileSize,
          height: tileSize,
        },
        mypos,
      ]}
    >
      <Pressable
        onPress={() => {
          props.onTileClick(tile);
        }}
        style={{
          width: tileSize,
          height: tileSize,
        }}
      >
        <Text style={styles.tiletext}>{tile.color}</Text>
      </Pressable>
    </Animated.View>
  );
};

export default Tile;

const styles = StyleSheet.create({
  cell: {
    position: "absolute",

    borderWidth: 8,
    borderRadius: 15,

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
    justifyContent: "center",
    alignItems: "center",
  },
  tiletext: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.secondary,
    textAlign: "center",
    textAlignVertical: "center",
  },
});
