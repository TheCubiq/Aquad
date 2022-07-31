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
    // it is a parent if connectedTo is the same as its position (row and column)
    return (
      this.connectedTo[0] === this.column && this.connectedTo[1] === this.row
    );
  }

  hasConnections() {
    return this.connectedTo.length > 1;
  }
}

class Board {
  constructor(size) {
    // this.tiles = [];
    this.id = Math.random();
    this.loadGame(size);
    // this.updateConnected();
  }

  randomColor() {
    return Math.floor(Math.random() * 4);
  }

  getTile(column, row) {
    // console.log("trying to get:", column, row);
    return this.cols[column][row];
  }

  removeTile(tile) {
    // get the parent tile and remove each tile that is connected to it including the parent tile
    const parent = tile.isParent()
      ? tile
      : this.getTile(tile.connectedTo[0], tile.connectedTo[1]);
    parent.connectedList.forEach((connectedTile) => {
      this.getTile(connectedTile[0], connectedTile[1]).active = false;
    });
    parent.active = false;
  }

  checkMoves() {
    // check if there are any moves left
    return this.moves < this.maxMoves;
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

  updateConnections() {
    // 1. we check the last tile in each column
    // 2. we set that tile to active and check its neighbors
    // 3. if any of the neighbors have the same color, we add the tile to the connected list
    // 4. we then call that tile and check its neighbors
    // 5. we repeat steps 3 and 4 until they don't have any neighbors with the same color
    // 6. we then check the next column and repeat steps 1-5
    // 7. we repeat steps 1-6 until we check all columns
    // 8. we then check each tile in each connected list and set its connected property to true
    if (this.checkMoves()) {
      this.cols.forEach((column) => {
        if (column.length > 0) {
          this.checkNeighbors(column[0]);
        }
      });
    }
  }

  getNeighbors(tile) {
    let neighbors = [];
    // check the neighbors of the tile
    if (tile.column > 0) {
      neighbors.push(this.getTile(tile.column - 1, tile.row));
    }
    if (tile.column < this.size - 1) {
      neighbors.push(this.getTile(tile.column + 1, tile.row));
    }
    if (tile.row > 0) {
      neighbors.push(this.getTile(tile.column, tile.row - 1));
    }
    if (tile.row < this.size - 1) {
      neighbors.push(this.getTile(tile.column, tile.row + 1));
    }
    return neighbors;
  }

  hasWon() {
    // check if the game is won
    // check if there are any active tiles
    // return this.cols.every((column) => column.every((tile) => tile.active));
    return this.cols.every((column) => column.every((tile) => tile.active === false));
  }

  // this function doesn't write each tile to the connectedList
  // it creates connected list for only "parent/master tiles" (tiles in the bottom (row = 0) of the column)
  // function has an additional parameter "parent"
  // neighbors will be always added to the parent tile's connectedList
  // neighbors lead to the parent tile using the "connectedTo" property
  checkNeighbors(tile, parent = null) {
    let neighbors = this.getNeighbors(tile);
    // filter neighbors that are undefined,
    // the neighbors with tiles that have the same color
    // and are not connected
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
      this.checkNeighbors(neighbor, connection);
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

  disconnectAllTiles() {
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
    // console.log(tile.column, tile.row, tile);
    // tile.color = (tile.color + 1) % 4;

    if (this.checkMoves()) {
      if (tile.connected) {
        this.moves++;
        this.removeTile(tile);
      }
    } 
    // else alert("No moves left!");
    this.boardUpdate();

    if (this.hasWon()) {
      alert("You won!");
    }

    return this;
  }

  boardUpdate() {
    this.updateColumns();
    this.disconnectAllTiles();
    this.updateConnections();
  }

  saveGameTiles() {
    // save the state of the game
    // return an array of arrays of tile colors
    let gameTiles = [];
    
    for (let i = 0; i < this.size; ++i) {
      let columnTiles = [];
      for (let j = 0; j < this.size; ++j) {
        // this.cols.push();
        const tile = this.getTile(i, j);
        columnTiles.push(tile ? tile.color : "e");
      }
      gameTiles.push(columnTiles);
    }

    return gameTiles;
  }

  loadGame(boardSize = 5, gameTiles, newBoard = true, maxMoves = 10) {
    // load the state of the game
    // gameTiles is an array of arrays of tile colors
    if (newBoard) this.id = Math.random();
    this.size = boardSize;
    this.moves = 0; // reset the moves
    this.maxMoves = maxMoves;
    this.cols = [];

    this.fillBoard(gameTiles);

    this.boardUpdate();

    this.saveGame = this.saveGameTiles();

    return this;
  }

  fillBoard(gameTiles) {
    for (let i = 0; i < this.size; ++i) {
      this.cols.push([]);
      for (let j = 0; j < this.size; ++j) {
        this.cols[i].push(
          new Tile(i, j, gameTiles?.[i]?.[j] ?? this.randomColor())
        );
      }
    }
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
