import { Ship } from './ship.js';
import { Queue } from './queue.js';

export class Pubsub {
	constructor() {
		this.eventQ = new Queue();
		this.subscribers = [];
	}

	getSubscribers() {
		return this.subscribers;
	}
	getEvents() {
		return this.eventQ.iterableArray();
	}

	publish(eventType, eventData, broadcast = true) {
		// Create event object
		let event = {
			eventId: this.generateUniqueId(),
			eventType: eventType,
			eventData: eventData,
		};

		// Store event object
		this.eventQ.enqueue(event);

		// LOG PUBLISHED EVENT FOR DEBUGGING
		console.log(this.eventQ.toString());

		if (broadcast) this.broadcast();
	}

	generateUniqueId() {
		for (let i = 0; true; i++) {
			let id = i;
			let isUnique = true;

			this.eventQ.iterableArray().forEach((eventObject) => {
				if (id === eventObject.eventId) isUnique = false;
			});

			if (isUnique) return id;
		}
	}

	subscribe(method, eventType) {
		this.subscribers.push({ [eventType]: method });
	}

	unsubscribe(method, eventType) {
		// Collect indices to remove
		const indicesToRemove = [];
		for (let i = 0; i < this.subscribers.length; i++) {
			if (this.subscribers[i][eventType] === method)
				indicesToRemove.push(i);
		}

		// Remove subscribers starting from the end of the array
		for (let i = indicesToRemove.length - 1; i >= 0; i--) {
			this.subscribers.splice(indicesToRemove[i], 1);
		}
	}

	broadcast() {
		while (!this.eventQ.isEmpty()) {
			const event = this.eventQ.dequeue();
			// Iterate over subscribers
			this.subscribers.forEach((sub) => {
				if (event.eventType in sub) {
					// Trigger callback functions passed on subscribe
					let callback = sub[event.eventType];

					// Check type of function
					// 'takeShot' event: Gameboard.takeShot(row, col){}
					if (callback.name === 'bound takeShot') {
						callback(event.eventData.row, event.eventData.col);
					}
					// 'placeShip' event: Gameboard.placeShip(ship, row, col, direction)
					else if (callback.name === 'bound placeShip')
						callback(
							new Ship(event.eventData.shipSize),
							event.eventData.row,
							event.eventData.col,
							event.eventData.shipDirection
						);
					// 'boardUpdate' event: DOM_manager.updateBoard
					else if (callback.name === 'bound renderBoard') {
						const board = event.eventData.board;
						const player = event.eventData.player;
						callback(board, player);
					}
					// Other:
					else callback();
				}
			});
		}
	}
}
