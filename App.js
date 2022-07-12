import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors } from "./src/constants";

export default function App() {
  const [GRIDSIZE] = useState(5);

  const [grid, setGrid] = useState([]);

  const createBoard = () => {
    // generate grid with random numbers from 0 to 3
    const board = Array(GRIDSIZE)
      .fill(0)
      .map(() =>
        Array(GRIDSIZE)
          .fill(0)
          .map(() => ({
            color: Math.floor(Math.random() * 4),
            active: false,
          }))
      );
      setGrid(board);

    // generate nice rainbow grid
    // Array(GRIDSIZE)
    //   .fill(0)
    //   .map((_, i) =>
    //     Array(GRIDSIZE)
    //       .fill(0)
    //       .map((_, j) => ({
    //         color: (i + j)%4,
    //         active: j === 0,
    //       }))
    //   )
  };

  const [demoText, setDemoText] = useState(0);

  const demoButtonPress = () => {
    console.log("demo button pressed");
    setDemoText((demoText + 1) % 4);
  };

  const copyArray = (arr) => {
    // return arr.map((row) => row.map((col) => col));
    return [...arr.map((rows) => [...rows])];
  };

  const toggleTile = (row, col) => {
    const updatedGrid = copyArray(grid);
    const tile = updatedGrid[row][col];
    tile.active = !tile.active;
    setGrid(updatedGrid);
  };

  const updateGrid = () => {
    const updatedGrid = copyArray(grid);

    // for each active title
    updatedGrid.forEach((row, i) => {
      row.forEach((tile, j) => {
        // check if tile is active
        if (tile.active) {
          // get neighbors of tile
          const neighbors = getNeighbors(i, j);
          // for each neighbor
          // check if neighbor has the same color as the tile
          neighbors.forEach((neighbor) => {
            if (neighbor.color === tile.color)
              // if so, set the neighbor to active
              updatedGrid[neighbor.row][neighbor.col].active = true;
          });
        }
      });
    });

    setGrid(updatedGrid);
  };

  const removeTile = (col, row) => {
    const updatedGrid = copyArray(grid);
    // delete the tile from this array using .filter
    // console.log("\nbefore:", updatedGrid[row]);
    updatedGrid[row] = updatedGrid[row].filter((tile, i) => i !== col);
    // log the updated grid
    console.log("removed!");
    setGrid(updatedGrid);
  };

  const getNeighbors = (x, y) => {
    const neighbors = [];
    if (x > 0) {
      neighbors.push(grid[x - 1][y]);
    }
    if (x < GRIDSIZE - 1) {
      neighbors.push(grid[x + 1][y]);
    }
    if (y > 0) {
      neighbors.push(grid[x][y - 1]);
    }
    if (y < GRIDSIZE - 1) {
      neighbors.push(grid[x][y + 1]);
    }
    // filter out undefined neighbors
    return neighbors.filter((neighbor) => neighbor !== undefined);
  };

  const checkActive = (x, y) => {
    // get the color of the current tile
    const tile = grid[x][y];
    // if cell is at the very bottom of the grid
    if (y === 0) {
      return true;
    }
    // get the neighbors of the current tile
    const neighbors = getNeighbors(x, y);
    // check if there are neighbors that are active and have the same colors
    const activeNeighbors = neighbors.filter(
      (neighbor) => neighbor.active && neighbor.color === tile.color
    );

    // if there are active neighbors with the same color, return true
    if (activeNeighbors.length > 0) {
      return true;
    }

    // if the neighbor of the color is active and has the same title as the current cell

    return false;
  };

  const demoClickSwitch = (x, y) => {
    switch (demoText) {
      case 0:
        toggleTile(x, y);
        break;
      case 1:
        removeTile(y, x);
        break;
      case 2:
        const neighbors = getNeighbors(x, y);
        console.log(neighbors);
        break;
      case 3:
        const isActive = checkActive(x, y);
        console.log(`isActive: ${isActive}`);
        break;
    }
  }	
    }
  };

  const clickAction = (x, y) => {
    // // log the row, column and tile
    // toggleTile(x, y);
    // removeTile(y, x);
    const tile = grid[x][y];
    console.log(
      `column: ${x + 1}, row: ${y + 1}, tile: ${tile.color}, [${
        tile.active ? "active" : "inactive"
      }]`
    );
    demoClickSwitch(x, y);
  };

  useEffect(() => {
    createBoard();
  }, []);
  

  return (
    <SafeAreaView style={[styles.container, styles.safearea]}>
      <StatusBar style="auto" />
      <Text style={styles.title}>AQUAD</Text>

      <View style={styles.grid}>
        {/* <GameGrid/> */}
        <View style={styles.map}>
          {grid.map((column, y) => (
            <View key={`collumn-${y}`} style={styles.column}>
              {column.map((tile, x) => (
                <Pressable
                  key={`tile-${y}-${x}`}
                  style={[
                    styles.tile,
                    {
                      backgroundColor: tile.active
                        ? colors[`tile_${tile.color}`]
                        : "transparent",
                      borderColor: colors[`tile_${tile.color}`],
                    },
                  ]}
                  onPress={() => {
                    clickAction(y, x);
                  }}
                >
                  {/* <Text style={styles.tile_text}>{`${y+1}x${x+1}:${grid[y][x].color}`}</Text> */}
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* simple test button */}
      <Pressable
        style={styles.btn}
        onPress={() => {
          demoButtonPress();
        }}
      >
        <Text style={styles.tile_text}>{demoText}</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    // justifyContent: 'center',
  },
  safearea: {
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  title: {
    fontSize: 32,
    letterSpacing: 7,
    fontWeight: "bold",
    color: colors.primary,
  },
  map: {
    // backgroundColor: "red",
    alignSelf: "stretch",
    // height: 100,
    aspectRatio: 1,
    flexDirection: "row",
    // alignContent: "center",
    // justifyContent: "center",
    // padding: 10,
    // flex:1,
  },
  column: {
    // backgroundColor: "blue",
    flex: 1,
    alignSelf: "stretch",

    // marginHorizontal: 5,
    flexDirection: "column",
    justifyContent: "flex-end",
    // alignItems: "center",
    // alignContent: "center",
  },
  tile: {
    // backgroundColor: "green",
    borderWidth: 4,
    borderColor: colors.primary,
    borderRadius: 10,
    // margin: 5,
    transform: [
      {
        scale: 0.9,
      },
    ],
    // i had to use transform scale instead of margin as the margin was
    // not centering the tile correctly..
    aspectRatio: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
  },
  tile_text: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.secondary,
  },
  grid: {
    // backgroundColor: "#f700ff",
    flex: 1,
    alignSelf: "stretch",
    padding: 10,
    justifyContent: "center",
    // alignItems: "center",
  },
});
