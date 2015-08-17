'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x5, _x6, _x7) { var _again = true; _function: while (_again) { var object = _x5, property = _x6, receiver = _x7; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x5 = parent; _x6 = property; _x7 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require('events');

var _util = require('./util');

var _player = require('./player');

var _player2 = _interopRequireDefault(_player);

var _field = require('./field');

var _field2 = _interopRequireDefault(_field);

var Game = (function (_EventEmitter) {
  _inherits(Game, _EventEmitter);

  /**
   * Represents a game.
   * @constructor
   */

  function Game() {
    _classCallCheck(this, Game);

    _get(Object.getPrototypeOf(Game.prototype), 'constructor', this).call(this);
    this.players = [];
    this.currentTurn = 0;
    this.over = false;
    this.emit('new-game');
  }

  /**
   * Returns whether the game is full or not.
   * @returns {boolean} 'true' if the game is full, 'false' otherwise.
   */

  _createClass(Game, [{
    key: 'createField',

    /**
     * Creates the field.
     * @param {number} [edge=16] - The edge size.
     */
    value: function createField() {
      var edge = arguments.length <= 0 || arguments[0] === undefined ? 16 : arguments[0];

      this.field = new _field2['default'](edge);
      this.field.createTable();
      this.pointsToWin = Math.floor(this.field.numberOfFlags / 2) + 1;
    }

    /**
     * Adds a player.
     * @param {string} name - The player name.
     * @returns {Player} The new player.
     */
  }, {
    key: 'addPlayer',
    value: function addPlayer(name) {
      if (this.isFull) {
        throw new Error('The game is full.');
      }
      if (name && typeof name !== 'string') {
        throw new Error('Invalid name.');
      }
      var newPlayer = new _player2['default'](name);
      this.players.push(newPlayer);
      return newPlayer;
    }

    /**
     * Hits a position on the field.
     * @param {Player} player - The player that hit the position.
     * @param {integer} x - The X coordinate.
     * @param {integer} y - The Y coordinate.
     * @returns {boolean} Whether the move hit a flag or not.
     */
  }, {
    key: 'hitPosition',
    value: function hitPosition() {
      var player = arguments.length <= 0 || arguments[0] === undefined ? (0, _util.requiredParam)('player') : arguments[0];
      var x = arguments.length <= 1 || arguments[1] === undefined ? (0, _util.requiredParam)('x') : arguments[1];
      var y = arguments.length <= 2 || arguments[2] === undefined ? (0, _util.requiredParam)('y') : arguments[2];

      if (!(player instanceof _player2['default'])) {
        throw new Error('The provided player is invalid.');
      }
      if (this.over) {
        throw new Error('The game is over.');
      }
      if (this.players[this.currentTurn] !== player) {
        throw new Error('It is not ' + player.name + '\'s turn yet.');
      }

      var positionHit = this.field.hitPosition(x, y);
      this.emit('position-hit', positionHit.hasFlag, positionHit.flagsNearby);
      if (positionHit.hasFlag) {
        this._increasePlayerPoints(player);
      } else {
        this._changeTurn();
      }

      return positionHit.hasFlag;
    }

    /**
     * Increases a player's total points.
     * @private
     * @param {Player} player - The player that will receive points.
     */
  }, {
    key: '_increasePlayerPoints',
    value: function _increasePlayerPoints(player) {
      player.points++;
      if (player.points >= this.pointsToWin) {
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
      this.emit('turn-changed');
    }
  }, {
    key: 'isFull',
    get: function get() {
      return this.players.length === 2;
    }
  }]);

  return Game;
})(_events.EventEmitter);

exports['default'] = Game;
module.exports = exports['default'];