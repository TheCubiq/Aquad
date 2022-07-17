/* eslint-disable no-unused-vars */

class Tile {
  constructor(column, row, color) {
    this.color = color || 0;
    this.column = column || 0;
    this.row = row || 0;
    this.id = row || 0; // give each tile in each column a unique id
    this.active = true; // if the tile is visibe on the board
    this.connected = false; // if the tile is connected to another tile
    // this.id = this.id++ || 0;
    // console.log(this)
  }
}

class Board {
  constructor(size) {
    this.cols = [];
    // this.tiles = [];
    this.size = size || 4;

    for (let i = 0; i < this.size; ++i) {
      this.cols[i] = [];
      for (let j = 0; j < this.size; ++j) {
        this.cols.push();
        // console.log(i,j)
        const color = Math.floor(Math.random() * 4);
        this.cols[i].push(this.addTile(i, j,color));
      }
    }
  }

  addTile(column, row, color) {
    let tile = new Tile(column, row, color);
    return tile;
  }

  clicked(tile) {
    console.log(tile);
    // tile.active = false;
    tile.row = tile.row+1;
    // tile.row = tile.row + Math.floor(tile.column/4);
    // tile.column = (tile.column+1)%5;
    // tile.color = (tile.color+1)%4;
    return this;
  }

  setPositions() {
    this.cols.forEach((column) => {
      column.forEach((tile) => {
        tile.row = tile.column;
      });
    });
  }
}

export { Board };
