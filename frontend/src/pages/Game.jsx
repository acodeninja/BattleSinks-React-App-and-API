import React, {Component} from 'react';

import GameBoard from "../components/GameBoard";
import Navigation from "../components/Navigation";

import {bombCell, getGame, getGameCells} from '../api';

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
        const [id] = window.location.pathname.split('/').slice(2);

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
                <main>
                    <h1>This game is {game.complete ? 'finished' : 'ongoing'}</h1>
                    <GameBoard bombCell={this.bombCell} cells={cells}/>
                </main>
                <footer>
                    <h2>PATCH {window.location.origin}/api/game/{game.id}/cell/&lt;cell id&gt;</h2>
                    <h3>{`{"bomb": true}`}</h3>
                </footer>
            </>
        );
    }
}

export default Game;
