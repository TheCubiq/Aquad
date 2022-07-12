import { StyleSheet, Text, View } from "react-native";
import React from "react";

import Tile from "./Tile";
import Cell from "./Cell";

const Board = () => {
  return (
    <View>
      <Text>Board</Text>
      <Tile />
      <Cell />
    </View>
  );
};

export default Board;

const styles = StyleSheet.create({});
