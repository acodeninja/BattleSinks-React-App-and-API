import React, {Component} from 'react';

import {bombCell, getGame, getGameCells} from '../api';

import Navigation from "../components/Navigation";

import './Game.css';

import './Games.scss';

class Game extends Component {
    constructor(props) {
        super(props);

        this.state = {
            game: {},
            cells: [],
            loading: true,
        };

        this.getGame = this.getGame.bind(this);
        this.bombCell = this.bombCell.bind(this);
    }

    componentDidMount() {
        clearInterval(this.poller);
        this.poller = setInterval(() => {
            this.getGame();
        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.poller);
    }

    getGame() {
        const {id} = this.props.match.params;

        getGame(id)
            .then(gameResponse => {
                getGameCells(id).then(cellsResponse => {
                    this.setState(prevState => ({
                        ...prevState,
                        game: gameResponse.data,
                        cells: cellsResponse.data,
                        loading: false,
                    }));
                });
            })
    }

    bombCell(cell_id) {
        const {id} = this.state.game;
        return () => {
            bombCell(id, cell_id)
                .then(this.getGame);
        }
    }

    render() {
        const {cells, game} = this.state;
        return (
            <>
                <header>
                    <Navigation/>
                </header>
                <h1>This game is {game.complete ? 'finished' : 'ongoing'}</h1>
                <main>
                    <div>
                        <div className="GameGrid">
                            {cells.map(cell => (
                                <div
                                    key={`cell-${cell.id}`}
                                    style={{
                                        backgroundColor: cell.ship ? 'green' : (cell.bomb ? 'red' : 'blue'),
                                    }}
                                    onClick={this.bombCell(cell.id)}
                                >
                                    {cell.id}
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
                <footer>
                    <h2>Make PATCH requests to {window.location.origin}/api/game/{game.id}/cell/&lt;cell id&gt;</h2>
                    <h3>with body {`{"bomb": true}`}</h3>
                </footer>
            </>
        );
    }
}

export default Game;
