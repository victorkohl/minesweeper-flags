'use strict';

import should from 'should';
import sinon from 'should-sinon';
import Position from '../lib/position';
import Field from '../lib/field';

describe('Field', () => {

  describe('instantiation', () => {

    it('does not have any required parameters', (done) => {
      (() => new Field()).should.not.throw();

      done();
    });

    it('creates a field with an edge size', () => {
      let field = new Field(25);
      field.edge.should.equal(25);
    });

  });

  describe('attributes', () => {

    let field;
    beforeEach(() => field = new Field());

    it('has a edge size', (done) => {
      field.should.have.property('edge');
      done();
    });

    it('has positions', (done) => {
      field.should.have.property('positions');
      done();
    });

    it('has a field size', (done) => {
      field.should.have.property('size');
      done();
    });

    it('has a number of flags', (done) => {
      field.should.have.property('numberOfFlags');
      done();
    });

  });

  describe('instance methods', () => {

    let field;
    beforeEach(() => field = new Field());

    describe('#_generateFlags', () => {

      let flags;
      beforeEach(() => flags = field._generateFlags());

      it('generates the amount of required flags', (done) => {
        flags.should.have.length(field.numberOfFlags);
        done();
      });

      it('doesn\'t contain duplicated positions', (done) => {
        (new Set(flags)).size.should.equal(flags.length);
        done();
      });

      it('doesn\'t contain a position higher than the table size', (done) => {
        flags.forEach((flag) => flag.should.not.be.above(field.size));
        done();
      });

    });

    describe('#createTable', () => {

      beforeEach(() => field.createTable());

      it('creates an array with correct edge size', (done) => {
        field.positions.length.should.equal(field.edge);
        done();
      });

      it('creates array of arrays', (done) => {
        field.positions.forEach((position) => {
          position.should.be.an.Array();
        });
        done();
      });

      it('creates instances of Position', (done) => {
        field.positions.forEach((positionX) => {
          positionX.forEach((position) => {
            position.should.be.an.instanceof(Position);
          });
        });
        done();
      });

    });

    describe('#hitPosition', () => {

      let position;
      beforeEach(() => {
        position = new Position(1, 2);
      });

      it('requires an X coordinate', (done) => {
        (() => field.hitPosition()).should.throw('Missing parameter: x');
        done();
      });

      it('requires a Y coordinate', (done) => {
        (() => field.hitPosition(1)).should.throw('Missing parameter: y');
        done();
      });

      it('calls Position#hit', (done) => {
        // position.hit = sinon.spy();
        // TO DO
        done();
      });

    });

  });

});
