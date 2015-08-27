'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _util = require('./util');

var NEIGHBOURHOOD = [['nw'], ['n'], ['ne'], ['e'], ['se'], ['s'], ['sw'], ['w']];

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
    this.neighbours = new Map(NEIGHBOURHOOD);
  }

  /**
   * Sets a neighbour.
   * @param {string} neighbour - The neighbour position.
   * @param {Position} position - The position.
   * @returns {Promise} A bluebird promise object
   */

  _createClass(Position, [{
    key: 'setNeighbour',
    value: function setNeighbour(neighbour, position) {
      var _this = this;

      return new _bluebird2['default'](function (resolve, reject) {
        if (_lodash2['default'].isUndefined(neighbour)) {
          (0, _util.requiredParam)('neighbour');
        }
        if (_lodash2['default'].isUndefined(position)) {
          (0, _util.requiredParam)('position');
        }
        if (!_this.neighbours.has(neighbour)) {
          reject(new Error('The provided neighbour \'' + neighbour + '\' is invalid.'));
        }
        if (!(position instanceof Position) && position !== null) {
          reject(new Error('The provided position is invalid.'));
        }
        _this.neighbours.set(neighbour, position);
        _this._setFlagsNearby().then(resolve);
      });
    }

    /**
     * Hits this position.
     * @returns {Position} This position.
     * @returns {Promise} A bluebird promise object
     */
  }, {
    key: 'hit',
    value: function hit() {
      var _this2 = this;

      return new _bluebird2['default'](function (resolve, reject) {
        if (_this2.isHit) {
          return resolve(_this2);
        }
        _this2.isHit = true;
        _this2.game.emit('position-hit', _this2.x, _this2.y, _this2.hasFlag, _this2.flagsNearby);

        // hit all neighbours when this position doesn't
        // have a flag nor flags nearby
        var neighboursHit = [];
        if (!_this2.hasFlag && _this2.flagsNearby === 0) {
          _this2.neighbours.forEach(function (neighbour) {
            if (neighbour) {
              neighboursHit.push(neighbour.hit());
            }
          });
        }

        _bluebird2['default'].all(neighboursHit).then(function () {
          return resolve(_this2);
        })['catch'](reject);
      });
    }

    /**
     * Recalculates the flagsNearby counter.
     * @private
     * @returns {Promise} A bluebird promise object
     */
  }, {
    key: '_setFlagsNearby',
    value: function _setFlagsNearby() {
      var _this3 = this;

      return new _bluebird2['default'](function (resolve) {
        var count = 0;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _this3.neighbours.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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

        _this3.flagsNearby = count;
        resolve();
      });
    }
  }]);

  return Position;
})();

Position.neighbourhood = NEIGHBOURHOOD.map(function (n) {
  return n[0];
});

exports['default'] = Position;
module.exports = exports['default'];