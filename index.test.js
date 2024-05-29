const {Ship} = require('./index.js');

describe('Ship', ()=>{
    test('Say hi', ()=>{
        const ship = new Ship();
        expect(ship.sayHi()).toBe('hello I am a ship');
    });
});