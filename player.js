import { Gameboard } from './gameboard.js';
import { Pubsub } from './pubsub.js';

export class Player {
	constructor(pubsub, playerNumber) {
		this.number = playerNumber;
		this.pubsub = pubsub;
		this.gameboard = new Gameboard(this.pubsub, this.number);
	}

	sayHi() {
		return 'Hello, I am a player!';
	}

	getBoard() {
		return this.gameboard.getBoard();
	}
}
