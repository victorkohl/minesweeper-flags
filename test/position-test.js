'use strict';

import should from 'should';
import Position from '../lib/position';

describe('Position', () => {

  describe('instantiation', () => {
    
    it('requires an X coordinate', (done) => {
      (() => new Position()).should.throw('Missing parameter: x');

      done();
    });

    it('requires a Y coordinate', (done) => {
      (() => new Position(1)).should.throw('Missing parameter: y');

      done();
    });

    it('only requires a pair of coordinates', (done) => {
      (() => new Position(1, 2)).should.not.throw();

      done();
    });

    it('creates a position with a flag', () => {
      let position = new Position(1, 2, true);
      position.hasFlag.should.be.true();
    });

  });

  describe('attributes', () => {

    let position;
    beforeEach(() => {      
      position = new Position(1, 2);
    });

    it('has an X coordinate', (done) => {
      position.should.have.property('x');
      done();
    });

    it('has a Y coordinate', (done) => {
      position.should.have.property('y');
      done();
    });

    it('has an "is flag" indicator', (done) => {
      position.should.have.property('hasFlag');
      done();
    });

    it('has an "is hit" indicator', (done) => {
      position.should.have.property('isHit');
      done();
    });

    it('has a count of nearby flags', (done) => {
      position.should.have.property('flagsNearby');
      done();
    });

    it('has a neighbours map', (done) => {
      position.should.have.property('neighbours');
      done();
    });

  });

  describe('instance methods', () => {

    let position;
    beforeEach(() => {      
      position = new Position(1, 2);
    });

    describe('#setNeighbour', () => {

      ['nw','n','ne','e','se','s','sw','w'].forEach((neighbour) => {
        it(`sets the "${neighbour}" neighbour`, (done) => {
          let position2 = new Position(0, 1);
          position.setNeighbour(neighbour, position2);

          position.neighbours.get(neighbour).should.equal(position2);
          done();
        });
      });

      it('requires a neighbour', (done) => {
        (() => position.setNeighbour()).should.throw('Missing parameter: neighbour');
        done();
      });

      it('requires a position', (done) => {
        (() => position.setNeighbour('n')).should.throw('Missing parameter: position');
        done();
      });

      it('doesn\'t allow an invalid neighbour', (done) => {
        (() => position.setNeighbour('sse', new Position(0, 1))).should.throw();
        done();
      });

      it('doesn\'t allow an invalid position', (done) => {
        (() => position.setNeighbour('n', 'invalid')).should.throw();
        done();
      });

      it('increments the "neighbour with flags" counter', (done) => {
        let oldFlagsNearby = position.flagsNearby;
        position.setNeighbour('ne', new Position(0, 1, true));
        position.flagsNearby.should.equal(oldFlagsNearby + 1);
        done();
      });

    });

  });

});