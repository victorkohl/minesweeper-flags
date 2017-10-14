'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _events = require('events');

var _util = require('./util');

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

var _field = require('./field');

var _field2 = _interopRequireDefault(_field);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Game class.
 */
class Game extends _events.EventEmitter {
  /**
   * Creates a new instance of Game.
   * @constructor
   */
  constructor() {
    super();
    this.players = [];
    this.currentTurn = 1;
    this.over = false;
  }

  /**
   * Returns whether the game is full or not.
   * @return {boolean} 'true' if the game is full, 'false' otherwise.
   */
  get isFull() {
    return this.players.length === 2;
  }

  /**
   * Returns the current player.
   * @return {object} The current player.
   */
  get currentPlayer() {
    return this.players[this.currentTurn];
  }

  /**
   * Creates the field and starts the game.
   * @param {number} [edge=16] - The edge size.
   * @return {Game} this instance
   */
  async start(edge = 16) {
    if (!this.isFull) {
      throw new Error('The game must be full before you can start it.');
    }
    this.field = new _field2.default(edge);
    await this.field.createBoard(this);

    this.pointsToWin = Math.floor(this.field.numberOfFlags / 2) + 1;
    this.emit('new-game', edge);
    this._changeTurn();
    return this;
  }

  /**
   * Adds a player.
   * A player can be any javascript object with an id attribute.
   * @param {object} player - The player object.
   * @return {object} The new player.
   */
  async addPlayer(player) {
    if ((0, _lodash.isUndefined)(player)) {
      (0, _util.requiredParam)('player');
    }
    if (this.isFull) {
      throw new Error('The game is full.');
    }
    if (!player || typeof player !== 'object') {
      throw new Error('Invalid player.');
    }
    if (!player.id) {
      throw new Error('The provided player must have an "id" attribute');
    }
    player.__points = 0;
    this.players.push(player);
    return player;
  }

  /**
   * Hits a position on the field.
   * @param {object} player - The player that hit the position.
   * @param {integer} x - The X coordinate.
   * @param {integer} y - The Y coordinate.
   * @return {boolean} Whether the move hit a flag or not.
   */
  async hitPosition(player, x, y) {
    if ((0, _lodash.isUndefined)(player)) {
      (0, _util.requiredParam)('player');
    }
    if ((0, _lodash.isUndefined)(x)) {
      (0, _util.requiredParam)('x');
    }
    if ((0, _lodash.isUndefined)(y)) {
      (0, _util.requiredParam)('y');
    }
    if (!~this.players.indexOf(player)) {
      throw new _error2.default('You are not in the game.');
    }
    if (this.over) {
      throw new _error2.default('The game is over.');
    }
    if (this.currentPlayer !== player) {
      throw new _error2.default('It is not your turn yet.');
    }

    const positionHit = await this.field.hitPosition(x, y);
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
   * @param {object} player - The player that will receive points.
   */
  _increasePlayerPoints(player) {
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
  _changeTurn() {
    this.currentTurn = +!this.currentTurn;
    this.emit('turn-changed', this.currentPlayer.id);
  }
}

exports.default = Game;