export default class GameView {
  constructor(game) {
    this.game = game;
    this.edge = game.field.edge;
  }

  draw() {
    this._drawTopBorder();
    this._drawLines();
    this._drawBottomBorder();
  }

  hitPosition(x, y) {
    this.game.field.hitPosition(x, y);
    this.draw();
  }

  _drawTopBorder() {
    let topLeft = '\u2554';
    let topRight = '\u2557';
    let top = '\u2550';
    let topBorder = top.repeat((this.edge * 2) - 1);

    console.log(`${topLeft}${topBorder}${topRight}`);
  }

  _drawBottomBorder() {
    let bottomLeft = '\u255A';
    let bottomRight = '\u255D';
    let bottom = '\u2550';
    let bottomBorder = bottom.repeat((this.edge * 2) - 1);

    console.log(`${bottomLeft}${bottomBorder}${bottomRight}`);
  }

  _drawLines() {
    let lines = this._drawLine();
    let line;
    while (line = lines.next().value) {
      console.log(line);
    }
  }

  * _drawLine() {
    let x = 0;
    let outerBorder = '\u2551';
    let innerBorder = '\u2502';
    let positions = this.game.field.positions;
    let row;

    while (row = positions[x++]) {
      let line = outerBorder;

      row.forEach((position, idx, arr) => { // eslint-disable-line no-loop-func
        if (position.isHit) {
          if (position.hasFlag) {
            line += '\u2690';
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
      yield line;
    }
  }
}
