/* eslint-disable no-unused-vars */

class Tile {
  constructor(column, row, color) {
    this.color = color || 0;
    this.column = column || 0;
    this.row = row || 0;
    this.id = row || 0; // give each tile in each column a unique id
    this.active = true; // if the tile is visible on the board
    this.connectedList = []; // list of tiles that are connected to this tile
    this.connected = false; // if the tile is connected to another tile
    this.connectedTo = []; // the tile that this tile is connected to
    // this.id = this.id++ || 0;
    // console.log(this)
  }
  isParent() {
    // return this.row === 0;
    // return this.connectedTo === null;
    return (
      this.connectedTo[0] === this.column && this.connectedTo[1] === this.row
    );
  }
}

class Board {
  constructor(size) {
    this.id = Math.random();
    this.cols = [];
    // this.tiles = [];
    this.size = size || 4;
    this.moves = 0;

    for (let i = 0; i < this.size; ++i) {
      this.cols[i] = [];
      for (let j = 0; j < this.size; ++j) {
        // this.cols.push();
        const color = Math.floor(Math.random() * 4);
        this.cols[i].push(this.addTile(i, j, color));
      }
    }
    this.updateConnected();
  }

  addTile(column, row, color) {
    let tile = new Tile(column, row, color);
    return tile;
  }

  getTile(column, row) {
    // console.log("trying to get:", column, row);
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

  removeTile2(tile) {
    // get the parent tile and remove each tile that is connected to it including the parent tile
    const parent = tile.isParent()
      ? tile
      : this.getTile(tile.connectedTo[0], tile.connectedTo[1]);
    parent.connectedList.forEach((connectedTile) => {
      this.getTile(connectedTile[0], connectedTile[1]).active = false;
    });
    parent.active = false;
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

    // for (let i = 0; i < this.size; ++i) {
    //   if (this.cols[i].length > 0) {
    //     this.checkNeighbors2(this.getTile(i, 0));
    //     // console.log(this.cols[i].length);
    //   }
    // }

    this.cols.forEach((column) => {
      if (column.length > 0) {
        this.checkNeighbors2(column[0]);
      }
    });
  }

  getNeighbors(tile) {
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
    return neighbors;
  }

  // alternative function to "checkNeighbors"
  // the difference is that this function doesn't write each tile to the connectedList
  // it does connected list for only "parent tiles" (tiles in the bottom (row = 0) of the column)
  // function has an additional parameter "parent"
  // neighbors will be always added to the parent tile's connectedList
  // neighbors lead to the parent tile using the "connectedTo" property
  checkNeighbors2(tile, parent = null) {
    // check if the tile is not connected
    // if (!tile.connected) {
    let neighbors = this.getNeighbors(tile);
    // filter neighbors that are undefined and
    // the neighbors with tiles that have the same color and are not connected
    neighbors = neighbors.filter(
      (neighbor) =>
        neighbor !== undefined &&
        neighbor.color === tile.color &&
        !neighbor.connected
    );
    neighbors.forEach((neighbor) => {
      const connection = parent || tile;
      neighbor.connectedTo = [connection.column, connection.row];
      connection.connectedList.push([neighbor.column, neighbor.row]);
      neighbor.connected = true;
      this.checkNeighbors2(neighbor, connection);
    });

    if (tile.row === 0) {
      tile.connected = true;
      // tile.connectedTo = [tile.column, tile.row];
    }
    if (tile.connectedTo.length < 1) {
      tile.connectedTo = [tile.column, tile.row];
    }
    // }
  }
  disconnectAll() {
    // set all tiles to not connected
    this.cols.forEach((column) => {
      column.forEach((tile) => {
        tile.connected = false;
        tile.connectedList = [];
        tile.connectedTo = [];
      });
    });
  }

  clicked(tile) {
    // console.log("\n\n\n\n AHOJ");
    // console.log(tile.column, tile.row, tile);
    // console.log(tile.isParent());
    if (tile.connected) {
      this.moves++;
      this.removeTile2(tile);
      this.updateColumns();
      this.disconnectAll();
      this.updateConnected();
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
