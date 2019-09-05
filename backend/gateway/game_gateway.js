const Game = require('../domain/Game');
const {GameModel} = require('./sequlize_storage');

class GameGateway {
    constructor() {
        this.storage = GameModel;
    }

    async new() {
        return new Game();
    }

    async store(game) {
        if (!game.id) {
            const model = await this.storage.create({ board: game.board });
            game.id = model.id;

            return game;
        }

        const model = await this.storage.findOne({ where: { id: game.id } });

        model.board = game.board;

        return model.save();
    }

    async find(game_id) {
        const model = await this.storage.findOne({ where: { id: game_id } });

        if (!model) return null;

        const game = new Game();

        game.id = model.id;
        game.board = model.board;

        return game;
    }

    async all() {
        const games = await GameModel.findAll();

        return games.map(model => {
            const game = new Game();
            game.board = model.board;
            game.id = model.id;

            return game;
        });
    }

    async destroy(game_id) {
        const game = await GameModel.findByPk(game_id);

        await game.destroy();
    }
}

module.exports = new GameGateway();
