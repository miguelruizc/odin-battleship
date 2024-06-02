import { Pubsub } from './pubsub.js';

export class DOM_manager {
	constructor(pubsub, testInstance = false) {
		if (!testInstance) {
			this.pubsub = pubsub;
			this.shotButtonToggle = true;
			this.placeShipButtonToggle = false;
			this.subscribeToPubsub();
		} else {
			this.pubsub = pubsub;
			this.shotButtonToggle = false;
			this.placeShipButtonToggle = false;
		}
	}

	render() {}

	renderBoard(board, num) {
		// Take a 2D board representing a board and renders it in the DOM
		// each row is a div, each cell is a div

		// Board Div
		const boardDiv = document.getElementById(`board${num}`);
		boardDiv.innerText = '';

		for (let i = 0; i < board.length; i++) {
			// Create row
			const row = document.createElement('div');
			row.setAttribute('class', 'boardRow');

			for (let j = 0; j < board[i].length; j++) {
				// Create cell
				const cell = document.createElement('div');
				cell.setAttribute('class', 'boardCell');
				cell.setAttribute('id', `player${num},row${i},col${j}`);
				cell.textContent = board[i][j];

				// Append cell
				row.appendChild(cell);
			}

			//Append row
			boardDiv.appendChild(row);
		}

		// Add board event listeners
		this.addBoardEventListeners(board.length, num);
	}

	addBoardEventListeners(boardSize, player) {
		for (let i = 0; i < boardSize; i++) {
			for (let j = 0; j < boardSize; j++) {
				const element = document.getElementById(
					`player${player},row${i},col${j}`
				);
				element.addEventListener('click', () => {
					this.clickCellEventHandler(i, j, player);
				});
			}
		}
	}

	clickCellEventHandler(row, col, player) {
		if (this.shotButtonToggle) {
			this.pubsub.publish(`shotEvent${player}`, {
				board: player,
				row: row,
				col: col,
			});
		} else {
			this.pubsub.publish(`placementEvent${player}`, {
				board: player,
				row: row,
				col: col,
			});
		}
	}

	subscribeToPubsub() {
		this.subscribeToBoardUpdateEvents();
	}

	subscribeToBoardUpdateEvents() {
		this.pubsub.subscribe(this.renderBoard.bind(this), 'boardUpdateEvent');
	}

	togglePlayer1Placements() {
		this.shotButtonToggle = false;
		this.placeShipButtonToggle = true;
	}
}
