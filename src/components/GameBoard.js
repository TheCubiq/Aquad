import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";

import Animated, {
  useDerivedValue,
  withTiming,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import Tile from "./Tile";
import { Board } from "../objects";
import { colors, tileEmojis } from "./../constants";
import { Audio } from "expo-av";

const GameBoard = (props) => {
  const [board, setBoard] = useState(new Board(props.size));

  const [tileWidth, setTileWidth] = useState(84);

  const winState = useSharedValue(0);

  const stylePath = "../../assets/sounds/style1";

  const soundPaths = {
    A: [
      require(stylePath + "/tileFeedback/0A.mp3"),
      require(stylePath + "/tileFeedback/1A.mp3"),
      require(stylePath + "/tileFeedback/2A.mp3"),
      require(stylePath + "/tileFeedback/3A.mp3"),
    ],
    I: [
      require(stylePath + "/tileFeedback/0I.mp3"),
      require(stylePath + "/tileFeedback/1I.mp3"),
      require(stylePath + "/tileFeedback/2I.mp3"),
      require(stylePath + "/tileFeedback/3I.mp3"),
    ],
    special : {
      win: require(stylePath + "/effects/levelClear.mp3"),
      start: require(stylePath + "/effects/levelStart.mp3"),
      background: require(stylePath + "/soundtracks/soundtrack1.mp3"),
    }
  };

  // useEffect(() => {
  //   return currentTileSound ? () => currentTileSound.unloadAsync() : undefined;
  // }, [currentTileSound]);

  const onLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setTileWidth(width);
  };

  const newGame = () => {
    setBoard(new Board(props.size));
    playSound(soundPaths.special.start);
  };

  // eslint-disable-next-line no-unused-vars
  const loadNewGame = () => {
    // todo : load game as "game,moves"
    //        so as ex: 1010,10
    const game = { gmbd: "1030", moves: 10 };
    // const game = "1013023022210010202233131"
    // const game = "101302302221001020223313111111111111";
    // const game = { gmbd: "1013023022210010202233131", moves: 10 };
    let { gmbd, moves } = game;

    loadGame(gmbd, true);
  };

  const toGameAndMoves = (game, moves = 10) => {
    return { game, moves };
  };

  const resetBoard = () => {
    const saveGame = board.saveGame;
    // console.log(saveGame);
    loadGame(saveGame, false);
  };

  const loadGame = (gameBoard, reload, maxMoves = 10) => {
    // check the type of gameBoard
    // if it is a string, we need to convert it to board
    const brd =
      typeof gameBoard === "string" ? stringToBoard(gameBoard) : gameBoard;
    let newBoard = copyBoard(board).loadGame(brd.length, brd, reload);
    newBoard.maxMoves = maxMoves;
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
    if (newBoard.hasWon()) {
      levelClear();
    } else {
      playTile(tile);
    }
  };

  const playSound = useCallback(async (path) => {
    const { sound } = await Audio.Sound.createAsync(path);
    await sound.playAsync();
  }, []);

  const playTile = (tile) => {
    playSound(soundPaths[tile.connected ? "A" : "I"][tile.color]);
  }

  const winOpacity = useSharedValue(0);

  useEffect(() => {
    winOpacity.value = board.winState ? 1 : 0;
  }, [board.winState]);
  
  const levelClear = () => {
    playSound(soundPaths.special.win);
    props.onWin();
  }

  // const winOpacity = useDerivedValue(() => {
  //   return withTiming(board.winState ? 1 : 0, { duration: 500 });
  // });

  const winningShow = useAnimatedStyle(() => {
    return {
      opacity: withTiming(winOpacity.value, { duration: 500 })
    };
  });

  const cols = board.cols.map((col, index) => {
    return (
      <View
        key={(index + 1) * board.id}
        style={styles.column}
        onLayout={onLayout}
      >
        {col.map((tile) => {
          // converting to
          const data = {
            color: tile.color,
            column: tile.column,
            row: tile.row,
            connected: tile.connected,
            isParent: tile.isParent(),
            connectedList: tile.connectedList,
            connectedTo: tile.connectedTo,
            active: tile.active,
          };
          return (
            <Tile
              key={(tile.id + 1) * board.id}
              tile={data}
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

  const BtnWrapper = (props) => {
    const iconVisibility = useDerivedValue(() => {
      return withTiming(props.visible ? 1 : 0, { duration: 500 });
    });
    const iconVisible = useAnimatedStyle(() => {
      return {
        opacity: iconVisibility.value,
      };
    });

    return (
      <Animated.View style={iconVisible}>
        <TouchableOpacity
          disabled={!props.visible}
          onPress={() => {
            // setBoard(new Board(props.size));
            props.pressAction();
            // ToastAndroid.show("new game started", ToastAndroid.SHORT);
            // show simple toast that game is reset
            // ("New game started!");
          }}
        >
          {props.children}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const BtnMoves = () => {
    return (
      <View>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            color: colors.primary,
          }}
        >
          {board.moves}/{board.maxMoves}
        </Text>
      </View>
    );
  };

  return (
    <>
      <MyCustomBtn title={"New Game"} pressAction={newGame} />
      <View style={styles.map}>
        <Animated.Text style={[styles.wonTitle, winningShow]}>You Won!</Animated.Text>
        {cols}
      </View>


      <BtnMoves />
      <BtnWrapper pressAction={resetBoard} visible={board.moves > 0}>
        <Ionicons name="arrow-undo" size={45} color="white" />
      </BtnWrapper>
    </>
  );
  // <MyCustomBtn title={"load game"} pressAction={loadNewGame} />
  // <FontAwesome6 name="circle-notch" size={24} color="black" />
  // <MyCustomBtn title={"Reset"} pressAction={resetBoard} />
  // <MyCustomBtn title={"showEmoji"} pressAction={showSave} />
};

export default GameBoard;

const styles = StyleSheet.create({

  wonTitle: {
    fontSize: 50,
    color: colors.primary,
    position: "absolute",
    pointerEvents: "none",
    flex: 1,
    alignSelf: "center",
    textAlign: "center",
    left: 0,
    right: 0,
    textTransform: "uppercase",
    letterSpacing: 5,
    fontWeight: 200,
  },

  map: {
    width: "100%",
    aspectRatio: 1,
    flexDirection: "row",
    maxWidth: 420,
    borderRadius: 30,
    backgroundColor: colors.board_bg,
    padding: 5,
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
