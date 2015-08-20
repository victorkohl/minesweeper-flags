'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _util = require('./util');

var Position = (function () {
  /**
   * Represents a position.
   * @constructor
   * @param {Game} game - The game this position is in.
   * @param {integer} x - The x coordinate.
   * @param {integer} y - The y coodinate.
   * @param {boolean} [hasFlag=false] - Indicates whether or not this position has a flag.
   */

  function Position() {
    var game = arguments.length <= 0 || arguments[0] === undefined ? (0, _util.requiredParam)('game') : arguments[0];
    var x = arguments.length <= 1 || arguments[1] === undefined ? (0, _util.requiredParam)('x') : arguments[1];
    var y = arguments.length <= 2 || arguments[2] === undefined ? (0, _util.requiredParam)('y') : arguments[2];
    var hasFlag = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

    _classCallCheck(this, Position);

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

  _createClass(Position, [{
    key: 'setNeighbour',
    value: function setNeighbour() {
      var neighbour = arguments.length <= 0 || arguments[0] === undefined ? (0, _util.requiredParam)('neighbour') : arguments[0];
      var position = arguments.length <= 1 || arguments[1] === undefined ? (0, _util.requiredParam)('position') : arguments[1];

      if (!this.neighbours.has(neighbour)) {
        throw new Error('The provided neighbour \'' + neighbour + '\' is invalid.');
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
  }, {
    key: 'hit',
    value: function hit() {
      if (this.isHit) {
        return this;
      }
      this.isHit = true;
      this.game.emit('position-hit', this.hasFlag, this.flagsNearby);

      if (!this.hasFlag && this.flagsNearby === 0) {
        this.neighbours.forEach(function (neighbour) {
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
  }, {
    key: '_setFlagsNearby',
    value: function _setFlagsNearby() {
      var count = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.neighbours.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var neighbour = _step.value;

          if (neighbour && neighbour.hasFlag) {
            count += 1;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.flagsNearby = count;
    }
  }]);

  return Position;
})();

exports['default'] = Position;
module.exports = exports['default'];