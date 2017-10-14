import MinesweeperFlags from '../lib';
import Game from '../lib/game';

describe('MinesweeperFlags', function() {
  it('should extend Game', function(done) {
    new MinesweeperFlags().should.be.an.instanceof(Game);
    done();
  });
});
