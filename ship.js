class Ship{
    constructor(length = 1){
        this.length = length;
        this.hits = 0;
        this.sunkStatus = false;
    }

    sayHi(){
        return 'Hello, I am a ship!';
    }

    getLength(){
        return this.length;
    }

    isSunk(){
        return this.sunkStatus;
    }

    takeHit(){
        this.hits++;
        if(this.hits >= this.length) this.sunkStatus = true;
    }
}

module.exports = {Ship};