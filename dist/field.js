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

var _position = require('./position');

var _position2 = _interopRequireDefault(_position);

var Field = (function () {
  /**
   * Represents a field.
   * @constructor
   * @param {integer} [edge=51] - The field edge size.
   */

  function Field() {
    var edge = arguments.length <= 0 || arguments[0] === undefined ? 16 : arguments[0];

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
    value: function createBoard(game) {
      var _this = this;

      return new _bluebird2['default'](function (resolve) {
        var flags = _this._generateFlags();
        var allPositions = [];

        // creates all the Positions
        for (var y = 0; y < _this.edge; y++) {
          var row = [];
          for (var x = 0; x < _this.edge; x++) {
            var hasFlag = !! ~flags.indexOf(y + x * _this.edge);
            row[x] = new _position2['default'](game, x, y, hasFlag);
            allPositions.push(row[x]);
          }
          _this.positions.push(row);
        }

        // sets the neighbours for all Positions
        var neighbourhood = _position2['default'].neighbourhood;
        allPositions.forEach(function (position) {
          neighbourhood.forEach(function (neighbour) {
            position.setNeighbour(neighbour, _this._getNeighbour(neighbour, position));
          });
        });

        resolve();
      });
    }

    /**
     * Hits a position in the field.
     * @param {integer} x - The x coordinate.
     * @param {integer} y - The y coodinate.
     * @returns {Promise} A bluebird promise object with the position
     */
  }, {
    key: 'hitPosition',
    value: function hitPosition(x, y) {
      var _this2 = this;

      return new _bluebird2['default'](function (resolve, reject) {
        if (_lodash2['default'].isUndefined(x)) {
          (0, _util.requiredParam)('x');
        }
        if (_lodash2['default'].isUndefined(y)) {
          (0, _util.requiredParam)('y');
        }
        if (_this2._invalidCoordinates(x, y)) {
          throw new Error('Invalid coordinates: x=' + x + '; y=' + y + '.');
        }
        _this2.positions[y][x].hit().then(resolve)['catch'](reject);
      });
    }

    /**
     * Generates a list of positions where the flags will be.
     * @private
     * @returns {array} An array with the position numbers.
     */
  }, {
    key: '_generateFlags',
    value: function _generateFlags() {
      return _lodash2['default'].shuffle(_lodash2['default'].range(this.size)).slice(0, this.numberOfFlags);
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
      var x = undefined,
          y = undefined;

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
})();

exports['default'] = Field;
module.exports = exports['default'];