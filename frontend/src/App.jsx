import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";

import Home from "./pages/Home";
import Games from "./pages/Games";
import Game from "./pages/Game";

import './App.scss';

class App extends Component {
    render() {
        return (
            <Router>
                <Route path="/" exact component={Home} />
                <Route path="/games/" component={Games} />
                <Route path="/game/:id" component={Game} />
            </Router>
        );
    }
}

export default App;
