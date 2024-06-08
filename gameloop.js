import { DOM_manager } from './DOM_manager.js';
import { Player } from './player.js';
import { Pubsub } from './pubsub.js';
import { Ship } from './ship.js';
import * as helpers from './helpers.js';

// Initialize objects
const pubsub = new Pubsub();
const DOM = new DOM_manager(pubsub);

// TO-DO: Implement game loop
// 0. Start game button initializes game loop
const startGameButton = document.getElementById('startGameButton');
startGameButton.addEventListener('click', play);

async function play() {
	// SET UP GAME
	const player1 = new Player(pubsub, 1);
	const player2 = new Player(pubsub, 2);

	DOM.renderBoard(player1.getBoard(), 1);
	DOM.renderBoard(player2.getBoard(), 2);

	// DOM.hideBoard(2);

	startGameButton.style.display = 'none'; // Hide startGame button
	const infoDiv = document.getElementById('gameInfo');
	helpers.clearTextContent(infoDiv);
	DOM.resetGameInfoDiv();

	let mode = await choseGameMode();
	let difficulty = 1;

	if (mode.player1 === 'human') difficulty = await choseDifficulty();

	gameLoop(mode.player1, mode.player2);

	// GAME LOOP
	async function gameLoop(player1 = 'bot', player2 = 'bot') {
		// Player 1 Ship placements
		if (player1 === 'human') await shipPlacements(1);
		if (player1 === 'bot') await botShipPlacements(1);
		// Player 2 Ship placements
		if (player2 === 'human') await shipPlacements(2);
		if (player2 === 'bot') await botShipPlacements(2);

		let currentPlayer = 1;
		while (!checkWinner()) {
			// Take a turn
			if (currentPlayer === 1) {
				if (player1 === 'human') await takeTurn(currentPlayer);
				if (player1 === 'bot') await takeBotTurn(currentPlayer);
			}
			if (currentPlayer === 2) {
				if (player2 === 'human') await takeTurn(currentPlayer);
				if (player2 === 'bot') await takeBotTurn(currentPlayer);
			}
			// Switch player
			currentPlayer = currentPlayer === 1 ? 2 : 1;
		}
		// ANNOUNCE WINNER
		helpers.clearTextContent(infoDiv);
		infoDiv.prepend(`WINNER: ${getWinner()}!`);
		if (getWinner() === 'Player 1') {
			infoDiv.style.border = '2px solid #67ff83';
		}
		if (getWinner() === 'Player 2') {
			infoDiv.style.border = '2px solid #fbff7e';
		}

		// Play again setup
		DOM.deactivateInput();
		startGameButton.style.display = 'block';
		startGameButton.textContent = 'Play again';
	}

	async function choseGameMode() {
		helpers.clearTextContent(infoDiv);

		const botVsBotButton = document.createElement('button');
		botVsBotButton.textContent = 'Bot vs Bot';

		const humanVsBotButton = document.createElement('button');
		humanVsBotButton.textContent = 'Human vs Bot';

		const promise = new Promise((resolve) => {
			const handler1 = () => {
				botVsBotButton.removeEventListener('click', handler1);
				humanVsBotButton.removeEventListener('click', handler2);
				infoDiv.removeChild(botVsBotButton);
				infoDiv.removeChild(humanVsBotButton);
				resolve({ player1: 'bot', player2: 'bot' });
			};

			const handler2 = () => {
				humanVsBotButton.removeEventListener('click', handler2);
				botVsBotButton.removeEventListener('click', handler1);
				infoDiv.removeChild(botVsBotButton);
				infoDiv.removeChild(humanVsBotButton);
				resolve({ player1: 'human', player2: 'bot' });
			};

			botVsBotButton.addEventListener('click', handler1);
			humanVsBotButton.addEventListener('click', handler2);
		});

		infoDiv.appendChild(botVsBotButton);
		infoDiv.appendChild(humanVsBotButton);

		return promise;
	}

	async function choseDifficulty() {
		helpers.clearTextContent(infoDiv);

		const text = document.createElement('p');
		text.textContent = 'Chose difficulty:';

		const diff1 = document.createElement('button');
		diff1.textContent = '1';
		const diff2 = document.createElement('button');
		diff2.textContent = '2';
		const diff3 = document.createElement('button');
		diff3.textContent = '3';
		const diff4 = document.createElement('button');
		diff4.textContent = '4';
		const diff5 = document.createElement('button');
		diff5.textContent = '5';

		const promise = new Promise((resolve) => {
			const handler1 = () => {
				diff1.removeEventListener('click', handler1);
				diff2.removeEventListener('click', handler2);
				diff3.removeEventListener('click', handler3);
				diff4.removeEventListener('click', handler4);
				diff5.removeEventListener('click', handler5);
				infoDiv.removeChild(difficulties);
				infoDiv.removeChild(text);
				resolve(1);
			};

			const handler2 = () => {
				diff1.removeEventListener('click', handler1);
				diff2.removeEventListener('click', handler2);
				diff3.removeEventListener('click', handler3);
				diff4.removeEventListener('click', handler4);
				diff5.removeEventListener('click', handler5);
				infoDiv.removeChild(difficulties);
				infoDiv.removeChild(text);
				resolve(2);
			};

			const handler3 = () => {
				diff1.removeEventListener('click', handler1);
				diff2.removeEventListener('click', handler2);
				diff3.removeEventListener('click', handler3);
				diff4.removeEventListener('click', handler4);
				diff5.removeEventListener('click', handler5);
				infoDiv.removeChild(difficulties);
				infoDiv.removeChild(text);
				resolve(3);
			};

			const handler4 = () => {
				diff1.removeEventListener('click', handler1);
				diff2.removeEventListener('click', handler2);
				diff3.removeEventListener('click', handler3);
				diff4.removeEventListener('click', handler4);
				diff5.removeEventListener('click', handler5);
				infoDiv.removeChild(difficulties);
				infoDiv.removeChild(text);
				resolve(4);
			};

			const handler5 = () => {
				diff1.removeEventListener('click', handler1);
				diff2.removeEventListener('click', handler2);
				diff3.removeEventListener('click', handler3);
				diff4.removeEventListener('click', handler4);
				diff5.removeEventListener('click', handler5);
				infoDiv.removeChild(difficulties);
				infoDiv.removeChild(text);
				resolve(5);
			};

			diff1.addEventListener('click', handler1);
			diff2.addEventListener('click', handler2);
			diff3.addEventListener('click', handler3);
			diff4.addEventListener('click', handler4);
			diff5.addEventListener('click', handler5);
		});

		const difficulties = document.createElement('div');
		difficulties.style.display = 'flex';
		difficulties.style.gap = '5px';

		difficulties.appendChild(diff1);
		difficulties.appendChild(diff2);
		difficulties.appendChild(diff3);
		difficulties.appendChild(diff4);
		difficulties.appendChild(diff5);

		infoDiv.appendChild(text);
		infoDiv.appendChild(difficulties);

		return promise;
	}

	// SHIP PLACEMENTS
	async function botShipPlacements(player) {
		let gameShips = [1, 2, 3, 4, 5]; // each element is a ship of size 'value'

		for (let ship of gameShips) {
			helpers.clearTextContent(infoDiv);
			let shipAsci = '';
			for (let i = 0; i < ship; i++) shipAsci += '■';
			infoDiv.prepend(`PLAYER ${player}: PLACE SHIP(${shipAsci})!`);

			DOM.preparePlacement(player, ship, true);
			DOM.resetCursorPointers();

			await helpers.delay(500);

			let placed = false;
			while (!placed) {
				// Generate random direction
				const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
				// Generate random position
				const row = Math.floor(Math.random() * 10);
				const col = Math.floor(Math.random() * 10);

				// Try to place the thing
				if (player === 1)
					placed = player1.gameboard.placeShip(new Ship(ship), row, col, direction);
				if (player === 2)
					placed = player2.gameboard.placeShip(new Ship(ship), row, col, direction);
			}
		}
	}

	async function shipPlacements(player) {
		let gameShips = [1, 2, 3, 4, 5]; // each element is a ship of size 'value'

		for (let ship of gameShips) {
			helpers.clearTextContent(infoDiv);
			let shipAsci = '';
			for (let i = 0; i < ship; i++) shipAsci += '■';
			infoDiv.prepend(`PLAYER ${player}: PLACE SHIP(${shipAsci})!`);

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

	async function takeTurn(player) {
		DOM.prepareTurn(player);
		helpers.clearTextContent(infoDiv);
		infoDiv.prepend(`PLAYER ${player}: SHOT!`);

		await new Promise((resolve) => {
			const handler = () => {
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

		DOM.resetCursorPointers();

		// Shot, if done === true, shot was valid
		await helpers.delay(50);
		if (player === 1) {
			player2.gameboard.takeLuckyShot(difficulty);
		} else if (player === 2) {
			player1.gameboard.takeLuckyShot(difficulty);
		}
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
}
