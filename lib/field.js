'use strict';

import _ from 'lodash';
import { missingParam as miss } from './util';
import Position from './position';

export default class Field {
  /**
   * Represents a field.
   * @constructor
   * @param {integer} [edge=51] - The field edge size.
   */
  constructor (edge = 16) {
    this.edge = edge;
    this.positions = [];
  }

  /**
   * The total number of positions this field has.
   * @returns {Number} The table size.
   */
  get size () {
    return Math.pow(this.edge, 2);
  }

  /**
   * The total number of flags this field has.
   * The ratio of clear positions to flagged positions is
   * approximately 5:1 and it will always be an odd number.
   * @returns {Number} The number of flags.
   */
  get numberOfFlags () {
    return Math.ceil(this.size / 5.02) | 1;
  }

  /**
   * Generates all positions in the field.
   */
  createTable () {
    let flags = this._generateFlags();

    for (let i = 0; i < this.edge; i++) {
      let row = Array.apply(null, new Array(this.edge));
      for (let j = 0; j < this.edge; j++) {
        let positionNbr = (i + 1) + (j * this.edge);
        let hasFlag = !!~flags.indexOf(positionNbr);
        row[j] = new Position(i, j, hasFlag);
      }
      this.positions.push(row);
    }
  }

  /**
   * Hits a position in the field.
   * @param {integer} x - The x coordinate.
   * @param {integer} y - The y coodinate.
   */
  hitPosition (x = miss('x'), y = miss('y')) {

  }

  /**
   * Generates a list of positions where the flags will be.
   * @private
   */
  _generateFlags () {
    return _.shuffle(_.range(this.size))
            .slice(0, this.numberOfFlags);
  }
}
