const Sequelize = require('sequelize');
const sequelize = process.env.NODE_ENV !== 'production' ?
    new Sequelize({
        dialect: 'sqlite',
        storage: 'database.sqlite',
        logging: false
    }) : new Sequelize(process.env.DATABASE_URL);

class GameModel extends Sequelize.Model {}

GameModel.init({
    board: Sequelize.JSON,
}, {sequelize, modelName: 'games'});

module.exports.GameModel = GameModel;
module.exports.sequelize = sequelize;
