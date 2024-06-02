import _ from 'lodash';
import { Pubsub } from './pubsub.js';

export class Gameboard {
	constructor(pubsub = null) {
		this.board = this.buildBoard(10, 10, 0);
		this.ships = [];
		this.pubsub = pubsub;
		this.subscribeToPubsub();
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

	placeShip(ship, row, col, direction) {
		// return true if ship was placed
		// return false if not

		// Get all positions
		const coordinates = this.computeCoordinates(
			row,
			col,
			direction,
			ship.getLength()
		);

		// check positions valid
		if (!this.isPositionValid(coordinates)) return false;

		// place ship
		coordinates.forEach((position) => {
			this.board[position.row][position.col] = 1;
		});

		// Add ship to array
		ship.setCoordinates(coordinates);
		this.ships.push(ship);

		// DEBUG:
		console.table(this.getBoard());

		return true;
	}

	computeCoordinates(row, col, direction, length) {
		let coordinates = [];

		for (let i = 0; i < length; i++) {
			let newRow = direction === 'horizontal' ? row : row + i;
			let newCol = direction === 'vertical' ? col : col + i;

			coordinates.push({ row: newRow, col: newCol });
		}

		return coordinates;
	}

	isPositionValid(arrayCoordinates) {
		let valid = true;

		for (let i = 0; i < arrayCoordinates.length; i++) {
			// Case: Out of bounds
			if (
				arrayCoordinates[i].row < 0 ||
				arrayCoordinates[i].row > 9 ||
				arrayCoordinates[i].col < 0 ||
				arrayCoordinates[i].col > 9
			) {
				valid = false;
				break;
			}
			// Case: Position taken
			if (
				this.board[arrayCoordinates[i].row][arrayCoordinates[i].col] !==
				0
			) {
				valid = false;
				break;
			}
		}

		return valid;
	}

	takeShot(row, col) {
		// Returns true if shot was valid
		// Return false if shot was invalid

		// Case: Out of bounds
		if (row < 0 || row > 9 || col < 0 || col > 9) return false;

		// Case: Shot on previous shot
		if (this.board[row][col] === 9 || this.board[row][col] === 5)
			return false;

		// Case: Hit ship
		if (this.board[row][col] !== 0) {
			// Find ship placed
			let ship = this.findShip(row, col);
			// Damage ship
			ship.takeHit();
			// mark board
			this.board[row][col] = 5;

			// DEBUG:
			console.table(this.board);

			return true;
		}

		// Case: Miss
		else {
			this.board[row][col] = 9;

			// DEBUG:
			console.table(this.board);

			return true;
		}
	}

	findShip(row, col) {
		let foundShip = null;
		let position = { row: row, col: col };

		// Iterate list of ships
		this.ships.forEach((ship) => {
			// Get current ship coordinates
			let coordinates = ship.getCoordinates();
			// Check ship coordinates against search position
			coordinates.forEach((element) => {
				if (_.isEqual(element, position)) {
					foundShip = ship;
				}
			});
		});

		return foundShip; //Null if ship not found
	}

	getShips() {
		return this.ships;
	}

	areShipsSunk() {
		let allSunk = true;
		this.ships.forEach((ship) => {
			if (!ship.isSunk()) {
				allSunk = false;
			}
		});

		return allSunk;
	}

	subscribeToPubsub() {
		this.subscribeToShotEvents();
		this.subscribeToPlacementEvents();
	}

	subscribeToShotEvents() {
		this.pubsub.subscribe(this.takeShot.bind(this), 'shotEvent');
	}

	subscribeToPlacementEvents() {
		this.pubsub.subscribe(this.placeShip.bind(this), 'placementEvent');
	}
}
