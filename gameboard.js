const { Ship } = require('./ship.js');

class Gameboard {
	constructor() {
		this.board = this.buildBoard(10, 10, 0);
		this.ships = [];
	}

	sayHi() {
		return 'Hi, I am a gameboard!';
	}

	getBoard() {
		return this.board;
	}

	buildBoard(rows, columns, emptySymbol) {
		let board = [];

		for (let i = 0; i < rows; i++) {
			let row = [];
			for (let j = 0; j < columns; j++) {
				row.push(emptySymbol);
			}
			board.push(row);
		}

		return board;
	}

	placeShip(ship, row, col) {
        // Add ship to array
        this.ships.push(ship);

        // place ship in board
        // TO-DO: RESOLVE THIS BUG (TypeError: Cannot set properties of undefined (setting 'undefined'))
        this.board[row][col] = 1;
    }

    getShips(){
        return this.ships;
    }
}


new Gameboard().placeShip(new Ship(1), 0, 0)

module.exports = { Gameboard };
