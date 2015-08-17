import should from 'should';
import sinon from 'sinon';
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
    beforeEach(() => field = new Field(10));

    it('has an edge size', (done) => {
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
    beforeEach(() => field = new Field(10));

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

      it('creates the correct amount of Positions with flags', (done) => {
        let count = 0;
        field.positions.forEach((positionX) => {
          positionX.forEach((position) => {
            if (position.hasFlag) {
              count++;
            }
          });
        });
        count.should.equal(field.numberOfFlags);
        done();
      });

      it('populates all neighbours correctly', (done) => {
        field.positions.forEach((positionX) => {
          positionX.forEach((position) => {
            ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].forEach((neighbour) => {
              let neighbourPosition = position.neighbours.get(neighbour);
              if (neighbourPosition) {
                neighbourPosition.should.be.an.instanceof(Position);
              } else {
                should(neighbourPosition).be.null();
              }
            });
          });
        });
        done();
      });

    });

    describe('#hitPosition', () => {

      let position;
      beforeEach(() => {
        field.createTable();
        position = field.positions[2][1];
      });

      it('requires an X coordinate', (done) => {
        (() => field.hitPosition()).should.throw('Missing parameter: x');
        done();
      });

      it('requires a Y coordinate', (done) => {
        (() => field.hitPosition(1)).should.throw('Missing parameter: y');
        done();
      });

      it('requires an X coordinate inside the field', (done) => {
        (() => field.hitPosition(11, 0)).should.throw('Invalid coordinates: x=11; y=0.');
        done();
      });

      it('requires a Y coordinate inside the field', (done) => {
        (() => field.hitPosition(0, 11)).should.throw('Invalid coordinates: x=0; y=11.');
        done();
      });

      it('requires an integer X coordinate', (done) => {
        (() => field.hitPosition('x', 0)).should.throw('Invalid coordinates: x=x; y=0.');
        done();
      });

      it('requires an integer Y coordinate', (done) => {
        (() => field.hitPosition(0, 'y')).should.throw('Invalid coordinates: x=0; y=y.');
        done();
      });

      it('calls Position#hit', (done) => {
        sinon.spy(position, 'hit');
        field.hitPosition(1, 2);
        position.hit.called.should.be.true();
        done();
      });

      it('returns whatever Position#hit returns', (done) => {
        sinon.stub(position, 'hit').returns('abc');
        field.hitPosition(1, 2).should.be.equal('abc');
        done();
      });

    });

    describe('#_getNeighbour', () => {

      let field, position; // eslint-disable-line no-shadow
      beforeEach(() => {
        field = new Field(3);
        field.createTable();
        position = field.positions[1][1];
      });

      it('should throw an error for invalid neighbours', (done) => {
        (() => field._getNeighbour('xx', position)).should.throw();
        done();
      });

      it('should return the correct Position for "nw"', (done) => {
        let nw = field._getNeighbour('nw', position);
        nw.should.equal(field.positions[0][0]);
        done();
      });

      it('should return the correct Position for "n"', (done) => {
        let n = field._getNeighbour('n', position);
        n.should.equal(field.positions[0][1]);
        done();
      });

      it('should return the correct Position for "ne"', (done) => {
        let ne = field._getNeighbour('ne', position);
        ne.should.equal(field.positions[0][2]);
        done();
      });

      it('should return the correct Position for "e"', (done) => {
        let e = field._getNeighbour('e', position);
        e.should.equal(field.positions[1][2]);
        done();
      });

      it('should return the correct Position for "se"', (done) => {
        let se = field._getNeighbour('se', position);
        se.should.equal(field.positions[2][2]);
        done();
      });

      it('should return the correct Position for "s"', (done) => {
        let s = field._getNeighbour('s', position);
        s.should.equal(field.positions[2][1]);
        done();
      });

      it('should return the correct Position for "sw"', (done) => {
        let sw = field._getNeighbour('sw', position);
        sw.should.equal(field.positions[2][0]);
        done();
      });

      it('should return the correct Position for "w"', (done) => {
        let w = field._getNeighbour('w', position);
        w.should.equal(field.positions[1][0]);
        done();
      });

      it('should return "null" for coordinates outside the field (top)', (done) => {
        let neighbour = field._getNeighbour('n', new Position(1, 0));
        should(neighbour).be.null();
        done();
      });

      it('should return "null" for coordinates outside the field (bottom)', (done) => {
        let neighbour = field._getNeighbour('s', new Position(1, 2));
        should(neighbour).be.null();
        done();
      });

      it('should return "null" for coordinates outside the field (left)', (done) => {
        let neighbour = field._getNeighbour('w', new Position(0, 1));
        should(neighbour).be.null();
        done();
      });

      it('should return "null" for coordinates outside the field (right)', (done) => {
        let neighbour = field._getNeighbour('e', new Position(2, 1));
        should(neighbour).be.null();
        done();
      });

    });

  });

});
