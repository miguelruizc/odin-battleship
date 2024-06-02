import { DOM_manager } from './DOM_manager.js';
import { Player } from './player.js';
import { Gameboard } from './gameboard.js';
import { Pubsub } from './pubsub.js';

const pubsub = new Pubsub();
const DOM = new DOM_manager(pubsub);
const player1 = new Player(pubsub, 1);
const player2 = new Player(pubsub, 2);

DOM.renderBoard(player1.getBoard(), 1);
DOM.renderBoard(player2.getBoard(), 2);
