const GameGateway = require("../gateway/game_gateway");

module.exports = async (game_id) => {
    const games = await GameGateway.all();

    return games.map(game => ({
        id: game.id,
        complete: game.isComplete(),
    }));
};
