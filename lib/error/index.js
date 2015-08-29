class ExtendableError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.stack = (new Error()).stack;
    this.name = this.constructor.name;
  }
}

class GameError extends ExtendableError {
  constructor(msg) {
    super(msg);
  }
}

export default GameError;
