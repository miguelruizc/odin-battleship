import _ from 'lodash';
import { Pubsub } from './pubsub.js';

export class Gameboard {
	constructor(pubsub = null, player = 1) {
		this.board = this.buildBoard(10, 10, 0);
		this.ships = [];
		this.player = player;
		this.pubsub = pubsub;
		if (pubsub !== null) this.subscribeToPubsub();
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
		const coordinates = this.computeCoordinates(row, col, direction, ship.getLength());

		// check positions valid
		if (!this.isPositionValid(coordinates)) return false;

		// place ship
		coordinates.forEach((position) => {
			this.board[position.row][position.col] = 1;
		});

		// Add ship to array
		ship.setCoordinates(coordinates);
		this.ships.push(ship);

		this.publishBoardUpdate();
		this.publishShipPlaced();
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
			if (this.board[arrayCoordinates[i].row][arrayCoordinates[i].col] !== 0) {
				valid = false;
				break;
			}
			// Case: Adjacent to another ship
			if (!this.checkAdjacentFree(arrayCoordinates)) {
				valid = false;
				break;
			}
		}

		return valid;
	}

	checkAdjacentFree(shipCoords) {
		// assume free
		let free = true;

		// For each ship cell, check all 8 surrounding
		for (let i = 0; i < shipCoords.length; i++) {
			let row = shipCoords[i].row;
			let col = shipCoords[i].col;

			// 8 Surrounding (if: outofbounds == free, if not, check position)
			// 1, 2, 3
			// 4, *, 5
			// 6, 7, 8

			let adj1 = { row: row - 1, col: col - 1 };
			let adj2 = { row: row - 1, col: col };
			let adj3 = { row: row - 1, col: col + 1 };
			let adj4 = { row: row, col: col - 1 };
			let adj5 = { row: row, col: col + 1 };
			let adj6 = { row: row + 1, col: col - 1 };
			let adj7 = { row: row + 1, col: col };
			let adj8 = { row: row + 1, col: col + 1 };

			if (adj1.row <= 9 && adj1.row >= 0 && adj1.col <= 9 && adj1.col >= 0) {
				if (this.board[adj1.row][adj1.col] !== 0) free = false;
			}
			if (adj2.row <= 9 && adj2.row >= 0 && adj2.col <= 9 && adj2.col >= 0) {
				if (this.board[adj2.row][adj2.col] !== 0) free = false;
			}
			if (adj3.row <= 9 && adj3.row >= 0 && adj3.col <= 9 && adj3.col >= 0) {
				if (this.board[adj3.row][adj3.col] !== 0) free = false;
			}
			if (adj4.row <= 9 && adj4.row >= 0 && adj4.col <= 9 && adj4.col >= 0) {
				if (this.board[adj4.row][adj4.col] !== 0) free = false;
			}
			if (adj5.row <= 9 && adj5.row >= 0 && adj5.col <= 9 && adj5.col >= 0) {
				if (this.board[adj5.row][adj5.col] !== 0) free = false;
			}
			if (adj6.row <= 9 && adj6.row >= 0 && adj6.col <= 9 && adj6.col >= 0) {
				if (this.board[adj6.row][adj6.col] !== 0) free = false;
			}
			if (adj7.row <= 9 && adj7.row >= 0 && adj7.col <= 9 && adj7.col >= 0) {
				if (this.board[adj7.row][adj7.col] !== 0) free = false;
			}
			if (adj8.row <= 9 && adj8.row >= 0 && adj8.col <= 9 && adj8.col >= 0) {
				if (this.board[adj8.row][adj8.col] !== 0) free = false;
			}
		}
		console.log(`Checked adjacent free: ${free}`);

		return free;
	}

	takeShot(row, col) {
		// Returns true if shot was valid
		// Return false if shot was invalid

		// Case: Out of bounds
		if (row < 0 || row > 9 || col < 0 || col > 9) return false;

		// Case: Shot on previous shot
		if (this.board[row][col] === 9 || this.board[row][col] === 5) return false;

		// Case: Hit ship
		if (this.board[row][col] !== 0) {
			// Find ship placed
			let ship = this.findShip(row, col);
			// Damage ship
			ship.takeHit();
			// mark board
			this.board[row][col] = 5;

			this.publishBoardUpdate();
			this.publishShotTaken(row, col);
			return true;
		}

		// Case: Miss

		this.board[row][col] = 9;

		this.publishBoardUpdate();
		this.publishShotTaken(row, col);
		return true;
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
		this.pubsub.subscribe(this.takeShot.bind(this), `shotEvent${this.player}`);
	}

	subscribeToPlacementEvents() {
		this.pubsub.subscribe(this.placeShip.bind(this), `placementEvent${this.player}`);
	}

	publishBoardUpdate() {
		if (this.pubsub !== null) {
			this.pubsub.publish('boardUpdateEvent', {
				board: this.board,
				player: this.player,
			});
		}
	}

	publishShipPlaced() {
		this.pubsub.publish('shipPlacedEvent', {
			board: this.board,
			player: this.player,
		});
	}

	publishShotTaken(row, col) {
		this.pubsub.publish('shotTakenEvent', {
			board: this.board,
			player: this.player,
			row: row,
			col: col,
		});
	}
}
