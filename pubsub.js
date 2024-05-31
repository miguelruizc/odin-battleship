export class Pubsub {
	constructor() {
		this.events = [];
	}

	getEvents() {
		return this.events;
	}

	publish(eventType, eventData) {
		// Create event object
		let event = {
			eventId: this.generateUniqueId(),
			eventType: eventType,
			eventData: eventData,
		};

		// Store event object
		this.events.push(event);
	}

	generateUniqueId() {
		for (let i = 0; true; i++) {
			let id = i;
			let isUnique = true;

			this.events.forEach((eventObject) => {
				if (id === eventObject.eventId) isUnique = false;
			});

			if (isUnique) return id;
		}
	}
}
