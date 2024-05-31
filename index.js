import { DOM_manager } from './DOM_manager.js';
import { Gameboard } from './gameboard.js';

const dom_manager = new DOM_manager();
const gameboard = new Gameboard();

dom_manager.renderBoard(gameboard.getBoard());
dom_manager.addBoardEventListeners(10);