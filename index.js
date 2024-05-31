import { DOM_manager } from './DOM_manager.js';
import { Gameboard } from './gameboard.js';

const dom_manager = new DOM_manager();
const gameboard = new Gameboard();

dom_manager.renderBoard(gameboard.getBoard());
dom_manager.addBoardEventListeners(10);

// TODO: Add a pub/sub object
// Make DOM_manager generate shot events (publish event)
// Make DOM_manager generate ship placement events (publish event)

// Make PubSub broadcast shot events
// Make gameboard know when a shot event happens to trigger reaction (subscribe to shot events)
// Make gameboard know when a ship placement event happen to trigger reaction (subscribe to placement event)

// PUBSUB.publish(things)
// PUBSUB.subscribe(things)
// PUBSUB has a queue of event, for each event, communicate it to relevant subscribers
