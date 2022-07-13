/* eslint-disable no-unused-vars */

class Tile {
  constructor(color, row, column) {
    this.color = color || 0;
    this.active = false;
    this.row = row || 0;
    this.column = column || 0;
    this.id = this.id++ || 0;
    this.size = 0;
    this.neighbors = [];
  }

  checkActive() {
    // check if tile is active
    // tile is active if:
    // - it is at the bottom of the board (row === size - 1)
    if (this.row === this.size - 1) {
      this.active = true;
    }
    // - it has a neighbor
    if (this.neighbors.length > 0) {
      this.active = true;
    }    
  }
}

class Board {
  constructor() {
    this.tiles = [];
    this.cells = [];
    this.size = 10;

    for (let i = 0; i < this.size; i++) {
      this.cells[i] = [];
      for (let j = 0; j < this.size; j++) {
        let cellColor = Math.floor(Math.random() * 4) + 1;
        this.cells[i].push(this.addTile(cellColor));
      }
    }
    this.setPositions();
    // this.checkActive();
    this.won = false;
  }

  addTile(args) {
    let tile = new Tile(args);
    this.tiles.push(tile);
    return tile;
  }

  clicked(tile) {
    // tile.active = !tile.active;
    console.log("\ntile clicked\n", tile);
    return this;
  }

  getActiveNeighbors(tile) {
    let neighbors = [];
    let row = tile.row;
    let column = tile.column;
    if (row > 0) {
      neighbors.push(this.cells[row - 1][column]);
    }
    if (row < this.size - 1) {
      neighbors.push(this.cells[row + 1][column]);
    }
    if (column > 0) {
      neighbors.push(this.cells[row][column - 1]);
    }
    if (column < this.size - 1) {
      neighbors.push(this.cells[row][column + 1]);
    }
    // return only neighbors that have the same color
    return neighbors.filter(neighbor => {
      return neighbor.color === tile.color;
    }
    );
  }


  setPositions() {
    this.cells.forEach((row, rowIndex) => {
      row.forEach((tile, columnIndex) => {
        tile.row = rowIndex;
        tile.column = columnIndex;
        tile.size = this.size;
        tile.neighbors = this.getActiveNeighbors(tile);
        tile.checkActive();
        // tile.active = this.checkActive(tile);

      });
    });
  }

  hasWon() {
    return this.won;
  }
}

export { Board };
