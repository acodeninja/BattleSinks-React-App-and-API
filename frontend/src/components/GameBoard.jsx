import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './GameBoard.scss';

const GameBoard = (props) => {
    const {bombCell, cells} = props;

    return (
        <div className="GameBoard">
            <div className="GameGrid">
                {cells.map(cell => {
                    let classes = classNames({
                        cell: true,
                        bombed: cell.bomb,
                        ship: cell.ship,
                    });

                    return (
                        <div
                            key={`cell-${cell.id}`}
                            className={classes}
                            onClick={bombCell(cell.id)}
                        >
                            {cell.id}
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

GameBoard.propTypes = {
    bombCell: PropTypes.func.isRequired,
    cells: PropTypes.arrayOf(PropTypes.shape({
        bomb: PropTypes.bool.isRequired,
        ship: PropTypes.bool.isRequired,
    })).isRequired,
};

export default GameBoard;
