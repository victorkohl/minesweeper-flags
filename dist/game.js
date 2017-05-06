'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _events = require('events');

var _util = require('./util');

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

var _field = require('./field');

var _field2 = _interopRequireDefault(_field);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    value: function start() {
      var _this2 = this;

      var edge = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;

      return new _bluebird2.default(function (resolve, reject) {
        if (!_this2.isFull) {
          throw new Error('The game must be full before you can start it.');
        }
        _this2.field = new _field2.default(edge);
        _this2.field.createBoard(_this2).then(function () {
          _this2.pointsToWin = Math.floor(_this2.field.numberOfFlags / 2) + 1;
          _this2.emit('new-game', edge);
          _this2._changeTurn();
          return _this2;
        }).then(resolve).catch(reject);
      });
    }

    /**
     * Adds a player.
     * A player can be any javascript object with an id attribute.
     * @param {object} player - The player object.
     * @returns {object} The new player.
     */

  }, {
    key: 'addPlayer',
    value: function addPlayer(player) {
      var _this3 = this;

      return new _bluebird2.default(function (resolve) {
        if (_lodash2.default.isUndefined(player)) {
          (0, _util.requiredParam)('player');
        }
        if (_this3.isFull) {
          throw new Error('The game is full.');
        }
        if (!player || (typeof player === 'undefined' ? 'undefined' : _typeof(player)) !== 'object') {
          throw new Error('Invalid player.');
        }
        if (!player.id) {
          throw new Error('The provided player must have an "id" attribute');
        }
        player.__points = 0;
        _this3.players.push(player);
        resolve(player);
      });
    }

    /**
     * Hits a position on the field.
     * @param {object} player - The player that hit the position.
     * @param {integer} x - The X coordinate.
     * @param {integer} y - The Y coordinate.
     * @returns {boolean} Whether the move hit a flag or not.
     */

  }, {
    key: 'hitPosition',
    value: function hitPosition(player, x, y) {
      var _this4 = this;

      return new _bluebird2.default(function (resolve, reject) {
        if (_lodash2.default.isUndefined(player)) {
          (0, _util.requiredParam)('player');
        }
        if (_lodash2.default.isUndefined(x)) {
          (0, _util.requiredParam)('x');
        }
        if (_lodash2.default.isUndefined(y)) {
          (0, _util.requiredParam)('y');
        }
        if (!~_this4.players.indexOf(player)) {
          throw new _error2.default('You are not in the game.');
        }
        if (_this4.over) {
          throw new _error2.default('The game is over.');
        }
        if (_this4.currentPlayer !== player) {
          throw new _error2.default('It is not your turn yet.');
        }

        _this4.field.hitPosition(x, y).then(function (positionHit) {
          if (positionHit.hasFlag) {
            _this4._increasePlayerPoints(player);
          } else {
            _this4._changeTurn();
          }
          return positionHit.hasFlag;
        }).then(resolve).catch(reject);
      });
    }

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