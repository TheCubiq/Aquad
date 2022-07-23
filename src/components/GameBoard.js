import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";

import Tile from "./Tile";
import { Board } from "../objects";
import { colors } from "./../constants";

const GameBoard = () => {
  const [board, setBoard] = useState(new Board(7));
  const onLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setTileWidth(width);
  };
  const [tileWidth, setTileWidth] = useState(0);

  const copyBoard = (board) => {
    return Object.assign(Object.create(Object.getPrototypeOf(board)), board);
  };

  const onTileClick = (tile) => {
    // if (board.hasWon()) {
    //   return;
    // }
    let newBoard = copyBoard(board).clicked(tile);
    setBoard(newBoard); // update the board
  };

  const cols = board.cols.map((col, index) => {
    return (
      <View
        key={(index + 1) * board.id}
        style={styles.column}
        onLayout={onLayout}
      >
        {col.map((tile) => {
          return (
            <Tile
              key={(tile.id + 1) * board.id}
              tile={tile}
              size={board.size}
              tileS={tileWidth}
              onTileClick={onTileClick}
            />
          );
        })}
      </View>
    );
  });

  return (
    <>
      <View style={styles.map}>{cols}</View>
    </>
  );
};

export default GameBoard;

const styles = StyleSheet.create({
  map: {
    alignSelf: "stretch",
    // flex:1,
    aspectRatio: 1,
    flexDirection: "row",
    padding: 30,
    maxWidth: 750,

    // backgroundColor: "#000dff5e",
  },
  column: {
    // backgroundColor: "#f700ff5e",
    // borderColor: "#ffffff",
    // borderWidth: 10,
    flex: 1,
    alignSelf: "stretch",
    flexDirection: "column-reverse",
  },
});
