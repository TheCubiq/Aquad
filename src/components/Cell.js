import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "./../constants";

const Cell = () => {
  return <View style={styles.cell} />;
};

export default Cell;

const styles = StyleSheet.create({
  cell: {
    backgroundColor: colors.empty,
    
    // borderWidth: 8,
    borderRadius: 10,

    // margin: 5,

    // i had to use transform scale instead of margin as the margin was
    // not centering the tile correctly..
    transform: [
      {
        scale: 0.9,
      },
    ],
    aspectRatio: 1,

    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
