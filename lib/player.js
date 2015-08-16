class Player {
  /**
   * Represents a player.
   * @constructor
   * @param {string} [name=Guest] - The player name
   */
  constructor(name = 'Guest') {
    this.name = name;
    this.points = 0;
  }
}

export default Player;
