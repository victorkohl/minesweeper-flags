# Minesweeper Flags [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
A minesweeper flags game.

> Under development

## Events

The following events are emitted by **MinesweeperFlags**:

| Event        | Arguments                  | Description                            |
| ------------ | -------------------------- | -------------------------------------- |
| new-game     | edge                       | Emitted when a new game starts.        |
| position-hit | x, y, flagHit, flagsNearby | Emitted when a position is hit.        |
| turn-changed | playerName                 | Emitted when the turn is changed.      |
| game-over    |                            | Emitted when the game is over.         |

## License

MIT © [Victor Kohl Tavares](http://victorkohl.me)


[travis-image]: https://travis-ci.org/victorkohl/minesweeper-flags.svg?branch=master
[travis-url]: https://travis-ci.org/victorkohl/minesweeper-flags
[daviddm-image]: https://david-dm.org/victorkohl/minesweeper-flags.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/victorkohl/minesweeper-flags
