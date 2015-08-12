import { missingParam as miss } from './util';
import Player from './player';
import Field from './field';

export default class Game {
  /**
   * Represents a game.
   * @constructor
   */
  constructor() {
    this.players = [];
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
   * @param {number} edge - The edge size.
   */
  createField(edge = 16) {
    this.field = new Field(edge);
    this.field.createTable();
  }

  /**
   * Adds a player.
   * @param {Player} player - The new player.
   */
  addPlayer(player = miss('player')) {
    if (this.isFull) {
      throw new Error('The game is full.');
    }
    if (!(player instanceof Player)) {
      throw new Error('The provided player is invalid.');
    }

    this.players.push(player);
  }

}
