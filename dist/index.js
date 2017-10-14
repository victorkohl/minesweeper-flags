'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _game = require('./game');

var _game2 = _interopRequireDefault(_game);

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * MinesweeperFlags class.
 * Represents a Minesweeper Flags game.
 */
class MinesweeperFlags extends _game2.default {
  /**
   * Creates a new instance of MinesweeperFlags.
   * @constructor
   */
  constructor() {
    super();
  }
}

MinesweeperFlags.GameError = _error2.default;

exports.default = MinesweeperFlags;