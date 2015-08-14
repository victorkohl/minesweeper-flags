import Player from '../lib/player';

describe('Player', () => {

  describe('attributes', () => {

    let player;
    beforeEach(() => player = new Player());

    it('has a name', (done) => {
      player.should.have.property('name');
      done();
    });

    it('has a default name', (done) => {
      player.name.should.equal('Guest');
      done();
    });

    it('receives a name', (done) => {
      let player = new Player('Player One'); // eslint-disable-line no-shadow
      player.name.should.equal('Player One');
      done();
    });

    it('has points', (done) => {
      player.should.have.property('points');
      done();
    });

  });

});
