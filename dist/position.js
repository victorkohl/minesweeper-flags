'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NEIGHBOURHOOD = [['nw'], ['n'], ['ne'], ['e'], ['se'], ['s'], ['sw'], ['w']];

var Position = function () {
  /**
   * Represents a position.
   * @constructor
   * @param {Game} game - The game this position is in.
   * @param {integer} x - The x coordinate.
   * @param {integer} y - The y coodinate.
   * @param {boolean} [hasFlag=false] - Indicates whether or not this position has a flag.
   */
  function Position() {
    var game = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _util.requiredParam)('game');
    var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _util.requiredParam)('x');
    var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : (0, _util.requiredParam)('y');
    var hasFlag = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

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
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(neighbour, position) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if ((0, _lodash.isUndefined)(neighbour)) {
                  (0, _util.requiredParam)('neighbour');
                }
                if ((0, _lodash.isUndefined)(position)) {
                  (0, _util.requiredParam)('position');
                }

                if (this.neighbours.has(neighbour)) {
                  _context.next = 4;
                  break;
                }

                throw new Error('The provided neighbour \'' + neighbour + '\' is invalid.');

              case 4:
                if (!(!(position instanceof Position) && position !== null)) {
                  _context.next = 6;
                  break;
                }

                throw new Error('The provided position is invalid.');

              case 6:
                this.neighbours.set(neighbour, position);
                return _context.abrupt('return', this._setFlagsNearby());

              case 8:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function setNeighbour(_x5, _x6) {
        return _ref.apply(this, arguments);
      }

      return setNeighbour;
    }()

    /**
     * Hits this position.
     * @returns {Position} This position.
     * @returns {Promise} A bluebird promise object
     */

  }, {
    key: 'hit',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var neighboursHit;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this.isHit) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt('return', this);

              case 2:
                this.isHit = true;
                this.game.emit('position-hit', this.x, this.y, this.hasFlag, this.flagsNearby);

                // hit all neighbours when this position doesn't
                // have a flag nor flags nearby
                neighboursHit = [];

                if (!this.hasFlag && this.flagsNearby === 0) {
                  this.neighbours.forEach(function (neighbour) {
                    if (neighbour) {
                      neighboursHit.push(neighbour.hit());
                    }
                  });
                }

                _context2.next = 8;
                return _bluebird2.default.all(neighboursHit);

              case 8:
                return _context2.abrupt('return', this);

              case 9:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function hit() {
        return _ref2.apply(this, arguments);
      }

      return hit;
    }()

    /**
     * Recalculates the flagsNearby counter.
     * @private
     * @returns {Promise} A bluebird promise object
     */

  }, {
    key: '_setFlagsNearby',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        var count, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, neighbour;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                count = 0;
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context3.prev = 4;

                for (_iterator = this.neighbours.values()[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  neighbour = _step.value;

                  if (neighbour && neighbour.hasFlag) {
                    count += 1;
                  }
                }
                _context3.next = 12;
                break;

              case 8:
                _context3.prev = 8;
                _context3.t0 = _context3['catch'](4);
                _didIteratorError = true;
                _iteratorError = _context3.t0;

              case 12:
                _context3.prev = 12;
                _context3.prev = 13;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 15:
                _context3.prev = 15;

                if (!_didIteratorError) {
                  _context3.next = 18;
                  break;
                }

                throw _iteratorError;

              case 18:
                return _context3.finish(15);

              case 19:
                return _context3.finish(12);

              case 20:
                this.flagsNearby = count;

              case 21:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[4, 8, 12, 20], [13,, 15, 19]]);
      }));

      function _setFlagsNearby() {
        return _ref3.apply(this, arguments);
      }

      return _setFlagsNearby;
    }()
  }]);

  return Position;
}();

Position.neighbourhood = NEIGHBOURHOOD.map(function (n) {
  return n[0];
});

exports.default = Position;