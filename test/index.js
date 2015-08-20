import MinesweeperFlags from '../lib';
import Game from '../lib/game';

describe('MinesweeperFlags', function () {

  it('should extend Game', function (done) {
    new MinesweeperFlags().should.be.an.instanceof(Game);
    done();
  });

  it('has a room', function (done) {
    new MinesweeperFlags('a').should.have.property('room');
    done();
  });

});
