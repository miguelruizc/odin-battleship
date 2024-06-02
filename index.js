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
	// startGameButton.style.display = 'none'; // Hide startGame button
	const infoDiv = document.getElementById('gameInfo');
	let isWon = false;
	let currentPlayer = 1;
	let gameShips = [1, 2, 3, 4, 5]; // each element is a ship of size 'value'

	// 1. Player 1 places ships
	gameShips.forEach((ship) => {
		helpers.clearTextContent(infoDiv);
		infoDiv.textContent = `Player 1, place ship size(${ship})`;

		// Wait for the player to click on the board
		// TODO: Figure out how to wait valid input here, and proceed or keep waiting

		// Set DOM_manager internals to specify player & board & intention
	});
	// 2. Player 2 places ships
	// 3. Loop until win
	// -player 1 take turn
	// -player 2 take turn
	// -check winner/draw -> if found announce and end game
	// -> else keep playing
}
