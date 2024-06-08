import { Pubsub } from './pubsub.js';
import { findShipCells } from './helpers.js';

export class DOM_manager {
	constructor(pubsub) {
		this.pubsub = pubsub;
		this.shotButtonToggle = true;
		this.placeShipButtonToggle = false;
		this.currentPlayer = 1;
		this.subscribeToPubsub();

		this.cursorX = 0;
		this.cursorY = 0;
		document.addEventListener('mousemove', (event) => {
			this.cursorX = event.clientX;
			this.cursorY = event.clientY;
		});
	}

	render() {}

	renderBoard(board, num) {
		// Take a 2D board representing a board and renders it in the DOM
		// each row is a div, each cell is a div

		// Board Div
		const boardDiv = document.getElementById(`board${num}`);
		boardDiv.innerText = '';

		for (let i = board.length - 1; i >= 0; i--) {
			// Create row
			const row = document.createElement('div');
			row.setAttribute('class', 'boardRow');

			for (let j = 0; j < board[i].length; j++) {
				// Create cell
				const cell = document.createElement('div');
				cell.setAttribute('class', 'boardCell');
				cell.setAttribute('id', `player${num},row${i},col${j}`);
				cell.textContent = board[i][j];
				if (cell.textContent === '0') cell.style.backgroundColor = '#a3e8ff';
				if (cell.textContent === '1') cell.style.backgroundColor = 'lightgrey';
				if (cell.textContent === '5') cell.style.backgroundColor = '#ff5252';
				if (cell.textContent === '9') cell.style.backgroundColor = '#7e86ff';

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
				const element = document.getElementById(`player${player},row${i},col${j}`);
				element.addEventListener('click', () => {
					this.clickCellEventHandler(i, j, player);
				});
			}
		}
	}

	clickCellEventHandler(row, col, player) {
		if (this.currentPlayer === player) {
			if (this.shotButtonToggle) {
				this.pubsub.publish(`shotEvent${player}`, {
					board: player,
					row: row,
					col: col,
				});
			} else if (this.placeShipButtonToggle) {
				this.pubsub.publish(`placementEvent${player}`, {
					board: player,
					row: row,
					col: col,
					shipSize: this.shipSize,
					shipDirection: this.shipDirection,
				});
			}
		}
	}

	subscribeToPubsub() {
		this.subscribeToBoardUpdateEvents();
	}

	subscribeToBoardUpdateEvents() {
		this.pubsub.subscribe(this.renderBoard.bind(this), 'boardUpdateEvent');
	}

	subscribeToShipPlacedEvents() {
		this.pubsub.subscribe(() => {
			this.shipPlaced = true;
			alert(`ship placed: ${this.shipPlaced}`);
		}, 'shipPlacedEvent');
	}

	preparePlacement(player, shipSize) {
		this.shotButtonToggle = false;
		this.placeShipButtonToggle = true;
		this.currentPlayer = player;
		this.shipSize = shipSize;
		this.shipDirection = 'horizontal';

		this.rotateHandler = () => {
			// Change direction
			this.shipDirection = this.shipDirection === 'horizontal' ? 'vertical' : 'horizontal';

			// Clear board of preview styles
			for (let i = 0; i < 10; i++) {
				for (let j = 0; j < 10; j++) {
					let cell = document.getElementById(
						`player${this.currentPlayer},row${i},col${j}`
					);
					cell.style.boxShadow = '';
				}
			}

			// Show preview with new direction (trigger hover event)
			const element = document.elementFromPoint(this.cursorX, this.cursorY);
			const hoverEvent = new MouseEvent('mouseover', {
				bubbles: true,
				cancelable: true,
				view: window,
			});
			element.dispatchEvent(hoverEvent);
		};

		document.addEventListener('wheel', this.rotateHandler);
	}

	prepareTurn(player) {
		this.shotButtonToggle = true;
		this.placeShipButtonToggle = false;
		this.currentPlayer = player === 1 ? 2 : 1;
	}

	deactivateInput() {
		this.shotButtonToggle = false;
		this.placeShipButtonToggle = false;
	}

	activateShipPreview(shipSize) {
		this.shipPreview = true;
		this.shipPreviewSize = shipSize;

		// Set hover event listeners (for this.currentPlayer)
		this.addHoverEventListeners();
	}

	deactivateShipPreview() {
		this.shipPreview = false;

		// Remove hover event listeners
		this.removeHoverEventListeners();
		document.removeEventListener('wheel', this.rotateHandler);
	}

	addHoverEventListeners() {
		// Array to store all handlers to remove event listeners later
		let handlersReferences = [];

		// Iterate board of current player, addHoverEventListener to each
		for (let i = 0; i < 10; i++) {
			for (let j = 0; j < 10; j++) {
				let handler = () => {
					//SHIP PLACEMENT PREVIEW LOGIC
					// -given the current cell being hovered, find the other cells that the ship reaches
					let cells = findShipCells(i, j, this.shipPreviewSize, this.shipDirection);

					// -Style positions
					cells.forEach((cell) => {
						// IF not out of bounds
						if (cell.row > -1 && cell.row < 10 && cell.col > -1 && cell.col < 10) {
							let cellElement = document.getElementById(
								`player${this.currentPlayer},row${cell.row},col${cell.col}`
							);
							cellElement.style.boxShadow = 'inset 0 0 0 1px orange';
						}
					});

					// Add mouseout event listener to reset styles
					let element = document.getElementById(
						`player${this.currentPlayer},row${i},col${j}`
					);

					let mouseOutHandler = () => {
						// -given the current cell being hovered, find the other cells that the ship reaches
						let cells = findShipCells(i, j, this.shipPreviewSize, this.shipDirection);

						// -Style positions
						cells.forEach((cell) => {
							// IF not out of bounds
							if (cell.row > -1 && cell.row < 10 && cell.col > -1 && cell.col < 10) {
								let cellElement = document.getElementById(
									`player${this.currentPlayer},row${cell.row},col${cell.col}`
								);
								cellElement.style.boxShadow = '';
							}
						});

						element.removeEventListener('mouseout', mouseOutHandler);
					};

					element.addEventListener('mouseout', mouseOutHandler);
				};
				handlersReferences.push({
					handler,
					player: this.currentPlayer,
					row: i,
					col: j,
				});

				const currentCell = document.getElementById(
					`player${this.currentPlayer},row${i},col${j}`
				);
				currentCell.addEventListener('mouseover', handler);
			}
		}

		this.hoverEventReferences = handlersReferences;
	}

	removeHoverEventListeners() {
		// Iterate board of current player, addHoverEventListener to each
		for (let i = 0; i < 10; i++) {
			for (let j = 0; j < 10; j++) {
				const currentCell = document.getElementById(
					`player${this.currentPlayer},row${i},col${j}`
				);

				// Get correct function reference
				let reference = this.hoverEventReferences.find(
					(obj) => obj.row === i && obj.col === j && obj.player === this.currentPlayer
				);

				currentCell.removeEventListener('mouseover', reference.handler);
			}
		}

		// Reset array with references
		this.hoverEventReferences = [];
	}
}
