import { DOM_manager } from './DOM_manager.js';
import { Player } from './player.js';
import { Pubsub } from './pubsub.js';
import * as helpers from './helpers.js';

// Initialize objects
const pubsub = new Pubsub();
const DOM = new DOM_manager(pubsub);

// TO-DO: Implement game loop
// 0. Start game button initializes game loop
const startGameButton = document.getElementById('startGameButton');
startGameButton.addEventListener('click', play);

function play() {
	// SET UP GAME
	const player1 = new Player(pubsub, 1);
	const player2 = new Player(pubsub, 2);

	DOM.renderBoard(player1.getBoard(), 1);
	DOM.renderBoard(player2.getBoard(), 2);

	startGameButton.style.display = 'none'; // Hide startGame button
	const infoDiv = document.getElementById('gameInfo');

	// SHIP PLACEMENTS
	async function shipPlacements(player) {
		let gameShips = [1, 2, 3, 4, 5]; // each element is a ship of size 'value'

		for (let ship of gameShips) {
			helpers.clearTextContent(infoDiv);
			infoDiv.prepend(`PLAYER ${player}: PLACE SHIP(${ship})!`);

			DOM.preparePlacement(player, ship);
			DOM.activateShipPreview(ship);

			await new Promise((resolve) => {
				const handler = () => {
					pubsub.unsubscribe(handler, 'shipPlacedEvent');
					resolve();
				};
				pubsub.subscribe(handler, 'shipPlacedEvent');
			});

			DOM.deactivateShipPreview();
		}
	}

	// GAME LOOP
	async function gameLoop() {
		await shipPlacements(1);
		await shipPlacements(2);

		let currentPlayer = 1;

		while (!checkWinner()) {
			// Take a turn
			if (currentPlayer === 1) {
				await takeTurn(currentPlayer);
			}
			if (currentPlayer === 2) {
				await takeBotTurn(currentPlayer);
			}

			// Switch player
			currentPlayer = currentPlayer === 1 ? 2 : 1;
		}

		// ANNOUNCE WINNER
		alert(`WINNER: ${getWinner()}!`);
		helpers.clearTextContent(infoDiv);
		infoDiv.prepend(`WINNER: ${getWinner()}!`);

		// Play again setup
		DOM.deactivateInput();
		startGameButton.style.display = 'block';
		startGameButton.textContent = 'Play again';
	}

	async function takeTurn(player) {
		DOM.prepareTurn(player);
		helpers.clearTextContent(infoDiv);
		infoDiv.prepend(`PLAYER ${player}: SHOT!`);

		console.log('Starting wait for a shotTakenEvent');

		await new Promise((resolve) => {
			const handler = () => {
				console.log('ShotTakenEvent happened, the wait is OVAH');
				pubsub.unsubscribe(handler, 'shotTakenEvent');
				resolve();
			};
			pubsub.subscribe(handler, 'shotTakenEvent');
		});
	}

	async function takeBotTurn(player) {
		DOM.prepareTurn(player);
		helpers.clearTextContent(infoDiv);
		infoDiv.prepend(`PLAYER ${player}: SHOT!`);

		let done = false;
		//Choose a random row & col, until is valid
		do {
			// Generate random 0-9
			let randomRow = Math.floor(Math.random() * 10);
			let randomCol = Math.floor(Math.random() * 10);

			// Shot, if done === true, shot was valid
			if (player === 1) {
				done = player2.gameboard.takeShot(randomRow, randomCol);
				break;
			}
			if (player === 2) {
				done = player1.gameboard.takeShot(randomRow, randomCol);
				break;
			}
		} while (!done);
	}

	function checkWinner() {
		if (player1.isDead()) return true;
		if (player2.isDead()) return true;
		return false;
	}

	function getWinner() {
		if (player1.isDead()) return 'Player 2';
		if (player2.isDead()) return 'Player 1';
		return 'No winner';
	}

	gameLoop();
}
