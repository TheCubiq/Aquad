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
import { colors, tileEmojis } from "./../constants";

const GameBoard = (props) => {
  const [board, setBoard] = useState(new Board(props.size));

  const [tileWidth, setTileWidth] = useState(84);

  const onLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setTileWidth(width);
  };

  const newGame = () => {
    setBoard(new Board(props.size));
  };

  const loadNewGame = () => {
    // todo : load game as "game,moves"
    //        so as ex: 1010,10
    const game = "1010";
    // const game = "1013023022210010202233131"
    // const game = "101302302221001020223313111111111111";
    loadGame(game, true);
  };

  const resetBoard = () => {
    const saveGame = board.saveGame;
    // console.log(saveGame);
    loadGame(saveGame, false);
  };

  const loadGame = (gameBoard, reload) => {
    // check the type of gameBoard
    // if it is a string, we need to convert it to board
    const brd =
      typeof gameBoard === "string" ? stringToBoard(gameBoard) : gameBoard;
    let newBoard = copyBoard(board).loadGame(
      brd.length,
      brd,
      reload
    );
    setBoard(newBoard);
  };

  const stringToBoard = (string) => {
    // split string into array of strings
    const boardSize = Math.sqrt(string.length);
    let board = [];
    // const boardString = string.split("");
    for (let i = 0; i < boardSize; ++i) {
      let columnTiles = [];
      for (let j = 0; j < boardSize; ++j) {
        columnTiles.push(string[i * boardSize + j]);
      }
      board.push(columnTiles);
    }
    return board;
  };

  const showSave = () => {
    // ToastAndroid.show("Saving game...", ToastAndroid.SHORT);
    console.log("Game save:");
    const saveGame = board.saveGame;
    console.log(toSaveStateString(saveGame));
    shareGame(saveGame);
  };

  const shareGame = (saveGame) => {
    console.log(toEmojis(saveGame));
    alert(toEmojis(saveGame));
  };

  const toSaveStateString = (gameBoard) => {
    let saveState = "";
    for (let i = 0; i < gameBoard.length; ++i) {
      for (let j = 0; j < gameBoard[i].length; ++j) {
        saveState += gameBoard[i][j];
      }
    }
    // const boardSize = Math.sqrt(saveState.length);
    // saveState += `\n${boardSize} x ${boardSize}`;
    return saveState;
  };

  const toEmojis = (gameBoard) => {
    const emojiBoard = gameBoard
      .map((column, i) =>
        column
          .map((tile, j) => tileEmojis[gameBoard[j][column.length - 1 - i]])
          .join("")
      )
      // .filter((column) => column)
      .join("\n");
    return emojiBoard;
  };

  const copyBoard = (board) => {
    return Object.assign(Object.create(Object.getPrototypeOf(board)), board);
  };

  const onTileClick = (tile) => {
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

  const MyCustomBtn = (props) => {
    return (
      <TouchableOpacity
        onPress={() => {
          // setBoard(new Board(props.size));
          props.pressAction();
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
          {props.title}
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
          moves: {board.moves}/{board.maxMoves}
        </Text>
      </View>
    );
  };

  return (
    <>
      <MyCustomBtn title={"New Game"} pressAction={newGame} />
      <View style={styles.map}>{cols}</View>
      <BtnMoves />
      <MyCustomBtn title={"Reset"} pressAction={resetBoard} />
      {/* <MyCustomBtn title={"load game"} pressAction={loadNewGame} /> */}
      <MyCustomBtn title={"showEmoji"} pressAction={showSave} />
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
