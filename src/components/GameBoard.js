import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";

import Tile from "./Tile";
import { Board } from "../objects";
import { colors } from "./../constants";

const GameBoard = (props) => {
  const [board, setBoard] = useState(new Board(props.size));

  const [tileWidth, setTileWidth] = useState(84);

  const onLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setTileWidth(width);
  };

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

  const BtnStartAgain = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          setBoard(new Board(props.size));
          // ToastAndroid.show("new game started", ToastAndroid.SHORT);
          // show simple toast that game is reset
          // ("New game started!");
        }}
      >
        <Text
          style={{
            fontSize: 40,
            fontWeight: "bold",
            color: colors.primary,
          }}
        >
          start again
        </Text>
      </TouchableOpacity>
    );
  };

  const BtnMoves = () => {
    return (
      <View>
        <Text
          style={{
            fontSize: 40,
            fontWeight: "bold",
            color: colors.primary,
          }}
        >
          moves: {board.moves}
        </Text>
      </View>
    );
  };

  return (
    <>
      <BtnStartAgain />
      <View style={styles.map}>{cols}</View>
      <BtnMoves />
    </>
  );
};

export default GameBoard;

const styles = StyleSheet.create({
  map: {
    width: "100%",
    aspectRatio: 1,
    flexDirection: "row",
    maxWidth: 420,
    borderRadius: 30,
    backgroundColor: colors.bg,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,

    elevation: 15,
    // padding: 30,
  },
  column: {
    // backgroundColor: "#f700ff5e",
    // borderColor: "#ffffff41",
    // borderWidth: 1,
    flex: 1,
    // alignSelf: "stretch",
    flexDirection: "column-reverse",
  },
});
