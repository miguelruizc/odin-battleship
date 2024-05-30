const {Player} = require('./player.js');

describe('Player', ()=>{
    test('Player say hi', ()=>{
        const player = new Player();
        expect(player.sayHi()).toBe('Hello, I am a player!');
    });
});