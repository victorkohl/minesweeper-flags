import Promise from 'bluebird';
import { isUndefined } from 'lodash';
import { requiredParam as req } from './util';

const NEIGHBOURHOOD = [['nw'], ['n'], ['ne'], ['e'], ['se'], ['s'], ['sw'], ['w']];

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
    this.neighbours = new Map(NEIGHBOURHOOD);
  }

  /**
   * Sets a neighbour.
   * @param {string} neighbour - The neighbour position.
   * @param {Position} position - The position.
   * @returns {Promise} A bluebird promise object
   */
  async setNeighbour(neighbour, position) {
    if (isUndefined(neighbour)) {
      req('neighbour');
    }
    if (isUndefined(position)) {
      req('position');
    }
    if (!this.neighbours.has(neighbour)) {
      throw new Error(`The provided neighbour '${neighbour}' is invalid.`);
    }
    if (!(position instanceof Position) && position !== null) {
      throw new Error('The provided position is invalid.');
    }
    this.neighbours.set(neighbour, position);
    return this._setFlagsNearby();
  }

  /**
   * Hits this position.
   * @returns {Position} This position.
   * @returns {Promise} A bluebird promise object
   */
  async hit() {
    if (this.isHit) {
      return this;
    }
    this.isHit = true;
    this.game.emit('position-hit', this.x, this.y, this.hasFlag, this.flagsNearby);

    // hit all neighbours when this position doesn't
    // have a flag nor flags nearby
    let neighboursHit = [];
    if (!this.hasFlag && this.flagsNearby === 0) {
      this.neighbours.forEach((neighbour) => {
        if (neighbour) {
          neighboursHit.push(neighbour.hit());
        }
      });
    }

    await Promise.all(neighboursHit);
    return this;
  }

  /**
   * Recalculates the flagsNearby counter.
   * @private
   * @returns {Promise} A bluebird promise object
   */
  async _setFlagsNearby() {
    let count = 0;
    for (let neighbour of this.neighbours.values()) {
      if (neighbour && neighbour.hasFlag) {
        count += 1;
      }
    }
    this.flagsNearby = count;
  }
}

Position.neighbourhood = NEIGHBOURHOOD.map((n) => n[0]);

export default Position;
