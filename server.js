const express = require('express');
const winston = require('winston');
const expressWinston = require('express-winston');

const {sequelize} = require('./backend/gateway/sequlize_storage');

const {
    bomb_game_cell,
    create_game,
    destroy_game,
    view_game,
    view_games,
    view_game_cell,
} = require('./backend/use_case');

const app = express();

app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
    // If debug is enabled, disable CORS
    console.log("Enabling open CORS");
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });
}

app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.json()
    ),
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false,
}));

app.use(express.static('frontend/build'));

const makeCurrentHostUrl = (req) => `${req.protocol}://${req.get('host')}`;

app.get('/api/game', async (req, res) => {
    const games = await view_games();

    res.send(games.map(game => ({
        ...game,
        game_url: `${makeCurrentHostUrl(req)}/api/game/${game.id}`,
    })));
});

app.post('/api/game', async (req, res) => {
    const game = await create_game();

    res.status(201).send({
        id: game.id,
        game_url: `${makeCurrentHostUrl(req)}/api/game/${game.id}`,
    });
});

app.get('/api/game/:id', async (req, res) => {
    const game = await view_game(req.params.id);

    if (!game) {
        return res.status(404)
            .send({error: 'Game Not Found'});
    }

    res.send({
        id: game.id,
        complete: game.isComplete(),
        game_url: `${makeCurrentHostUrl(req)}/api/game/${game.id}`,
        cell_url: `${makeCurrentHostUrl(req)}/api/game/${game.id}/cell`
    });
});

app.delete('/api/game/:id', async (req, res) => {
    await destroy_game(req.params.id);

    res.status(204).send();
});

app.get('/api/game/:game_id/cell', async (req, res) => {
    const {game_id} = req.params;

    const game = await view_game(game_id);

    if (!game) {
        return res.status(404)
            .send({error: 'Game Not Found'});
    }

    res.send(game.board.map((cell, index) => ({
        ...cell,
        ship: cell.bomb && cell.ship,
        id: `${String.fromCharCode(Math.floor(index / 16) + 1 + 64)}${(index % 16) + 1}`,
        cell_url: `${makeCurrentHostUrl(req)}/api/game/${game_id}/cell/${String.fromCharCode(Math.floor(index / 16) + 1 + 64)}${(index % 16) + 1}`
    })));
});

app.get('/api/game/:game_id/cell/:cell_id', async (req, res) => {
    const {game_id, cell_id} = req.params;

    const cell = await view_game_cell(game_id, cell_id);

    if (!cell) {
        return res.status(404)
            .send({error: 'Game or Cell Not Found'});
    }

    res.send({
        game_url: `${makeCurrentHostUrl(req)}/api/game/${game_id}`,
        bomb: cell.bomb,
        ship: cell.bomb && cell.ship,
    });
});

app.patch('/api/game/:game_id/cell/:cell_id', async (req, res) => {
    const {game_id, cell_id} = req.params;

    const game = await view_game(game_id);
    if (!game) {
        return res.status(404)
            .send({error: 'Game Not Found'});
    }

    if (game.isComplete()) {
        return res.status(422)
            .send({error: 'Cannot update a completed Game'});
    }

    let cell = await view_game_cell(game.id, cell_id);

    if (!cell) {
        return res.status(404)
            .send({error: 'Cell Not Found'});
    }

    const {bomb} = req.body;

    if (bomb) {
        await bomb_game_cell(game.id, cell_id);
    }

    cell = await view_game_cell(game.id, cell_id);

    res.send({
        game_url: `${makeCurrentHostUrl(req)}/api/game/${game_id}`,
        bomb: cell.bomb,
        ship: cell.bomb && cell.ship,
    });
});

const port = process.env.PORT || 4000;
sequelize.sync()
    .then(() => {
        app.listen(port, console.log(`Listening on ${port}`));
    });
