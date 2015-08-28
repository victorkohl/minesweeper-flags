import Promise from 'bluebird';
import _ from 'lodash';
import { EventEmitter } from 'events';
import { requiredParam as req } from './util';
import Field from './field';

class Game extends EventEmitter {
  /**
   * Represents a game.
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
   * @returns {boolean} 'true' if the game is full, 'false' otherwise.
   */
  get isFull() {
    return this.players.length === 2;
  }

  /**
   * Returns the current player.
   * @returns {object} The current player.
   */
  get currentPlayer() {
    return this.players[this.currentTurn];
  }

  /**
   * Creates the field and starts the game.
   * @param {number} [edge=16] - The edge size.
   * @returns {Game} this instance
   */
  start(edge = 16) {
    return new Promise((resolve, reject) => {
      if (!this.isFull) {
        throw new Error('The game must be full before you can start it.');
      }
      this.field = new Field(edge);
      this.field.createBoard(this)
        .then(() => {
          this.pointsToWin = Math.floor(this.field.numberOfFlags / 2) + 1;
          this.emit('new-game', edge);
          this._changeTurn();
          return this;
        })
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Adds a player.
   * A player can be any javascript object with an id attribute.
   * @param {object} player - The player object.
   * @returns {object} The new player.
   */
  addPlayer(player) {
    return new Promise((resolve) => {
      if (_.isUndefined(player)) {
        req('player');
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
  hitPosition(player, x, y) {
    return new Promise((resolve, reject) => {
      if (_.isUndefined(player)) {
        req('player');
      }
      if (_.isUndefined(x)) {
        req('x');
      }
      if (_.isUndefined(y)) {
        req('y');
      }
      if (!~this.players.indexOf(player)) {
        throw new Error('The provided player is not in the game.');
      }
      if (this.over) {
        throw new Error('The game is over.');
      }
      if (this.currentPlayer !== player) {
        throw new Error(`It is not your turn yet.`);
      }

      this.field.hitPosition(x, y)
        .then((positionHit) => {
          if (positionHit.hasFlag) {
            this._increasePlayerPoints(player);
          } else {
            this._changeTurn();
          }
          return positionHit.hasFlag;
        })
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Increases a player's total points.
   * @private
   * @param {object} player - The player that will receive points.
   */
  _increasePlayerPoints(player) {
    player.__points++;
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

export default Game;
