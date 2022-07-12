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

// generate random number between 6 and 17
const generateRandomNumber = () => Math.floor(Math.random() * (17 - 6 + 1)) + 6;

export default function App() {
  const gridsize = 5;
  const [columns, setColumns] = useState(
    // randomly generate 2dimensional array with random numbers from 0 to 4
    Array(gridsize)
      .fill(0)
      .map(() =>
        Array(gridsize)
          .fill(0)
          .map(() => ({
            color:Math.floor(Math.random() * 4), 
            active:"false",
          }
          ))
      )
    // new Array(gridsize).fill(
    //   new Array(gridsize).fill("2") // default content
    //   randomly generate content with numbers from 0 to 4
    //   new Array(gridsize).fill(Math.random(0, 4))

    // )
  );

  const getNeighbors = (col, row) => {
    const neighbors = [];
    if (row > 0) {
      neighbors.push(columns[row - 1][col]);
    }
    if (row < gridsize - 1) {
      neighbors.push(columns[row + 1][col]);
    }
    if (col > 0) {
      neighbors.push(columns[row][col - 1]);
    }
    if (col < gridsize - 1) {
      neighbors.push(columns[row][col + 1]);
    }
    // return neighbors color
    return neighbors.map((neighbor) => neighbor.color);
  };

  const isActive = (tile, j, i) => {
    // if cell is at the very bottom of the grid
    if (tile.active === "true") {
      return true;
    }
    if (j === gridsize - 1) {
      return true;
    }
    // if the neighbor of the color is active and has the same title as the current cell
    
    return false;
  }	

  const clickAction = (column, row,  tile) => {
    // log the row, column and tile
    // console.log(`row: ${row}, column: ${column}, tile: ${tile}`);
    // get the neighbors of the clicked tile
    const neighbors = getNeighbors(column,row);
    // log the neighbors
    console.log("neighbors:",neighbors);
    // log active
    console.log("active:",isActive(column,row));
  };

  return (
    <SafeAreaView style={[styles.container, styles.safearea]}>
      <StatusBar style="auto" />
      <Text style={styles.title}>AQUAD</Text>

      <View style={styles.grid}>
        <View style={styles.map}>
          {columns.map((column, i) => (
            <View key={`collumn-${i}`} style={styles.column}>
              {column.map((tile, j) => (
                <Pressable
                  key={`tile-${j}-${i}`}
                  style={[
                    styles.tile,
                    { 
                      // if the tile is active, set the background color to the primary color
                      backgroundColor: isActive(tile, j, i) ? colors[`tile_${tile.color}`] : "transparent",
                      borderColor: colors[`tile_${tile.color}`],                 
                      },
                  ]}
                  onPress={() => {
                    clickAction(j, i, tile);
                  }}
                >
                  <Text style={styles.tile_text}>{tile.color}</Text>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </View>
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
