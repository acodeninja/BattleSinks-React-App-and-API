const getCellIndex = (cell, board) => {
    let split = /([A-Za-z]+)(\d+)/;
    let [none, x, y] = cell.match(split);

    x = x.toUpperCase().charCodeAt(0) - 64;
    y = parseInt(y, 10);

    return Math.sqrt(board.length) * (x - 1) + (y - 1);
};

module.exports = class Game {
    constructor() {
        this.board = [];
    }

    setCell(cell, setting) {
        const cellIndex = getCellIndex(cell, this.board);

        this.board[cellIndex] = {
            ...this.board[cellIndex],
            ...setting,
        };
    }

    getCell(cell) {
        const cellIndex = getCellIndex(cell, this.board);

        return {
            bomb: false,
            ship: false,
            ...this.board[cellIndex],
        };
    }

    isComplete() {
        return Object.values(this.board)
            .filter(cell => cell.ship && !cell.bomb)
            .length === 0;
    }
};
