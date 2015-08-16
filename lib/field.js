import _ from 'lodash';
import { requiredParam as req } from './util';
import Position from './position';

class Field {
  /**
   * Represents a field.
   * @constructor
   * @param {integer} [edge=51] - The field edge size.
   */
  constructor(edge = 16) {
    this.edge = edge;
    this.positions = [];
  }

  /**
   * The total number of positions this field has.
   * @returns {Number} The table size.
   */
  get size() {
    return Math.pow(this.edge, 2);
  }

  /**
   * The total number of flags this field has.
   * The ratio of clear positions to flagged positions is
   * approximately 5:1 and it will always be an odd number.
   * @returns {Number} The number of flags.
   */
  get numberOfFlags() {
    return Math.ceil(this.size / 5.02) | 1;
  }

  /**
   * Generates all positions in the field.
   */
  createTable() {
    let flags = this._generateFlags();

    // creates all the Positions
    for (let i = 0; i < this.edge; i++) {
      let row = Array.apply(null, new Array(this.edge));
      for (let j = 0; j < this.edge; j++) {
        let positionNbr = i + j * this.edge;
        let hasFlag = !!~flags.indexOf(positionNbr);
        row[j] = new Position(j, i, hasFlag);
      }
      this.positions.push(row);
    }

    // sets the neighbours for all Positions
    this.positions.forEach((row) => {
      row.forEach((position) => {
        ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].forEach((neighbour) => {
          position.setNeighbour(neighbour, this._getNeighbour(neighbour, position));
        });
      });
    });
  }

  /**
   * Hits a position in the field.
   * @param {integer} x - The x coordinate.
   * @param {integer} y - The y coodinate.
   * @returns {Boolean} Whether the position has a flag or not.
   */
  hitPosition(x = req('x'), y = req('y')) {
    if (this._invalidCoordinates(x, y)) {
      throw new Error(`Invalid coordinates: x=${x}; y=${y}.`);
    }
    return this.positions[y][x].hit();
  }

  /**
   * Generates a list of positions where the flags will be.
   * @private
   */
  _generateFlags() {
    return _.shuffle(_.range(this.size))
            .slice(0, this.numberOfFlags);
  }

  /**
   * Returns the neighbour Position specified.
   * @private
   * @param {string} neighbour - The neighbour position.
   * @param {Position} position - The position relative to.
   * @returns {Position} The neighbour.
   */
  _getNeighbour(neighbour, position) {
    let x, y;

    switch (neighbour) {
    case 'nw':
      x = position.x - 1;
      y = position.y - 1;
      break;

    case 'n':
      x = position.x;
      y = position.y - 1;
      break;

    case 'ne':
      x = position.x + 1;
      y = position.y - 1;
      break;

    case 'e':
      x = position.x + 1;
      y = position.y;
      break;

    case 'se':
      x = position.x + 1;
      y = position.y + 1;
      break;

    case 's':
      x = position.x;
      y = position.y + 1;
      break;

    case 'sw':
      x = position.x - 1;
      y = position.y + 1;
      break;

    case 'w':
      x = position.x - 1;
      y = position.y;
      break;

    default:
      throw new Error(`Invalid neighbour: ${neighbour}`);
    }

    // returns null if the coordinate is outside the field
    if (this._invalidCoordinates(x, y)) {
      return null;
    }

    return this.positions[y][x];
  }

  /**
   * Checks whether the coordinates are invalid.
   * @private
   * @param {integer} x - The x coordinate.
   * @param {integer} y - The y coodinate.
   * @returns {Boolean} Whether the coordinates are invalid or not.
   */
  _invalidCoordinates(x, y) {
    let notIntegers = x !== parseInt(x, 10) || y !== parseInt(y, 10);
    let outsideField = x < 0 || y < 0 || x >= this.edge || y >= this.edge;
    return notIntegers || outsideField;
  }
}

export default Field;
