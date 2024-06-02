export class Queue {
	constructor() {
		this.items = [];
	}

	enqueue(element) {
		this.items.push(element);
	}

	dequeue() {
		if (this.isEmpty()) return null;
		else return this.items.shift();
	}

	isEmpty() {
		return this.items.length === 0;
	}

	toString() {
		return this.items.toString();
	}

	iterableArray() {
		return this.items;
	}
}
