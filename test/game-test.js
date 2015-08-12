import Game from '../lib/game';
import Player from '../lib/player';

describe('Game', () => {

  describe('attributes', () => {

    let game;
    beforeEach(() => game = new Game());

    it('has players', (done) => {
      game.should.have.property('players');
      done();
    });

  });

  describe('instance methods', () => {

    let game;
    beforeEach(() => game = new Game());

    describe('#isFull', () => {

      it('returns false when the number of players is lower than 2', (done) => {
        game.players.push(1);
        game.isFull.should.be.false();
        done();
      });

      it('returns true when the number of players equals 2', (done) => {
        game.players.push(1);
        game.players.push(1);
        game.isFull.should.be.true();
        done();
      });

    });

    describe('#createField', () => {

      it('creates a new Field', (done) => {
        game.createField();
        game.should.have.property('field');
        done();
      });

    });

    describe('#addPlayer', () => {

      it('requires a player', (done) => {
        (() => game.addPlayer()).should.throw('Missing parameter: player');
        done();
      });

      it('doesn\'t allow more than two players', (done) => {
        (() => {
          let p1 = new Player('one');
          let p2 = new Player('two');
          let p3 = new Player('three');

          game.addPlayer(p1);
          game.addPlayer(p2);
          game.addPlayer(p3);
        }).should.throw('The game is full.');
        done();
      });

      it('doesn\'t allow invalid players', (done) => {
        (() => game.addPlayer(1)).should.throw('The provided player is invalid.');
        done();
      });

    });

  });

});
