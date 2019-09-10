import React from 'react';
import enzyme, {mount, shallow} from 'enzyme';
import GameBoard from './GameBoard';
import Adapter from 'enzyme-adapter-react-16';

enzyme.configure({adapter: new Adapter()});

let bombCell, bombCellMock, cellsThreeByThreeNoBombs;

beforeAll(() => {
    bombCellMock = jest.fn(i => {
        let cell = cellsThreeByThreeNoBombs[i];
        cellsThreeByThreeNoBombs[i] = {
            ...cell,
            bomb: true,
        };
        cellsThreeByThreeNoBombs = [...cellsThreeByThreeNoBombs];
    });

    bombCell = (i) => () => bombCellMock(i);
});

beforeEach(() => {
    cellsThreeByThreeNoBombs = Array(9)
        .fill({ship: false, bomb: false})
        .map((cell, i) => ({
            ...cell,
            id: i,
            ship: (i + 1) % 3 === 0
        }));
});

describe('Displaying the current status of a game', function () {
    it('should render when given correct prop types', function () {
        shallow(<GameBoard bombCell={bombCell} cells={cellsThreeByThreeNoBombs} />);
    });

    it('should not render any cells when given an empty game grid', function () {
        let wrapper = shallow(<GameBoard bombCell={bombCell} cells={[]}/>);
        let cells = wrapper.find('.cell');
        expect(cells.length).toBe(0);
    });
});

describe('Interacting with a game board', function () {
    it('should allow the user to click on a cell to bomb it', function () {
        let wrapper = shallow(<GameBoard bombCell={bombCell} cells={cellsThreeByThreeNoBombs} />);
        let cellButton = wrapper.find('.cell').at(0);

        cellButton.simulate('click');

        expect(bombCellMock).toHaveBeenCalled();
    });

    it('should give the user visual feedback that a cell has been bombed', function () {
        let wrapper = shallow(<GameBoard bombCell={bombCell} cells={cellsThreeByThreeNoBombs} />);
        let cellButton = wrapper.find('.cell').at(0);

        cellButton.simulate('click');

        cellButton = wrapper.find('.cell').at(0);

        expect(cellButton.hasClass('bombed')).toBeTruthy();
    });

    it('should give the user visual feedback that a cell with a ship has been bombed', function () {
        let wrapper = shallow(<GameBoard bombCell={bombCell} cells={cellsThreeByThreeNoBombs} />);
        let cellButton = wrapper.find('.cell').at(2);

        cellButton.simulate('click');
        wrapper.update();

        expect(cellButton.hasClass('bombed')).toBeTruthy();
        expect(cellButton.hasClass('ship')).toBeTruthy();
    });
});
