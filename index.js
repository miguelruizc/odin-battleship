import { DOM_manager } from './DOM_manager.js';
import { Gameboard } from './gameboard.js';
import { Pubsub } from './pubsub.js';

const dom_manager = new DOM_manager();
const gameboard = new Gameboard();

dom_manager.renderBoard(gameboard.getBoard());
dom_manager.addBoardEventListeners(10);

const pubsub = new Pubsub();
const object = {
	testEventHandler: () => {
		console.log(
			'This object method was called when broadcasting a "testEvent"'
		);
	},
};

pubsub.subscribe(object.testEventHandler, 'testEvent');
pubsub.publish('testEvent', {});
pubsub.broadcast();
