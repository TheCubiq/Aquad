import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import React from "react";
import { colors } from "./../constants";

const Tile = (props) => {
  const { tile } = props;
  const { width } = useWindowDimensions();
  const tileSize = width / tile.size;

  return (
    <Pressable
      style={[
        styles.cell,
        {
          backgroundColor: tile.active
            ? colors[`tile_${tile.color}`]
            : "transparent",
          borderColor: colors[`tile_${tile.color}`],
          //   transform x and y
          width: tileSize,
          height: tileSize,
          transform: [
            {
              translateX: tile.column * tileSize,
            },
            {
              translateY: tile.row * tileSize,
            },
            {
              scale: 0.8,
            },
          ],
        },
      ]}
      onPress={() => {
        props.onTileClick(tile);
      }}
    >
      {/* <Text style={styles.tiletext}>{tile.color}</Text> */}
    </Pressable>
  );
};

export default Tile;

const styles = StyleSheet.create({
  cell: {
    position: "absolute",

    borderWidth: 8,
    borderRadius: 10,

    opacity: 0.8,
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
