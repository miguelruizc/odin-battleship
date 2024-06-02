import { Pubsub } from './pubsub.js';

export class DOM_manager {
	constructor(pubsub, testInstance = false) {
		if (!testInstance) {
			this.pubsub = pubsub;
			this.shotButtonToggle = true;
			document.getElementById('shotButton').style.backgroundColor =
				'lightgreen';
			this.placeShipButtonToggle = false;
			this.shotButtonAddEventListener();
			this.placeShipButtonAddEventListener();
		} else {
			this.pubsub = pubsub;
			this.shotButtonToggle = false;
			this.placeShipButtonToggle = false;
		}
	}

	render() {}

	renderBoard(board) {
		// Take a 2D board representing a board and renders it in the DOM
		// each row is a div, each cell is a div

		// Board Div
		const boardDiv = document.getElementById('board1');

		for (let i = 0; i < board.length; i++) {
			// Create row
			const row = document.createElement('div');
			row.setAttribute('class', 'boardRow');

			for (let j = 0; j < board[i].length; j++) {
				// Create cell
				const cell = document.createElement('div');
				cell.setAttribute('class', 'boardCell');
				cell.setAttribute('id', `row${i},col${j}`);
				cell.textContent = board[i][j];

				// Append cell
				row.appendChild(cell);
			}

			//Append row
			boardDiv.appendChild(row);
		}

		// Add board event listeners
		this.addBoardEventListeners(board.length);
	}

	shotButtonAddEventListener() {
		const button = document.getElementById('shotButton');
		button.addEventListener(
			'click',
			this.shotButtonEventHandler.bind(this)
		);
	}

	shotButtonEventHandler(event) {
		this.shotButtonToggle = true;
		this.placeShipButtonToggle = false;
		event.target.style.backgroundColor = 'lightgreen';
		event.target.nextElementSibling.style.backgroundColor = 'white';
	}

	placeShipButtonAddEventListener() {
		const button = document.getElementById('placeShipButton');
		button.addEventListener(
			'click',
			this.placeShipButtonEventHandler.bind(this)
		);
	}

	placeShipButtonEventHandler(event) {
		this.placeShipButtonToggle = true;
		this.shotButtonToggle = false;
		event.target.style.backgroundColor = 'lightgreen';
		event.target.previousElementSibling.style.backgroundColor = 'white';
	}

	addBoardEventListeners(boardSize) {
		for (let i = 0; i < boardSize; i++) {
			for (let j = 0; j < boardSize; j++) {
				const element = document.getElementById(`row${i},col${j}`);
				element.addEventListener('click', () => {
					this.clickCellEventHandler(i, j);
				});
			}
		}
	}

	clickCellEventHandler(row, col) {
		if (this.shotButtonToggle) {
			alert(`shotEvent: row${row}, col${col}`);
			this.pubsub.publish('shotEvent', { row: row, col: col });
		} else {
			alert(`placementEvent: row${row}, col${col}`);
			this.pubsub.publish('placementEvent', { row: row, col: col });
		}
	}

	subscribeToPubsub() {}
}
