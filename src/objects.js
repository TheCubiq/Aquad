/* eslint-disable no-unused-vars */

class Tile {
  constructor(color, column, row) {
    this.color = color || 0;
    this.column = column || 0;
    this.row = row || 0;
    this.active = false;
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
        this.cols.push([]);
        this.cols[i].push(this.addTile());
      }
    }
  }

  addTile(args) {
    var tile = new Tile(args);
    // this.tiles.push(tile);
    return tile;
  }

  clicked(tile) {
    tile.row = tile.row + Math.floor(tile.column/4);
    tile.column = (tile.column+1)%5;
    tile.color = (tile.color+1)%4;
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
