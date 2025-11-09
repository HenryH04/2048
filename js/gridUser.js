function GridUser(userSize, previousState) {
  this.userSize = userSize;
  this.cells = previousState ? this.fromState(previousState) : this.empty();
}

// Build a grid of the specified size
GridUser.prototype.empty = function () {
  var cells = [];

  // Makes both columns and rows
  // First 2 rows are top and bottom
  // Last 2 rows are left and right
  for (var x = 0; x < this.userSize; x++) {
    var row = cells[x] = [];

    for (var y = 0; y < this.userSize; y++) {
      row.push(null);
    }
  }

  return cells;
};

GridUser.prototype.fromState = function (state) {
  var cells = [];

  for (var x = 0; x < this.userSize; x++) {
    var row = cells[x] = [];

    for (var y = 0; y < this.userSize; y++) {
      var tile = state[x][y];
      row.push(tile ? new Tile(tile.position, tile.value) : null);
    }
  }

  return cells;
};

// Find the first available random position
GridUser.prototype.randomAvailableCell = function () {
  var cells = this.availableCells();

  if (cells.length) {
    return cells[Math.floor(Math.random() * cells.length)];
  }
};

GridUser.prototype.availableCells = function () {
  var cells = [];

  this.eachCell(function (x, y, tile) {
    if (!tile) {
      cells.push({ x: x, y: y });
    }
  });

  return cells;
};

// Call callback for every cell
GridUser.prototype.eachCell = function (callback) {
  for (var x = 0; x < this.userSize; x++) {
    for (var y = 0; y < this.userSize; y++) {
      callback(x, y, this.cells[x][y]);
    }
  }
};

// Check if there are any cells available
GridUser.prototype.cellsAvailable = function () {
  return !!this.availableCells().length;
};

// Check if the specified cell is taken
GridUser.prototype.cellAvailable = function (cell) {
  return !this.cellOccupied(cell);
};

GridUser.prototype.cellOccupied = function (cell) {
  return !!this.cellContent(cell);
};

GridUser.prototype.cellContent = function (cell) {
  if (this.withinBounds(cell)) {
    return this.cells[cell.x][cell.y];
  } else {
    return null;
  }
};

// Inserts a tile at its position
GridUser.prototype.insertTile = function (tile) {
  this.cells[tile.x][tile.y] = tile;
};

GridUser.prototype.removeTile = function (tile) {
  this.cells[tile.x][tile.y] = null;
};

GridUser.prototype.withinBounds = function (position) {
  return position.x >= 0 && position.x < this.userSize &&
         position.y >= 0 && position.y < this.userSize;
};

GridUser.prototype.serialize = function () {
  var cellState = [];

  for (var x = 0; x < this.userSize; x++) {
    var row = cellState[x] = [];

    for (var y = 0; y < this.userSize; y++) {
      row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
    }
  }

  return {
    userSize: this.userSize,
    cells: cellState
  };
};
