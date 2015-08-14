import { requiredParam as req } from './util';
import Player from './player';
import Field from './field';

export default class Game {
  /**
   * Represents a game.
   * @constructor
   */
  constructor() {
    this.players = [];
    this.currentTurn = 0;
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
    if (this.players[this.currentTurn] !== player) {
      throw new Error(`It is not ${player.name}'s turn yet.`);
    }

    let flagHit = this.field.hitPosition(x, y);
    if (flagHit) {
      player.points++;
    } else {
      this.currentTurn = +!this.currentTurn;
    }

    return flagHit;
  }
}
