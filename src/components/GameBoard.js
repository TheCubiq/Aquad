import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";

import Tile from "./Tile";
import { Board } from "../objects";
import { colors } from './../constants';

const GameBoard = () => {
  const [board, setBoard] = useState(new Board(5));

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
      <View key={index*board.id} style={styles.column}>
        {col.map((tile) => {
          return (
            <Tile
              key={tile.id*board.id}
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
    <>
      <TouchableOpacity 
      onPress={() => {
        setBoard(new Board(5));
      }}
      style={styles.moves}>
        <Text style={{
          fontSize: 40,
          fontWeight: "bold",
          color: colors.primary,
        }}>start again</Text>
      </TouchableOpacity>
      <View style={styles.map}>{cols}</View>
      <View style={styles.moves}>
        <Text style={{
          fontSize: 40,
          fontWeight: "bold",
          color: colors.primary,
        }}>moves: {board.moves}</Text>
      </View>
    </>
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
  moves:{
    // backgroundColor: "#f700ff",
    alignItems: "center",
    
  }

});
