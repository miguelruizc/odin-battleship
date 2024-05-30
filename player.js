import { Gameboard } from './gameboard.js';

export class Player {
	constructor() {
		this.gameboard = new Gameboard();
	}

	sayHi() {
		return 'Hello, I am a player!';
	}
}
