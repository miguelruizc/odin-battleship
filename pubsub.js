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

	broadcast() {
		while (!this.eventQ.isEmpty()) {
			const event = this.eventQ.dequeue();
			// Iterate over subscribers
			this.subscribers.forEach((sub) => {
				if (event.eventType in sub) {
					// Trigger callback functions passed on subscribe
					let callback = sub[event.eventType];

					// Check type of function
					// Gameboard.takeShot(row, col){}
					if (callback.name === 'bound takeShot')
						callback(event.eventData.row, event.eventData.col);
					// Gameboard.placeShip(ship, row, col, direction)
					else if (callback.name === 'bound placeShip')
						callback(
							new Ship(1),
							event.eventData.row,
							event.eventData.col,
							'horizontal'
						);
					// Other:
					else callback();
				}
			});
		}
	}
}
