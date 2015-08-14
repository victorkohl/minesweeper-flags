import { requiredParam as req } from './util';

export default class Position {
  /**
   * Represents a position.
   * @constructor
   * @param {integer} x - The x coordinate.
   * @param {integer} y - The y coodinate.
   * @param {boolean} [hasFlag=false] - Indicates whether or not this position has a flag.
   */
  constructor(x = req('x'), y = req('y'), hasFlag = false) {
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
   * @returns {Boolean} Whether this position has a flag or not.
   */
  hit() {
    if (this.isHit) {
      return this.hasFlag;
    }
    this.isHit = true;

    if (!this.hasFlag && this.flagsNearby === 0) {
      this.neighbours.forEach((neighbour) => {
        if (neighbour) {
          neighbour.hit();
        }
      });
    }

    return this.hasFlag;
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
