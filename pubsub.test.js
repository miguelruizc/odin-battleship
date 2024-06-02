import { Pubsub } from './pubsub.js';
import { jest } from '@jest/globals';
import { DOM_manager } from './DOM_manager.js';
import { Gameboard } from './gameboard.js';

describe('Pubsub', () => {
	test('Pubsub object exists', () => {
		const pubsub = new Pubsub();
		expect(pubsub instanceof Pubsub).toBe(true);
	});

	test('publish() adds event with a name and data', () => {
		const pubsub = new Pubsub();
		pubsub.publish('testEvent', { dataKey: 'dataValue' });
		expect(pubsub.getEvents()) //
			.toEqual([
				{
					eventId: 0,
					eventType: 'testEvent',
					eventData: { dataKey: 'dataValue' },
				},
			]);
	});

	test('Correctly adds 3 events of different type and data', () => {
		const pubsub = new Pubsub();
		pubsub.publish('redEvent', { color: 'red' });
		pubsub.publish('bananaEvent', { flavour: 'sweet' });
		pubsub.publish('clickEvent', { coordinatesX: 100, coordinatesY: 200 });

		expect(pubsub.getEvents()) //
			.toEqual([
				{
					eventId: 0,
					eventType: 'redEvent',
					eventData: { color: 'red' },
				},
				{
					eventId: 1,
					eventType: 'bananaEvent',
					eventData: { flavour: 'sweet' },
				},
				{
					eventId: 2,
					eventType: 'clickEvent',
					eventData: { coordinatesX: 100, coordinatesY: 200 },
				},
			]);
	});

	test('Can subscribe an object method to events of cool type', () => {
		const pubsub = new Pubsub();
		const object = {
			// Arrow function to preserve 'this' context
			coolEventHandler: () => {
				return 'I handle the cool events';
			},
		};
		pubsub.subscribe(object.coolEventHandler, 'coolEvent');
		expect(pubsub.getSubscribers()) //
			.toEqual([{ coolEvent: object.coolEventHandler }]);
	});

	test('Can broadcast an event by calling the method provided on subscribe', () => {
		const pubsub = new Pubsub();
		const object = {
			testEventHandler: () => {
				console.log(
					'This object method was called when broadcasting a "testEvent"'
				);
			},
		};

		const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

		pubsub.subscribe(object.testEventHandler, 'testEvent');
		pubsub.publish('testEvent', {});
		pubsub.broadcast();

		expect(consoleSpy).toHaveBeenCalledWith(
			'This object method was called when broadcasting a "testEvent"'
		);

		consoleSpy.mockRestore;
	});
});

describe('Pubsub/DOM_manager tests', () => {
	test('DOM_manager publish shotEvent with coordinates to pubsub', () => {
		const pubsub = new Pubsub();
		const DOMman = new DOM_manager(pubsub, true);
		DOMman.shotButtonToggle = true;
		DOMman.placeShipButtonToggle = false;
		DOMman.clickCellEventHandler(0, 0);

		pubsub.broadcast();

		expect(pubsub.getEvents()).toEqual([
			{
				eventId: 0,
				eventType: 'shotEvent',
				eventData: { row: 0, col: 0 },
			},
		]);
	});

	test('DOM_manager publish place ship event with coordinates to pubsub', () => {
		const pubsub = new Pubsub();
		const DOMman = new DOM_manager(pubsub, true);
		DOMman.shotButtonToggle = false;
		DOMman.placeShipButtonToggle = true;
		DOMman.clickCellEventHandler(0, 0);

		expect(pubsub.getEvents()).toEqual([
			{
				eventId: 0,
				eventType: 'placementEvent',
				eventData: { row: 0, col: 0 },
			},
		]);
	});
});

describe('Pubsub/Gameboard/DOM_manager tests', () => {
	test('Pubsub broadcasts shotEvent from DOM_manager to Gameboard', () => {
		const pubsub = new Pubsub();
		const DOMman = new DOM_manager(pubsub, true);
		const gameboard = new Gameboard(pubsub);
		gameboard.subscribeToShotEvents();

		DOMman.shotButtonToggle = true;
		DOMman.placeShipButtonToggle = false;
		// Publish shotEvent
		DOMman.clickCellEventHandler(1, 1);

		pubsub.broadcast();

		expect(gameboard.getBoard()).toEqual([
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 9, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		]);
	});
});
