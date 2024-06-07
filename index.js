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
// startGameButton.addEventListener('click', play);
startGameButton.addEventListener('click', testSandboxPlay);

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

			await new Promise((resolve) => {
				const handler = () => {
					pubsub.unsubscribe(handler, 'shipPlacedEvent');
					resolve();
				};
				pubsub.subscribe(handler, 'shipPlacedEvent');
			});
		}
	}

	// GAME LOOP
	async function gameLoop() {
		await shipPlacements(1);
		await shipPlacements(2);

		let currentPlayer = 1;

		while (!checkWinner()) {
			// Take a turn
			await takeTurn(currentPlayer);
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

function testSandboxPlay() {
	// SET UP GAME
	const player1 = new Player(pubsub, 1);
	const player2 = new Player(pubsub, 2);

	DOM.renderBoard(player1.getBoard(), 1);
	DOM.renderBoard(player2.getBoard(), 2);

	startGameButton.style.display = 'none'; // Hide startGame button
	const infoDiv = document.getElementById('gameInfo');

	// SHIP PLACEMENTS
	async function shipPlacements(player) {
		let gameShips = [2, 3, 4, 5, 6, 7, 8]; // each element is a ship of size 'value'

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
	}

	gameLoop();
}
