import { StyleSheet, Text, View } from "react-native";
import React from "react";

import Tile from "./Tile";
import { Board } from "../objects";

const GameBoard = () => {
  const [board, setBoard] = React.useState(new Board(5));


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
    return <View key={index} style={styles.column}>
      {col.map((tile, index) => {
        return <Tile key={tile.id} tile={tile} size={board.size} onTileClick={onTileClick} />;
      }
      )}
    </View>;
  }
  );

  return (
    <View style={styles.map}>
      {/* {cells} */}
      {/* {tiles} */}
      {cols}
      {/* <Tile tile={board.columns[0]} size={board.size} onTileClick={onTileClick} /> */}
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
