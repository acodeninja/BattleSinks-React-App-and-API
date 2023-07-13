import React, {Component} from 'react';
import {Link, redirect} from "react-router-dom";

import {getGames, newGame} from '../api';

import Navigation from "../components/Navigation";

class Games extends Component {
    constructor(props) {
        super(props);

        this.state = {
            games: [],
            loading: true,
        };

        this.getGames = this.getGames.bind(this);
        this.newGame = this.newGame.bind(this);
    }

    componentDidMount() {
        this.getGames();
    }

    getGames() {
        getGames()
            .then(response => {
                this.setState(prevState => ({
                    ...prevState,
                    games: response.data,
                    loading: false,
                }));
            })
    }

    newGame() {
        newGame()
            .then(response => {
                const {id} = response.data;
                window.location.replace(`${window.location.origin}/game/${id}`);
            })
    }

    render() {
        const {games} = this.state;

        return (
            <>
                <header>
                    <Navigation/>
                </header>
                <main>
                    <table>
                        <thead>
                        <tr>
                            <th>Game</th>
                            <th>Link</th>
                            <th>Completed?</th>
                        </tr>
                        </thead>
                        <tbody>
                        {games.map(game => (
                            <tr key={`games-${game.id}`}>
                                <td>
                                    {game.id}
                                </td>
                                <td>
                                    <Link to={`/game/${game.id}`}>
                                        Play
                                    </Link>
                                </td>
                                <td>
                                    {game.complete ? 'Complete' : 'Playable'}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <button type="button" onClick={this.newGame}>
                        New Game
                    </button>
                </main>
            </>
        );
    }
}

export default Games;
