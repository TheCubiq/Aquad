import { StyleSheet, Text, View } from "react-native";
import React from "react";

import Tile from "./Tile";
import Cell from "./Cell";
import { Board } from "../objects";

const GameBoard = () => {
  const [board, setBoard] = React.useState(new Board());

  const cells = board.cells.map((row, rowIndex) => {
    return (
      <View key={rowIndex} style={styles.row}>
        {row.map((col, colIndex) => {
          return <Cell key={colIndex} cell={col} />;
        })}
      </View>
    );
  });

  const copyBoard = (board) => {
    return Object.assign(Object.create(Object.getPrototypeOf(board)), board);
  };

  const onTileClick = (tile) => {
    if (board.hasWon()) {
      return;
    }
    let newBoard = copyBoard(board).clicked(tile);
    setBoard(newBoard); // update the board
  };

  const tiles = board.tiles
    // .filter((tile) => tile.color !== 0)
    .map((tile, index) => {
      return <Tile key={index} tile={tile} onTileClick={onTileClick} />;
    });

  return (
    <View style={styles.map}>
      {/* {cells} */}
      {tiles}
    </View>
  );
};

export default GameBoard;

const styles = StyleSheet.create({
  map: {
    alignSelf: "stretch",
    aspectRatio: 1,
  },
  row: {
    flexDirection: "row",
  },
});
