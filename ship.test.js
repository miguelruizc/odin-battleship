const { Ship } = require('./ship.js');

describe('Ship', () => {
	test('Say hi', () => {
		const ship = new Ship();
		expect(ship.sayHi()).toBe('Hello, I am a ship!');
	});

	test('New Ship(5) Creates a ship of length 5', () => {
		const ship = new Ship(5);
		expect(ship.getLength()).toBe(5);
	});

	test('Check if ship is sunk', () => {
		const ship = new Ship(1);
		expect(ship.isSunk()).toBe(false);
	});

	test('Ship sinks after getting hit too many times', () => {
		const ship = new Ship(3);
		ship.takeHit();
		ship.takeHit();
		ship.takeHit();
		expect(ship.isSunk()).toBe(true);
	});
});
