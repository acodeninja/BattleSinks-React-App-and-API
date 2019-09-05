const GameGateway = require("../gateway/game_gateway");

module.exports = async (game_id, cell) => {
    const game = await GameGateway.find(game_id);

    if (game.isComplete()) {
        return false;
    }

    game.setCell(cell, { bomb: true });

    await GameGateway.store(game);

    return true;
};
