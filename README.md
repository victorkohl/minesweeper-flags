# Minesweeper Flags [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
A minesweeper flags game.

## Installation

```
npm install victorkohl/minesweeper-flags
```

## Example

```javascript
import MinesweeperFlags from 'minesweeper-flags';

// creates a new Flags game
let game = new MinesweeperFlags();

// setup the event handlers
game.on('new-game', (edge) => {
    console.log(`New Game (${edge}x${edge})`)
});
game.on('position-hit', (x, y, flagHit, flagsNearby) => {
    console.log(`Position Hit (${x},${y}) flagHit=${flagHit}; flagsNearby=${flagsNearby}`)
});
game.on('turn-changed', (playerId) => {
    console.log(`Turn Changed (id=${playerId})`)
});
game.on('points-changed', (playerId, points) => {
    console.log(`Points Changed (id=${playerId}, points=${points})`)
});
game.on('game-over', () => {
    console.log(`Game Over`)
});

// create player objects (it can be any object with an ID attribute)
let player1 = { id: 1 };
let player2 = { id: 2 };

// add players to the game
game.addPlayer(player1)
    .then(() => game.addPlayer(player2))

// start the game with a 10x10 board
    .then(() => game.start(10))

// hits the position 0, 0
    .then(() => game.hitPosition(player1, 0, 0));


// A possible output:
// New Game (10x10)
// Turn Changed (id=1)
// Position Hit (0,0) flagHit=false; flagsNearby=1
// Turn Changed (id=2)
```

## Events

The following events are emitted by **MinesweeperFlags**:

| Event          | Arguments                  | Description                            |
| -------------- | -------------------------- | -------------------------------------- |
| new-game       | edge                       | Emitted when a new game starts.        |
| position-hit   | x, y, flagHit, flagsNearby | Emitted when a position is hit.        |
| points-changed | playerId                   | Emitted when a player's points change. |
| turn-changed   | playerId, points           | Emitted when the turn is changed.      |
| game-over      |                            | Emitted when the game is over.         |

## Testing

```
npm test
```

## License

MIT © [Victor Kohl Tavares](http://victorkohl.me)


[travis-image]: https://travis-ci.org/victorkohl/minesweeper-flags.svg?branch=master
[travis-url]: https://travis-ci.org/victorkohl/minesweeper-flags
[daviddm-image]: https://david-dm.org/victorkohl/minesweeper-flags.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/victorkohl/minesweeper-flags
