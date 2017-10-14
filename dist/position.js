'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const NEIGHBOURHOOD = [['nw'], ['n'], ['ne'], ['e'], ['se'], ['s'], ['sw'], ['w']];

/**
 * Position class.
 * Represents a position in the field.
 */
class Position {
  /**
   * Creates a new instance of Position.
   * @constructor
   * @param {Game} game - The game this position is in.
   * @param {integer} x - The x coordinate.
   * @param {integer} y - The y coodinate.
   * @param {boolean} [hasFlag=false] - Indicates whether or not this position has a flag.
   */
  constructor(game = (0, _util.requiredParam)('game'), x = (0, _util.requiredParam)('x'), y = (0, _util.requiredParam)('y'), hasFlag = false) {
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
   * @return {Promise} A bluebird promise object
   */
  async setNeighbour(neighbour, position) {
    if ((0, _lodash.isUndefined)(neighbour)) {
      (0, _util.requiredParam)('neighbour');
    }
    if ((0, _lodash.isUndefined)(position)) {
      (0, _util.requiredParam)('position');
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
   * @return {Position} This position.
   * @return {Promise} A bluebird promise object
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
      this.neighbours.forEach(neighbour => {
        if (neighbour) {
          neighboursHit.push(neighbour.hit());
        }
      });
    }

    await _bluebird2.default.all(neighboursHit);
    return this;
  }

  /**
   * Recalculates the flagsNearby counter.
   * @private
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

Position.neighbourhood = NEIGHBOURHOOD.map(n => n[0]);

exports.default = Position;