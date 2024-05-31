import { Pubsub } from './pubsub.js';
import { jest } from '@jest/globals';

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
