'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var GameView = (function () {
  function GameView(game) {
    _classCallCheck(this, GameView);

    this.game = game;
    this.edge = game.field.edge;
  }

  _createClass(GameView, [{
    key: 'draw',
    value: function draw() {
      this._drawTopBorder();
      this._drawLines();
      this._drawBottomBorder();
    }
  }, {
    key: 'hitPosition',
    value: function hitPosition(x, y) {
      this.game.field.hitPosition(x, y);
      this.draw();
    }
  }, {
    key: '_drawTopBorder',
    value: function _drawTopBorder() {
      var topLeft = '╔';
      var topRight = '╗';
      var top = '═';
      var topBorder = top.repeat(this.edge * 2 - 1);

      console.log('' + topLeft + topBorder + topRight);
    }
  }, {
    key: '_drawBottomBorder',
    value: function _drawBottomBorder() {
      var bottomLeft = '╚';
      var bottomRight = '╝';
      var bottom = '═';
      var bottomBorder = bottom.repeat(this.edge * 2 - 1);

      console.log('' + bottomLeft + bottomBorder + bottomRight);
    }
  }, {
    key: '_drawLines',
    value: function _drawLines() {
      var lines = this._drawLine();
      var line = undefined;
      while (line = lines.next().value) {
        console.log(line);
      }
    }
  }, {
    key: '_drawLine',
    value: regeneratorRuntime.mark(function _drawLine() {
      var x, outerBorder, innerBorder, positions, row, line;
      return regeneratorRuntime.wrap(function _drawLine$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            x = 0;
            outerBorder = '║';
            innerBorder = '│';
            positions = this.game.field.positions;
            row = undefined;

          case 5:
            if (!(row = positions[x++])) {
              context$2$0.next = 13;
              break;
            }

            line = outerBorder;

            row.forEach(function (position, idx, arr) {
              // eslint-disable-line no-loop-func
              if (position.isHit) {
                if (position.hasFlag) {
                  line += '⚐';
                } else if (position.flagsNearby > 0) {
                  line += position.flagsNearby;
                } else {
                  line += ' ';
                }
              } else {
                line += '~';
              }
              if (idx < arr.length - 1) {
                line += innerBorder;
              }
            });
            line += outerBorder;
            context$2$0.next = 11;
            return line;

          case 11:
            context$2$0.next = 5;
            break;

          case 13:
          case 'end':
            return context$2$0.stop();
        }
      }, _drawLine, this);
    })
  }]);

  return GameView;
})();

exports['default'] = GameView;
module.exports = exports['default'];