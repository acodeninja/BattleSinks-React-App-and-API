const GameGateway = require("../gateway/game_gateway");

module.exports = async (grid_size=16) => {
    const game = await GameGateway.new();
    const grid = Array.apply(null, Array(Math.pow(grid_size, 2)));

    game.board = grid.map(() => ({
        ship: false,
        bomb: false,
    }));

    // create a number of ships
    const shipRules = {
        battleship: { count: 1, size: 6 },
        carrier: { count: 2, size: 4 },
        destroyer: { count: 3, size: 3 },
        supportShip: { count: 4, size: 2 }
    };

    for (let ship in shipRules) {
        ship = shipRules[ship];

        for (let shipCount = 0; shipCount < ship.count; shipCount++) {
            // Choose an initial cell
            let placement = Math.floor(Math.random() * game.board.length);

            // choose a direction
            let direction = Math.floor(Math.random() * 2);

            // Keep going until we can place a ship
            let shipPlaced = false;
            while (shipPlaced === false) {

                // calculate proposed cells
                let proposedCells = [placement];
                for (let i = 1; i < ship.size; i++) {
                    if (direction === 0) {
                        proposedCells.push(placement + i);
                    } else {
                        proposedCells.push(placement + (16 * i));
                    }
                }

                let tryAgain = false;

                let firstProposedCell = proposedCells[0];
                let lastProposedCell = proposedCells[proposedCells.length - 1];

                // check ship will not go off the board
                if (lastProposedCell > 254) {
                    tryAgain = true;
                }

                // check the ship will not straddle rows / columns
                if (direction === 0) {
                    // Going horizontal
                    if (
                        (Math.floor(firstProposedCell / 16) + 1)
                        <
                        (Math.floor(lastProposedCell / 16) + 1)
                    ) {
                        tryAgain = true;
                    }
                } else {
                    // going vertical
                    if (
                        (firstProposedCell % 16) + 1
                        <
                        (lastProposedCell % 16) + 1
                    ) {
                        tryAgain = true;
                    }
                }

                // check the ship will not overrun another ship
                proposedCells.forEach(cell => {
                    if (!tryAgain && game.board[cell].ship) {
                        tryAgain = true;
                    }
                });

                // If we need to try again, do so
                if (tryAgain) {
                    placement = Math.floor(Math.random() * game.board.length);
                    continue;
                }

                // Everything passed, place the ship
                proposedCells.forEach(index => {
                    let cell = game.board[index];
                    game.board[index] = {
                        ...cell,
                        ship: true,
                    };
                });

                shipPlaced = true;
            }
        }
    }

    await GameGateway.store(game);

    return game;
};
