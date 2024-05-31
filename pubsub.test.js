import { Pubsub } from './pubsub.js';

describe('Pubsub', () => {
	test('Pubsub object exists', () => {
		const pubsub = new Pubsub();
		expect(pubsub instanceof Pubsub).toBe(true);
	});
});
