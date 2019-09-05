const GameGateway = require("../gateway/game_gateway");

module.exports = async (game_id) => {
    return await GameGateway.find(game_id);
};
