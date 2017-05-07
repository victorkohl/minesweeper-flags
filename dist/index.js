'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _game = require('./game');

var _game2 = _interopRequireDefault(_game);

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MinesweeperFlags = function (_Game) {
  _inherits(MinesweeperFlags, _Game);

  /**
   * Represents a Minesweeper Flags game.
   * @constructor
   */
  function MinesweeperFlags(room) {
    _classCallCheck(this, MinesweeperFlags);

    var _this = _possibleConstructorReturn(this, (MinesweeperFlags.__proto__ || Object.getPrototypeOf(MinesweeperFlags)).call(this));

    _this.room = room;
    return _this;
  }

  return MinesweeperFlags;
}(_game2.default);

MinesweeperFlags.GameError = _error2.default;

exports.default = MinesweeperFlags;