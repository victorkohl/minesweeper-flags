import sinon from 'sinon';
import Position from '../lib/position';
import Game from '../lib/game';

describe('Position', () => {

  describe('instantiation', () => {

    it('requires a game', (done) => {
      (() => new Position()).should.throw('Missing parameter: game');

      done();
    });

    it('requires an X coordinate', (done) => {
      (() => new Position(new Game())).should.throw('Missing parameter: x');

      done();
    });

    it('requires a Y coordinate', (done) => {
      (() => new Position(new Game(), 1)).should.throw('Missing parameter: y');

      done();
    });

    it('only requires a pair of coordinates', (done) => {
      (() => new Position(new Game(), 1, 2)).should.not.throw();

      done();
    });

    it('creates a position with a flag', () => {
      let position = new Position(new Game(), 1, 2, true);
      position.hasFlag.should.be.true();
    });

  });

  describe('attributes', () => {

    let position;
    beforeEach(() => {
      position = new Position(new Game(), 1, 2);
    });

    it('has a game', (done) => {
      position.should.have.property('game');
      done();
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

    let position, game;
    beforeEach(() => {
      game = new Game();
      position = new Position(game, 1, 2);
    });

    describe('#setNeighbour', () => {

      ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].forEach((neighbour) => {
        it(`sets the "${neighbour}" neighbour`, (done) => {
          let position2 = new Position(game, 0, 1);
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
        (() => position.setNeighbour('sse', new Position(game, 0, 1))).should.throw();
        done();
      });

      it('doesn\'t allow an invalid position', (done) => {
        (() => position.setNeighbour('n', 'invalid')).should.throw();
        done();
      });

      it('increments the "neighbour with flags" counter', (done) => {
        let oldFlagsNearby = position.flagsNearby;
        position.setNeighbour('ne', new Position(game, 0, 1, true));
        position.flagsNearby.should.equal(oldFlagsNearby + 1);
        done();
      });

    });

    describe('#hit', () => {

      beforeEach(() => {
        ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].forEach((neighbour) => {
          let newPosition = new Position(game, 1, 2);
          sinon.spy(newPosition, 'hit');
          position.setNeighbour(neighbour, newPosition);
        });
      });

      it('flags the Position as hit', (done) => {
        position.hit();
        position.isHit.should.be.true();
        done();
      });

      it('returns itself', (done) => {
        position.hit().should.equal(position);
        done();
      });

      it('emits the "position-hit" event telling that a flag was discovered', (done) => {
        game.emit = sinon.spy();
        position.hasFlag = true;
        position.hit();
        game.emit.calledWith('position-hit', true).should.be.true();
        done();
      });

      it('propagates the hits if there are no nearby flags', (done) => {
        position.hit();
        position.neighbours.forEach((neighbour) => {
          neighbour.hit.calledOnce.should.be.true();
        });
        done();
      });

      it('does\'t propagate the hits if the position has a flag', (done) => {
        position.hasFlag = true;
        position.hit();
        position.neighbours.forEach((neighbour) => {
          neighbour.hit.called.should.be.false();
        });
        done();
      });

      it('emits the "position-hit" event telling the number of nearby flags', (done) => {
        game.emit = sinon.spy();
        position.hasFlag = false;
        position.flagsNearby = 2;
        position.hit();
        game.emit.calledWith('position-hit', false, 2).should.be.true();
        done();
      });

    });

  });

});
