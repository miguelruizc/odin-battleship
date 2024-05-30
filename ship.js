export class Ship {
	constructor(length = 1) {
		this.length = length;
		this.hits = 0;
		this.sunkStatus = false;
		this.coordinates = [];
	}

	sayHi() {
		return 'Hello, I am a ship!';
	}

	getLength() {
		return this.length;
	}

	getHits() {
		return this.hits;
	}

	isSunk() {
		return this.sunkStatus;
	}

	takeHit() {
		this.hits++;
		if (this.hits >= this.length) this.sunkStatus = true;
	}

	setCoordinates(coordinatesArray) {
		this.coordinates = [];
		this.coordinates.push(...coordinatesArray);
	}

	getCoordinates() {
		return this.coordinates;
	}
}
