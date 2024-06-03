import { DOM_manager } from './DOM_manager.js';
import { Player } from './player.js';
import { Pubsub } from './pubsub.js';
import * as helpers from './helpers.js';

// Initialize objects
const pubsub = new Pubsub();
const DOM = new DOM_manager(pubsub);
const player1 = new Player(pubsub, 1);
const player2 = new Player(pubsub, 2);

// TO-DO: Implement game loop
// 0. Start game button initializes game loop
const startGameButton = document.getElementById('startGameButton');
startGameButton.addEventListener('click', play);

function play() {
	// Render initial boards
	DOM.renderBoard(player1.getBoard(), 1);
	DOM.renderBoard(player2.getBoard(), 2);

	// GAME LOGIC:
	startGameButton.style.display = 'none'; // Hide startGame button
	const infoDiv = document.getElementById('gameInfo');
	let isWon = false;
	let currentPlayer = 1;
	let gameShips = [1, 2, 3, 4, 5]; // each element is a ship of size 'value'

	// 1. Player 1 places ships
	async function shipPlacements(player) {
		for (let ship of gameShips) {
			helpers.clearTextContent(infoDiv);
			infoDiv.textContent = `Player ${player}, place ship size(${ship})`;

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

	async function gameLoop() {
		await shipPlacements(1);
		await shipPlacements(2);

		while (!isWon) {
			takeTurn();
			console.log('Game won!');
			isWon = true;
			// -player 1 take turn
			// -player 2 take turn
			// -check winner/draw -> if found announce and end game
			// -> else keep playing
		}
	}

	async function takeTurn() {}

	gameLoop();
}
