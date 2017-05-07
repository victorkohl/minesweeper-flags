'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _util = require('./util');

var _position = require('./position');

var _position2 = _interopRequireDefault(_position);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Field = function () {
  /**
   * Represents a field.
   * @constructor
   * @param {integer} [edge=51] - The field edge size.
   */
  function Field() {
    var edge = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;

    _classCallCheck(this, Field);

    this.edge = edge;
    this.positions = [];
  }

  /**
   * The total number of positions this field has.
   * @returns {Number} The board size.
   */


  _createClass(Field, [{
    key: 'createBoard',


    /**
     * Generates all positions in the field.
     * @param {Game} game - The game creating this board.
     * @returns {Promise} A bluebird promise object
     */
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(game) {
        var _this = this;

        var flags, allPositions, y, row, x, hasFlag, neighbourhood;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                flags = this._generateFlags();
                allPositions = [];

                // creates all the Positions

                for (y = 0; y < this.edge; y++) {
                  row = [];

                  for (x = 0; x < this.edge; x++) {
                    hasFlag = !!~flags.indexOf(y + x * this.edge);

                    row[x] = new _position2.default(game, x, y, hasFlag);
                    allPositions.push(row[x]);
                  }
                  this.positions.push(row);
                }

                // sets the neighbours for all Positions
                neighbourhood = _position2.default.neighbourhood;

                allPositions.forEach(function (position) {
                  neighbourhood.forEach(function (neighbour) {
                    position.setNeighbour(neighbour, _this._getNeighbour(neighbour, position));
                  });
                });

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function createBoard(_x2) {
        return _ref.apply(this, arguments);
      }

      return createBoard;
    }()

    /**
     * Hits a position in the field.
     * @param {integer} x - The x coordinate.
     * @param {integer} y - The y coodinate.
     * @returns {Promise} A bluebird promise object with the position
     */

  }, {
    key: 'hitPosition',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(x, y) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (_lodash2.default.isUndefined(x)) {
                  (0, _util.requiredParam)('x');
                }
                if (_lodash2.default.isUndefined(y)) {
                  (0, _util.requiredParam)('y');
                }

                if (!this._invalidCoordinates(x, y)) {
                  _context2.next = 4;
                  break;
                }

                throw new Error('Invalid coordinates: x=' + x + '; y=' + y + '.');

              case 4:
                return _context2.abrupt('return', this.positions[y][x].hit());

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function hitPosition(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return hitPosition;
    }()

    /**
     * Generates a list of positions where the flags will be.
     * @private
     * @returns {array} An array with the position numbers.
     */

  }, {
    key: '_generateFlags',
    value: function _generateFlags() {
      return _lodash2.default.shuffle(_lodash2.default.range(this.size)).slice(0, this.numberOfFlags);
    }

    /**
     * Returns the neighbour Position specified.
     * @private
     * @param {string} neighbour - The neighbour position.
     * @param {Position} position - The position relative to.
     * @returns {Position} The neighbour.
     */

  }, {
    key: '_getNeighbour',
    value: function _getNeighbour(neighbour, position) {
      var x = void 0,
          y = void 0;

      switch (neighbour) {
        case 'nw':
          x = position.x - 1;
          y = position.y - 1;
          break;

        case 'n':
          x = position.x;
          y = position.y - 1;
          break;

        case 'ne':
          x = position.x + 1;
          y = position.y - 1;
          break;

        case 'e':
          x = position.x + 1;
          y = position.y;
          break;

        case 'se':
          x = position.x + 1;
          y = position.y + 1;
          break;

        case 's':
          x = position.x;
          y = position.y + 1;
          break;

        case 'sw':
          x = position.x - 1;
          y = position.y + 1;
          break;

        case 'w':
          x = position.x - 1;
          y = position.y;
          break;

        default:
          throw new Error('Invalid neighbour: ' + neighbour);
      }

      // returns null if the coordinate is outside the field
      if (this._invalidCoordinates(x, y)) {
        return null;
      }

      return this.positions[y][x];
    }

    /**
     * Checks whether the coordinates are invalid.
     * @private
     * @param {integer} x - The x coordinate.
     * @param {integer} y - The y coodinate.
     * @returns {Boolean} Whether the coordinates are invalid or not.
     */

  }, {
    key: '_invalidCoordinates',
    value: function _invalidCoordinates(x, y) {
      var notIntegers = x !== parseInt(x, 10) || y !== parseInt(y, 10);
      var outsideField = x < 0 || y < 0 || x >= this.edge || y >= this.edge;
      return notIntegers || outsideField;
    }
  }, {
    key: 'size',
    get: function get() {
      return Math.pow(this.edge, 2);
    }

    /**
     * The total number of flags this field has.
     * The ratio of clear positions to flagged positions is
     * approximately 5:1 and it will always be an odd number.
     * @returns {Number} The number of flags.
     */

  }, {
    key: 'numberOfFlags',
    get: function get() {
      return Math.ceil(this.size / 5.02) | 1;
    }
  }]);

  return Field;
}();

exports.default = Field;