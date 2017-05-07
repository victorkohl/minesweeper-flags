'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _events = require('events');

var _util = require('./util');

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

var _field = require('./field');

var _field2 = _interopRequireDefault(_field);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Game = function (_EventEmitter) {
  _inherits(Game, _EventEmitter);

  /**
   * Represents a game.
   * @constructor
   */
  function Game() {
    _classCallCheck(this, Game);

    var _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this));

    _this.players = [];
    _this.currentTurn = 1;
    _this.over = false;
    return _this;
  }

  /**
   * Returns whether the game is full or not.
   * @returns {boolean} 'true' if the game is full, 'false' otherwise.
   */


  _createClass(Game, [{
    key: 'start',


    /**
     * Creates the field and starts the game.
     * @param {number} [edge=16] - The edge size.
     * @returns {Game} this instance
     */
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var edge = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (this.isFull) {
                  _context.next = 2;
                  break;
                }

                throw new Error('The game must be full before you can start it.');

              case 2:
                this.field = new _field2.default(edge);
                _context.next = 5;
                return this.field.createBoard(this);

              case 5:

                this.pointsToWin = Math.floor(this.field.numberOfFlags / 2) + 1;
                this.emit('new-game', edge);
                this._changeTurn();
                return _context.abrupt('return', this);

              case 9:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function start() {
        return _ref.apply(this, arguments);
      }

      return start;
    }()

    /**
     * Adds a player.
     * A player can be any javascript object with an id attribute.
     * @param {object} player - The player object.
     * @returns {object} The new player.
     */

  }, {
    key: 'addPlayer',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(player) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if ((0, _lodash.isUndefined)(player)) {
                  (0, _util.requiredParam)('player');
                }

                if (!this.isFull) {
                  _context2.next = 3;
                  break;
                }

                throw new Error('The game is full.');

              case 3:
                if (!(!player || (typeof player === 'undefined' ? 'undefined' : _typeof(player)) !== 'object')) {
                  _context2.next = 5;
                  break;
                }

                throw new Error('Invalid player.');

              case 5:
                if (player.id) {
                  _context2.next = 7;
                  break;
                }

                throw new Error('The provided player must have an "id" attribute');

              case 7:
                player.__points = 0;
                this.players.push(player);
                return _context2.abrupt('return', player);

              case 10:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function addPlayer(_x2) {
        return _ref2.apply(this, arguments);
      }

      return addPlayer;
    }()

    /**
     * Hits a position on the field.
     * @param {object} player - The player that hit the position.
     * @param {integer} x - The X coordinate.
     * @param {integer} y - The Y coordinate.
     * @returns {boolean} Whether the move hit a flag or not.
     */

  }, {
    key: 'hitPosition',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(player, x, y) {
        var positionHit;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if ((0, _lodash.isUndefined)(player)) {
                  (0, _util.requiredParam)('player');
                }
                if ((0, _lodash.isUndefined)(x)) {
                  (0, _util.requiredParam)('x');
                }
                if ((0, _lodash.isUndefined)(y)) {
                  (0, _util.requiredParam)('y');
                }

                if (~this.players.indexOf(player)) {
                  _context3.next = 5;
                  break;
                }

                throw new _error2.default('You are not in the game.');

              case 5:
                if (!this.over) {
                  _context3.next = 7;
                  break;
                }

                throw new _error2.default('The game is over.');

              case 7:
                if (!(this.currentPlayer !== player)) {
                  _context3.next = 9;
                  break;
                }

                throw new _error2.default('It is not your turn yet.');

              case 9:
                _context3.next = 11;
                return this.field.hitPosition(x, y);

              case 11:
                positionHit = _context3.sent;

                if (positionHit.hasFlag) {
                  this._increasePlayerPoints(player);
                } else {
                  this._changeTurn();
                }
                return _context3.abrupt('return', positionHit.hasFlag);

              case 14:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function hitPosition(_x3, _x4, _x5) {
        return _ref3.apply(this, arguments);
      }

      return hitPosition;
    }()

    /**
     * Increases a player's total points.
     * @private
     * @param {object} player - The player that will receive points.
     */

  }, {
    key: '_increasePlayerPoints',
    value: function _increasePlayerPoints(player) {
      player.__points++;
      this.emit('points-changed', this.currentPlayer.id, this.currentPlayer.__points);
      if (player.__points >= this.pointsToWin) {
        this.over = true;
        this.emit('game-over');
      }
    }

    /**
     * Changes the current turn.
     * @private
     */

  }, {
    key: '_changeTurn',
    value: function _changeTurn() {
      this.currentTurn = +!this.currentTurn;
      this.emit('turn-changed', this.currentPlayer.id);
    }
  }, {
    key: 'isFull',
    get: function get() {
      return this.players.length === 2;
    }

    /**
     * Returns the current player.
     * @returns {object} The current player.
     */

  }, {
    key: 'currentPlayer',
    get: function get() {
      return this.players[this.currentTurn];
    }
  }]);

  return Game;
}(_events.EventEmitter);

exports.default = Game;