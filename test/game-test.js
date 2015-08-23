import sinon from 'sinon';
import Game from '../lib/game';
import Position from '../lib/position';

describe('Game', () => {

  before(() => sinon.spy(Game.prototype, 'emit'));

  describe('attributes', () => {

    let game;
    beforeEach(() => game = new Game());

    it('has players', (done) => {
      game.should.have.property('players');
      done();
    });

    it('has a current turn', (done) => {
      game.should.have.property('currentTurn');
      done();
    });

    it('has a "over" flag', (done) => {
      game.should.have.property('over');
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

    describe('#start', () => {

      beforeEach(() => {
        game.addPlayer({ id: 'p1' });
        game.addPlayer({ id: 'p2' });
        game.start();
      });

      it('requires the game to be full', (done) => {
        game.players = [];
        (() => {
          game.start();
        }).should.throw('The game must be full before you can start it.');
        done();
      });

      it('creates a new Field', (done) => {
        game.should.have.property('field');
        done();
      });

      it('calculates the amount of points to win', (done) => {
        game.should.have.property('pointsToWin');
        done();
      });

      it('emits the "new-game" event', (done) => {
        game.emit.calledWith('new-game', game.field.edge).should.be.true();
        done();
      });

      it('emits the "turn-changed" event', (done) => {
        game.emit.calledWith('turn-changed', game.players[0].id).should.be.true();
        done();
      });

    });

    describe('#addPlayer', () => {

      it('requires a player', (done) => {
        (() => {
          game.addPlayer();
        }).should.throw('Missing parameter: player');
        done();
      });

      it('doesn\'t allow more than two players', (done) => {
        (() => {
          game.addPlayer({ id: 'p1' });
          game.addPlayer({ id: 'p2' });
          game.addPlayer({ id: 'p3' });
        }).should.throw('The game is full.');
        done();
      });

      it('requires an object', (done) => {
        (() => {
          game.addPlayer('p1');
        }).should.throw('Invalid player.');
        done();
      });

      it('requires an object with an "id" attribute', (done) => {
        (() => {
          game.addPlayer({ name: 'p1' });
        }).should.throw('The provided player must have an "id" attribute');
        done();
      });

      it('creates a "__points" attribute', (done) => {
        let newPlayer = { id: 'p1' };
        game.addPlayer(newPlayer);
        newPlayer.should.have.property('__points');
        done();
      });

      it('adds a new player', (done) => {
        let oldNumPlayers = game.players.length;
        game.addPlayer({ id: 'p1' });
        game.players.length.should.be.above(oldNumPlayers);
        done();
      });

      it('returns the new player', (done) => {
        let newPlayer = { id: 'p1' };
        game.addPlayer(newPlayer).should.equal(newPlayer);
        done();
      });

    });

    describe('#hitPosition', () => {

      let player1, player2;
      beforeEach(() => {
        player1 = game.addPlayer({ id: 'p1' });
        player2 = game.addPlayer({ id: 'p2' });
        game.start();
      });

      it('requires a player', (done) => {
        (() => {
          game.hitPosition();
        }).should.throw('Missing parameter: player');
        done();
      });

      it('requires an X coordinate', (done) => {
        (() => {
          game.hitPosition(player1);
        }).should.throw('Missing parameter: x');
        done();
      });

      it('requires a Y coordinate', (done) => {
        (() => {
          game.hitPosition(player1, 0);
        }).should.throw('Missing parameter: y');
        done();
      });

      it('requires a valid player', (done) => {
        (() => {
          game.hitPosition('p1', 0, 0);
        }).should.throw('The provided player is not in the game.');
        done();
      });

      it('throws when it\'s not the player\'s turn', (done) => {
        (() => {
          game.hitPosition(player2, 0, 0);
        }).should.throw(`It is not your turn yet.`);
        done();
      });

      it('throws when the game is over', (done) => {
        game.over = true;
        (() => {
          game.hitPosition(player1, 0, 0);
        }).should.throw('The game is over.');
        done();
      });

      it('calls Field#hitPosition', (done) => {
        sinon.spy(game.field, 'hitPosition');
        game.hitPosition(player1, 0, 0);
        game.field.hitPosition.called.should.be.true();
        done();
      });

      describe('when a flag is hit', () => {

        beforeEach(() => {
          let positionWithFlag = new Position(game, 0, 0, true);
          game.field.hitPosition = sinon.stub().returns(positionWithFlag);
        });

        it('increments the player\'s points', (done) => {
          game.hitPosition(player1, 0, 0);
          player1.__points.should.equal(1);
          done();
        });

        it('doesn\'t change turns', (done) => {
          let turn = game.currentTurn;
          game.hitPosition(player1, 0, 0);
          game.currentTurn.should.equal(turn);
          done();
        });

        it('returns true', (done) => {
          game.hitPosition(player1, 0, 0).should.be.true();
          done();
        });

        it('ends the game when a player obtained over half the points', (done) => {
          player1.__points = game.pointsToWin;
          game.hitPosition(player1, 0, 0);
          game.over.should.be.true();
          done();
        });

        it('emits the "game-over" event', (done) => {
          player1.__points = game.pointsToWin;
          game.hitPosition(player1, 0, 0);
          game.emit.calledWith('game-over').should.be.true();
          done();
        });

      });

      describe('when a flag is not hit', () => {

        beforeEach(() => {
          let positionWithoutFlag = new Position(game, 0, 0, false);
          positionWithoutFlag.flagsNearby = 2;
          game.field.hitPosition = sinon.stub().returns(positionWithoutFlag);
        });

        it('doesn\'t increment the player points', (done) => {
          game.hitPosition(player1, 0, 0);
          player1.__points.should.equal(0);
          done();
        });

        it('changes turns', (done) => {
          let turn = game.currentTurn;
          game.hitPosition(player1, 0, 0);
          game.currentTurn.should.not.equal(turn);
          done();
        });

        it('emits the "turn-changed" event', (done) => {
          game.hitPosition(player1, 0, 0);
          game.emit.calledWith('turn-changed', player1.id).should.be.true();
          done();
        });

      });

    });

  });

});
