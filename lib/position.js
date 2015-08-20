import { requiredParam as req } from './util';

class Position {
  /**
   * Represents a position.
   * @constructor
   * @param {Game} game - The game this position is in.
   * @param {integer} x - The x coordinate.
   * @param {integer} y - The y coodinate.
   * @param {boolean} [hasFlag=false] - Indicates whether or not this position has a flag.
   */
  constructor(game = req('game'), x = req('x'), y = req('y'), hasFlag = false) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.hasFlag = hasFlag;
    this.isHit = false;
    this.flagsNearby = 0;
    this.neighbours = new Map([['nw'], ['n'], ['ne'], ['e'], ['se'], ['s'], ['sw'], ['w']]);
  }

  /**
   * Sets a neighbour.
   * @param {string} neighbour - The neighbour position.
   * @param {Position} position - The position.
   */
  setNeighbour(neighbour = req('neighbour'), position = req('position')) {
    if (!this.neighbours.has(neighbour)) {
      throw new Error(`The provided neighbour '${neighbour}' is invalid.`);
    }
    if (!(position instanceof Position) && position !== null) {
      throw new Error('The provided position is invalid.');
    }
    this.neighbours.set(neighbour, position);
    this._setFlagsNearby();
  }

  /**
   * Hits this position.
   * @returns {Position} This position.
   */
  hit() {
    if (this.isHit) {
      return this;
    }
    this.isHit = true;
    this.game.emit('position-hit', this.hasFlag, this.flagsNearby);

    if (!this.hasFlag && this.flagsNearby === 0) {
      this.neighbours.forEach((neighbour) => {
        if (neighbour) {
          neighbour.hit();
        }
      });
    }

    return this;
  }

  /**
   * Recalculates the flagsNearby counter.
   * @private
   */
  _setFlagsNearby() {
    let count = 0;
    for (let neighbour of this.neighbours.values()) {
      if (neighbour && neighbour.hasFlag) {
        count += 1;
      }
    }
    this.flagsNearby = count;
  }
}

export default Position;
