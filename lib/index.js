import Game from './game';
import GameError from './error';

/**
 * MinesweeperFlags class.
 * Represents a Minesweeper Flags game.
 */
class MinesweeperFlags extends Game {
  /**
   * Creates a new instance of MinesweeperFlags.
   * @constructor
   */
  constructor() {
    super();
  }
}

MinesweeperFlags.GameError = GameError;

export default MinesweeperFlags;
