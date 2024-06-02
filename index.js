import { DOM_manager } from './DOM_manager.js';
import { Gameboard } from './gameboard.js';
import { Pubsub } from './pubsub.js';

const pubsub = new Pubsub();
const DOM = new DOM_manager(pubsub);
const gameboard = new Gameboard(pubsub);

DOM.renderBoard(gameboard.getBoard());
