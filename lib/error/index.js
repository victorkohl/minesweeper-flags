/**
 * Error class that will be used to throw errors
 * on this game module.
 */
class GameError extends Error {
  /**
   * Creates a new instance of GameError.
   * @param {string} msg error message
   */
  constructor(msg) {
    super(msg);
  }
}

export default GameError;
