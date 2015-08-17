'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Player =
/**
 * Represents a player.
 * @constructor
 * @param {string} [name=Guest] - The player name
 */
function Player() {
  var name = arguments.length <= 0 || arguments[0] === undefined ? 'Guest' : arguments[0];

  _classCallCheck(this, Player);

  this.name = name;
  this.points = 0;
};

exports['default'] = Player;
module.exports = exports['default'];