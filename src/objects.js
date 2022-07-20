/* eslint-disable no-unused-vars */

class Tile {
  constructor(column, row, color) {
    this.color = color || 0;
    this.column = column || 0;
    this.row = row || 0;
    this.id = row || 0; // give each tile in each column a unique id
    this.active = true; // if the tile is visibe on the board
    this.connectedList = []; // list of tiles that are connected to this tile
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
    this.moves = 0;

    for (let i = 0; i < this.size; ++i) {
      this.cols[i] = [];
      for (let j = 0; j < this.size; ++j) {
        this.cols.push();
        // console.log(i,j)
        const color = Math.floor(Math.random() * 4);
        this.cols[i].push(this.addTile(i, j,color));
      }
    }
    this.updateConnected();
  }

  addTile(column, row, color) {
    let tile = new Tile(column, row, color);
    return tile;
  }

  getTile(column, row) {
    return this.cols[column][row];
  }

  removeTile(tile) {
    // remove all tiles that are connected to this tile
    tile.active = false;
    // console.log(tile);
    // console.log(tile.connectedList);
    tile.connectedList.forEach((connectedTile) => {
      // console.log(connectedTile);
      this.removeTile(this.getTile(connectedTile[0], connectedTile[1]));
    });
  }

  updateColumns() {
    // update the position of all tiles
    // filter out tiles that are not active
    this.cols.forEach((column, columnIndex) => {
      column = column.filter((tile) => tile.active);
      column.forEach((tile, rowIndex) => {
        tile.column = columnIndex;
        tile.row = rowIndex;
      });
      this.cols[columnIndex] = column; // update the column
    });
  }

  updateConnected() {
    // 1. we check the last tile in each column
    // 2. we set that tile to active and check its neighbors
    // 3. if any of the neighbors have the same color, we add the tile to the connected list
    // 4. we then call that tile and check its neighbors
    // 5. we repeat steps 3 and 4 until they don't have any neighbors with the same color
    // 6. we then check the next column and repeat steps 1-5
    // 7. we repeat steps 1-6 until we check all columns
    // 8. we then check each tile in each connected list and set its connected property to true

    for (let i = 0; i < this.size; ++i) {
      if (this.cols[i].length > 0) {
        // step 1
        let tile = this.getTile(i, 0);
        tile.connected = true;
        // step 2
        this.checkNeighbors(tile);
        // console.log(this.cols[i].length);
      }
    }
  }

  checkNeighbors(tile) {
    let neighbors = [];
    // check the neighbors of the tile 
    if (tile.column > 0) {
      neighbors.push(this.getTile(tile.column - 1, tile.row));
    }
    if (tile.column < this.cols[tile.column].length - 1) {
      neighbors.push(this.getTile(tile.column + 1, tile.row));
    }
    if (tile.row > 0) {
      neighbors.push(this.getTile(tile.column, tile.row - 1));
    }
    if (tile.row < this.cols[tile.column].length) {
      neighbors.push(this.getTile(tile.column, tile.row + 1));
    }
    // filter the neighbors to only include tiles that have the same color
    try {
      neighbors = neighbors.filter(
        (neighbor) => neighbor.color === tile.color && !neighbor.connected
      );
      neighbors.forEach((neighbor) => {
        tile.connectedList.push([neighbor.column, neighbor.row]);
        neighbor.connected = true;
        this.checkNeighbors(neighbor);
      });
    } catch (e) {
      console.log(e);
      return;
    }
    // neighbors = neighbors.filter(neighbor => neighbor.color === tile.color );

    // console.log("tile", tile.column, tile.connectedList);
  }

  disconnectAll() {
    // set all tiles to not connected
    this.cols.forEach((column) => {
      column.forEach((tile) => {
        tile.connected = false;
        tile.connectedList = [];
      });
    });
  }

  clicked(tile) {
    if (tile.connected) {
      this.moves++;
      // console.log(tile);
      // this.removeTile(tile);
      // console.log("\n");
      this.removeTile(tile);
      this.updateColumns();
      this.disconnectAll();
      this.updateConnected();

      // tile.row = tile.row+1;
      // tile.row = tile.row + Math.floor(tile.column/4);
      // tile.column = (tile.column+1)%5;
      // tile.color = (tile.color+1)%4;
    }
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
