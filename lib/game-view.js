export default class GameView {
  constructor(game) {
    this.game = game;
    this.edge = game.field.edge;
  }

  draw() {
    this._drawTopBorder();
    this._drawBottomBorder();
  }

  _drawTopBorder() {
    let topLeft = '\u2554';
    let topRight = '\u2557';
    let top = '\u2550';
    let topBorder = top.repeat(this.edge);

    console.log(`${topLeft}${topBorder}${topRight}`);
  }

  _drawBottomBorder() {
    let bottomLeft = '\u255A';
    let bottomRight = '\u255D';
    let bottom = '\u2550';
    let bottomBorder = bottom.repeat(this.edge);

    console.log(`${bottomLeft}${bottomBorder}${bottomRight}`);
  }
}
