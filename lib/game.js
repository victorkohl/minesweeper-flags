import { EventEmitter } from 'events';
import { requiredParam as req } from './util';
import Player from './player';
import Field from './field';

class Game extends EventEmitter {
  /**
   * Represents a game.
   * @constructor
   */
  constructor() {
    super();
    this.players = [];
    this.currentTurn = 0;
    this.over = false;
    this.emit('new-game');
  }

  /**
   * Returns whether the game is full or not.
   * @returns {boolean} 'true' if the game is full, 'false' otherwise.
   */
  get isFull() {
    return this.players.length === 2;
  }

  /**
   * Creates the field.
   * @param {number} [edge=16] - The edge size.
   */
  createField(edge = 16) {
    this.field = new Field(edge);
    this.field.createTable();
    this.pointsToWin = Math.floor(this.field.numberOfFlags / 2) + 1;
  }

  /**
   * Adds a player.
   * @param {string} name - The player name.
   * @returns {Player} The new player.
   */
  addPlayer(name) {
    if (this.isFull) {
      throw new Error('The game is full.');
    }
    if (name && typeof name !== 'string') {
      throw new Error('Invalid name.');
    }
    let newPlayer = new Player(name);
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
  hitPosition(player = req('player'), x = req('x'), y = req('y')) {
    if (!(player instanceof Player)) {
      throw new Error('The provided player is invalid.');
    }
    if (this.over) {
      throw new Error('The game is over.');
    }
    if (this.players[this.currentTurn] !== player) {
      throw new Error(`It is not ${player.name}'s turn yet.`);
    }

    let positionHit = this.field.hitPosition(x, y);
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
  _increasePlayerPoints(player) {
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
  _changeTurn() {
    this.currentTurn = +!this.currentTurn;
    this.emit('turn-changed');
  }
}

export default Game;
