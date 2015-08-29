import Game from './game';
import GameError from './error';

class MinesweeperFlags extends Game {
  /**
   * Represents a Minesweeper Flags game.
   * @constructor
   */
  constructor(room) {
    super();
    this.room = room;
  }
}

MinesweeperFlags.GameError = GameError;

export default MinesweeperFlags;
