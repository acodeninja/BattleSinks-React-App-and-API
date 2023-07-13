import React, {Component} from 'react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";

import Games from "./pages/Games";
import Game from "./pages/Game";

const router = createBrowserRouter([
    {path: "/", element: <Games />},
    {path: "/game/:id", element: <Game />},
]);

class App extends Component {
    render() {
        return (
            <React.StrictMode>
                <RouterProvider router={router}/>
            </React.StrictMode>
        );
    }
}

export default App;
