import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { colors } from "./../constants";
import Animated, {
  FadeIn,
  FadeInDown,
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
  const { tile, size, tileS } = props;
  const { width, height } = useWindowDimensions();
  // const width = (windowWidth > 600) ? 600 : windowWidth;


  const row = useSharedValue(0);
  const color = useSharedValue(colors[`tile_${tile.color}`]);
  const fillColor = useSharedValue(color.value.hexToRgba(0));
  // const borderColor = useSharedValue(color.value.hexToRgba(1));
  const isFilled = useSharedValue(0);
  const isActive = useSharedValue(1);
  const borderWidth = useSharedValue(10);



  useEffect(() => {
    row.value = (-tile.row) * tileS;
    color.value = colors[`tile_${tile.color}`];
    fillColor.value = color.value.hexToRgba(tile.connected ? 1 : 0);
    isFilled.value = tile.connected ? 1 : 0;
    borderWidth.value = tile.connected ? 0 : 10;
  });

  // const filled = useAnimatedStyle(() => {
  //   return {
  //     opacity: withTiming(isFilled.value, { duration: 1000 }),
  //   };
  // });

  const mypos = useAnimatedStyle(() => {
    return {
      transform: [
        // {
        //   translateX: withTiming(column.value),
        // },
        {
          translateY: withDelay(100, withSpring(row.value, { duration: 2000 })),
        },
        {
          scale: 0.8,
        },
      ],
      // opacity: withTiming(isActive.value),
      backgroundColor: withTiming(fillColor.value, { duration: 1000 }),
      borderWidth: withTiming(borderWidth.value, { duration: 1000 }),
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
        entering = {FadeIn}
        style={[
          styles.cell,
          {
            // width: width,
            borderColor: colors[`tile_${tile.color}`],
            width: tileS,
          },
          mypos,
        ]}
        exiting={FadeOut}
      >
        <Text style={styles.tiletext}>
          {tile.color}
        </Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default Tile;

const styles = StyleSheet.create({
  cell: {
    borderRadius: 30,
    aspectRatio: 1,
    elevation:0,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
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
