/* eslint-disable no-unused-vars */

class Tile {
  constructor(column, row, color) {
    this.color = color || 0;
    this.column = column || 0;
    this.row = row || 0;
    this.id = row || 0; 
    this.active = true; 
    this.connectedList = []; 
    this.connected = false; 
    this.connectedTo = {x: -1, y: -1};
  }
  isParent() {
    // it is a parent if connectedTo is the same as its position (row and column)
    return (
      this.connectedTo.x === this.column && this.connectedTo?.y === this.row
    );
  }

  hasConnections() {
    return this.connectedTo.x !== -1;
  }
}

class Board {
  constructor(size) {
    this.id = Math.random();
    this.loadGame(size);
    this.winState = false;
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
    
    const parent = tile.isParent
      ? this.getTile(tile.column, tile.row)
      : this.getTile(tile.connectedTo?.x, tile.connectedTo?.y);
    


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
    // check if there are any active tiles
    const check = this.cols.every((column) => column.every((tile) => tile.active === false));
    this.winState = check;
    return this.winState;
  }
  

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
      neighbor.connectedTo = {x:connection.column, y:connection.row};
      connection.connectedList.push([neighbor.column, neighbor.row]);
      neighbor.connected = true;
      this.checkNeighbors(neighbor, connection);
    });

    if (tile.row === 0) {
      tile.connected = true;
    }
    if (tile.connectedTo.x === -1) {
      tile.connectedTo = {x: tile.column, y: tile.row};
    }
    // }
  }

  disconnectAllTiles() {
    // set all tiles to not connected
    this.cols.forEach((column) => {
      column.forEach((tile) => {
        tile.connected = false;
        tile.connectedList = [];
        tile.connectedTo = { x: -1, y: -1 };
      });
    });
  }

  clicked(tile) {
    if (this.checkMoves()) {
      if (tile.connected) {
        this.moves++;
        this.removeTile(tile);
      }
    } 
    // else alert("No moves left!");
    this.boardUpdate();


    return this;
  }

  boardUpdate() {
    this.updateColumns();
    this.disconnectAllTiles();
    this.updateConnections();
  }

  saveGameTiles() {
    // save the state of the game
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
    if (newBoard) this.id = Math.random();
    this.size = boardSize;
    this.moves = 0; // reset the moves
    this.maxMoves = maxMoves;
    this.cols = [];
    this.winState = false;

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
