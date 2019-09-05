const GameGateway = require('../gateway/game_gateway');

module.exports = async (game_id, cell) => {
    const game = await GameGateway.find(game_id);

    if (!game) return null;

    return game.getCell(cell);
};
