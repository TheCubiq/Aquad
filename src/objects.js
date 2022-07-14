/* eslint-disable no-unused-vars */
import { colors } from "./constants";

class Tile {
  constructor(color, row, column, size) {
    this.color = color || 0;
    this.active = Math.random() > 0.5;
    this.row = row || -1;
    this.column = column || -1;
    this.oldRow = -1;
    this.oldColumn = -1;
    this.id = this.id++ || 0;
    this.connectedWith = [];
  }
}

class Board {
  constructor(size) {
    this.tiles = [];
    this.cells = [];
    this.size = size || 4;

    for (let i = 0; i < this.size; i++) {
      this.cells[i] = [];
      for (let j = 0; j < this.size; j++) {
        let cellColor = Math.floor(Math.random() * 4) + 1;
        this.cells[i].push(this.addTile(cellColor));
      }
    }
    this.setPositions();
    this.checkConnections();
    // this.checkActive();
    this.won = false;
  }

  addTile(args) {
    let tile = new Tile(args);
    this.tiles.push(tile);
    return tile;
  }

  getUpdatedCells() {
    var hasChanged = false;
    for (var row = 0; row < this.size; ++row) {
      var currentRow = this.cells[row].filter((tile) => tile.value !== 0);
      var resultRow = [];
      for (var target = 0; target < this.size; ++target) {
        var targetTile = currentRow.length
          ? currentRow.shift()
          : this.addTile();
      }
    }
  }

  clicked(tile) {
    // tile.active = !tile.active;
    // tile.markForDeletion = true;
    tile.color = (tile.color === 0)? Math.floor(Math.random() * 4) + 1 : 0;
    // this.updateCells();
    this.clearOldTiles();
    this.setPositions();
    // console.log(
    //   "\ntiles in same column:\n",
    //   this.tilesInSameColumn(tile.column)
    // );
    return this;
  }

  tilesInSameColumn(column) {
    return this.tiles.filter((ctile) => ctile.column === column).length;
  }

  // getActiveNeighbors(tile) {
  //   let neighbors = [];
  //   let row = tile.row;
  //   let column = tile.column;
  //   if (row > 0) {
  //     neighbors.push(this.cells[row - 1][column]);
  //   }
  //   if (row < this.size - 1) {
  //     neighbors.push(this.cells[row + 1][column]);
  //   }
  //   if (column > 0) {
  //     neighbors.push(this.cells[row][column - 1]);
  //   }
  //   if (column < this.size - 1) {
  //     neighbors.push(this.cells[row][column + 1]);
  //   }
  //   // return only neighbors that have the same color
  //   return neighbors.filter(neighbor => {
  //     return neighbor.color === tile.color;
  //   }
  //   );
  // }

  checkConnections() {
    // at the bottom of each column, check if there
    // is a neighbor tile with the same color
    // if there is, move to the next row and check again
    // if there is no neighbor, move to the next column
  }

  clearOldTiles() {
    this.tiles = this.tiles.filter((tile) => tile.markForDeletion === false);
    this.tiles.forEach((tile) => {
      tile.markForDeletion = true;
    });
  }

  setPositions() {
    
    this.cells.forEach((column, columnIndex) => {
      column.forEach((tile, rowIndex) => {
        tile.row = rowIndex;
        tile.column = columnIndex;
        tile.markForDeletion = false;
        // tile.neighbors = this.getActiveNeighbors(tile);
        // tile.checkActive();
        // tile.active = this.checkActive(tile);
      });
    });
  }

  hasWon() {
    return this.won;
  }
}

export { Board };
