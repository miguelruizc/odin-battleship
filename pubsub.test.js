import { Pubsub } from './pubsub.js';

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
});
