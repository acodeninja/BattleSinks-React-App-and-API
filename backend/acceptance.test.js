const Game = require('./domain/Game');
const {GameModel} = require('./gateway/sequlize_storage');

const create_game = require('./use_case/create_game');
const view_game = require('./use_case/view_game');
const bomb_game_cell = require('./use_case/bomb_game_cell');
const view_game_cell = require('./use_case/view_game_cell');
const GameGateway = require("./gateway/game_gateway");

let test_game_id;

describe('Given no game', function () {
    it('I should be able to create a new game', async function () {
        const game = await create_game();

        expect(game).toBeInstanceOf(Game);
    });

    it('should create a game which should not have any bombs', async function () {
        const game = await create_game();

        expect(Object.values(game.board).filter(cell => cell.bomb)).toHaveLength(0);
    });
});

describe('Given a test game', function () {
    beforeAll(async () => {
        await GameModel.sync({force: true});
        const test_game = await create_game();
        test_game_id = test_game.id;
    });

    it('should allow the user to view a game', async function () {
        const game = await view_game(test_game_id);

        expect(game).toBeInstanceOf(Game);
        expect(game.id).toBe(test_game_id);
    });

    it('should allow the user to view a game cell', async function () {
        const game_cell = await view_game_cell(test_game_id, 'a1');

        expect(game_cell)
            .toStrictEqual({
                bomb: false,
                ship: false,
            });
    });

    it('should allow the user to drop a bomb', async function () {
        await bomb_game_cell(test_game_id, 'a1');
        const game_cell = await view_game_cell(test_game_id, 'a1');

        expect(game_cell.bomb).toBe(true);
    });

    it('should have at least one ship on the board', async function () {
        const game = await create_game();

        expect(Object.values(game.board).filter(cell => cell.ship).length).toBeGreaterThan(0);
    });

    it('should have an incomplete game when no bombs have been dropped', async function () {
        let game = await create_game();

        expect(game.isComplete()).toBe(false);
    });

    it('should complete the game when all ships are bombed', async function () {
        let game = await create_game();

        game.board = game.board.map(cell => ({
            ...cell,
            bomb: true,
        }));

        await GameGateway.store(game);

        game = await view_game(game.id);

        expect(game.isComplete()).toBe(true);
    });
});
