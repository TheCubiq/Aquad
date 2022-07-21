import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";

import Tile from "./Tile";
import { Board } from "../objects";

const GameBoard = () => {
  const [board, setBoard] = useState(new Board(7));

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

  // const tiles = board.columns
  //   // .filter((tile) => tile.color !== 0)
  //   .map((tile, index) => {
  //     return <Tile key={index * board.size + tile.column} tile={tile} size={board.size} onTileClick={onTileClick} />;
  //   });

  const cols = board.cols.map((col, index) => {
    return (
      <View key={index} style={styles.column}>
        {col.map((tile, index) => {
          return (
            <Tile
              key={tile.id}
              tile={tile}
              size={board.size}
              onTileClick={onTileClick}
            />
          );
        })}
      </View>
    );
  });

  return (
    <View style={styles.map}>
      {cols}
    </View>
  );
};

export default GameBoard;

const styles = StyleSheet.create({
  map: {
    alignSelf: "stretch",
    aspectRatio: 1,
    // backgroundColor: "#f700ff",
  },
  row: {
    flexDirection: "row",
  },
});
