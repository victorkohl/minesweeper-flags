import Promise from 'bluebird';
import should from 'should';
import sinon from 'sinon';
import Game from '../lib/game';
import Position from '../lib/position';

describe('Game', () => {
  before(() => sinon.spy(Game.prototype, 'emit'));

  describe('attributes', () => {
    let game;
    beforeEach(() => (game = new Game()));

    it('has players', done => {
      game.should.have.property('players');
      done();
    });

    it('has a current turn', done => {
      game.should.have.property('currentTurn');
      done();
    });

    it('has a "over" flag', done => {
      game.should.have.property('over');
      done();
    });
  });

  describe('instance methods', () => {
    let game;
    beforeEach(() => (game = new Game()));

    describe('#isFull', () => {
      it('returns false when the number of players is lower than 2', done => {
        game.players.push(1);
        game.isFull.should.be.false();
        done();
      });

      it('returns true when the number of players equals 2', done => {
        game.players.push(1);
        game.players.push(1);
        game.isFull.should.be.true();
        done();
      });
    });

    describe('#start', () => {
      beforeEach(() => {
        return game
          .addPlayer({ id: 'p1' })
          .then(() => game.addPlayer({ id: 'p2' }))
          .then(() => game.start());
      });

      it('returns a Promise', done => {
        game.start().should.be.a.Promise(); // eslint-disable-line new-cap
        done();
      });

      it('requires the game to be full', done => {
        game.players = [];
        game
          .start()
          .then(() => should.fail('No error was thrown.'))
          .catch(err => {
            err.message.should.equal(
              'The game must be full before you can start it.'
            );
            done();
          })
          .catch(done);
      });

      it('creates a new Field', done => {
        game.should.have.property('field');
        done();
      });

      it('calculates the amount of points to win', done => {
        game.should.have.property('pointsToWin');
        done();
      });

      it('emits the "new-game" event', done => {
        game.emit.calledWith('new-game', game.field.edge).should.be.true();
        done();
      });

      it('emits the "turn-changed" event', done => {
        game.emit
          .calledWith('turn-changed', game.players[0].id)
          .should.be.true();
        done();
      });
    });

    describe('#addPlayer', () => {
      it('returns a Promise', done => {
        game.addPlayer({ id: 'p1' }).should.be.a.Promise(); // eslint-disable-line new-cap
        done();
      });

      it('requires a player', done => {
        game
          .addPlayer()
          .then(() => should.fail('No error was thrown.'))
          .catch(err => {
            err.message.should.equal('Missing parameter: player');
            done();
          })
          .catch(done);
      });

      it('does not allow more than two players', done => {
        game
          .addPlayer({ id: 'p1' })
          .then(() => game.addPlayer({ id: 'p2' }))
          .then(() => game.addPlayer({ id: 'p3' }))
          .then(() => should.fail('No error was thrown.'))
          .catch(err => {
            err.message.should.equal('The game is full.');
            done();
          })
          .catch(done);
      });

      it('requires an object', done => {
        game
          .addPlayer('p1')
          .then(() => should.fail('No error was thrown.'))
          .catch(err => {
            err.message.should.equal('Invalid player.');
            done();
          })
          .catch(done);
      });

      it('requires an object with an "id" attribute', done => {
        game
          .addPlayer({ name: 'p1' })
          .then(() => should.fail('No error was thrown.'))
          .catch(err => {
            err.message.should.equal(
              'The provided player must have an "id" attribute'
            );
            done();
          })
          .catch(done);
      });

      it('creates a "__points" attribute', done => {
        let newPlayer = { id: 'p1' };
        game
          .addPlayer(newPlayer)
          .then(() => {
            newPlayer.should.have.property('__points');
            done();
          })
          .catch(done);
      });

      it('adds a new player', done => {
        let oldNumPlayers = game.players.length;
        game
          .addPlayer({ id: 'p1' })
          .then(() => {
            game.players.length.should.be.above(oldNumPlayers);
            done();
          })
          .catch(done);
      });

      it('returns the new player', done => {
        let newPlayer = { id: 'p1' };
        game.addPlayer(newPlayer).should.be.fulfilledWith(newPlayer);
        done();
      });
    });

    describe('#hitPosition', () => {
      let player1;
      let player2;
      beforeEach(() => {
        return game
          .addPlayer({ id: 'p1' })
          .then(player => (player1 = player))
          .then(() => game.addPlayer({ id: 'p2' }))
          .then(player => (player2 = player))
          .then(() => game.start());
      });

      it('returns a Promise', done => {
        game.hitPosition(player1, 0, 0).should.be.a.Promise(); // eslint-disable-line new-cap
        done();
      });

      it('requires a player', done => {
        game
          .hitPosition()
          .then(() => should.fail('No error was thrown.'))
          .catch(err => {
            err.message.should.equal('Missing parameter: player');
            done();
          })
          .catch(done);
      });

      it('requires an X coordinate', done => {
        game
          .hitPosition(player1)
          .then(() => should.fail('No error was thrown.'))
          .catch(err => {
            err.message.should.equal('Missing parameter: x');
            done();
          })
          .catch(done);
      });

      it('requires a Y coordinate', done => {
        game
          .hitPosition(player1, 0)
          .then(() => should.fail('No error was thrown.'))
          .catch(err => {
            err.message.should.equal('Missing parameter: y');
            done();
          })
          .catch(done);
      });

      it('requires a valid player', done => {
        game
          .hitPosition('p1', 0, 0)
          .then(() => should.fail('No error was thrown.'))
          .catch(err => {
            err.message.should.equal('You are not in the game.');
            done();
          })
          .catch(done);
      });

      it('throws when it is not the players turn', done => {
        game
          .hitPosition(player2, 0, 0)
          .then(() => should.fail('No error was thrown.'))
          .catch(err => {
            err.message.should.equal('It is not your turn yet.');
            done();
          })
          .catch(done);
      });

      it('does not hit the position when it is not the players turn', done => {
        game
          .hitPosition(player2, 0, 0)
          .then(() => should.fail('No error was thrown.'))
          .catch(() => {
            game.field.positions[0][0].isHit.should.be.false();
            done();
          })
          .catch(done);
      });

      it('throws when the game is over', done => {
        game.over = true;
        game
          .hitPosition(player1, 0, 0)
          .then(() => should.fail('No error was thrown.'))
          .catch(err => {
            err.message.should.equal('The game is over.');
            done();
          })
          .catch(done);
      });

      it('calls Field#hitPosition', done => {
        sinon.spy(game.field, 'hitPosition');
        game
          .hitPosition(player1, 0, 0)
          .then(() => {
            game.field.hitPosition.called.should.be.true();
            done();
          })
          .catch(done);
      });

      describe('when a flag is found', () => {
        beforeEach(() => {
          let positionWithFlag = new Position(game, 0, 0, true);
          game.field.hitPosition = sinon
            .stub()
            .returns(Promise.resolve(positionWithFlag));
        });

        it('increments the players points', done => {
          game
            .hitPosition(player1, 0, 0)
            .then(() => {
              player1.__points.should.equal(1);
              done();
            })
            .catch(done);
        });

        it('does not change turns', done => {
          let turn = game.currentTurn;
          game
            .hitPosition(player1, 0, 0)
            .then(() => {
              game.currentTurn.should.equal(turn);
              done();
            })
            .catch(done);
        });

        it('returns true', done => {
          game.hitPosition(player1, 0, 0).should.be.fulfilledWith(true);
          done();
        });

        it('ends the game when a player obtained over half the points', done => {
          player1.__points = game.pointsToWin;
          game
            .hitPosition(player1, 0, 0)
            .then(() => {
              game.over.should.be.true();
              done();
            })
            .catch(done);
        });

        it('emits the "points-changed" event', done => {
          game
            .hitPosition(player1, 0, 0)
            .then(() => {
              game.emit
                .calledWith('points-changed', player1.id, player1.__points)
                .should.be.true();
              done();
            })
            .catch(done);
        });

        it('emits the "game-over" event', done => {
          player1.__points = game.pointsToWin;
          game
            .hitPosition(player1, 0, 0)
            .then(() => {
              game.emit.calledWith('game-over').should.be.true();
              done();
            })
            .catch(done);
        });
      });

      describe('when a flag is not found', () => {
        beforeEach(() => {
          let positionWithoutFlag = new Position(game, 0, 0, false);
          positionWithoutFlag.flagsNearby = 2;
          game.field.hitPosition = sinon
            .stub()
            .returns(Promise.resolve(positionWithoutFlag));
        });

        it('does not increment the player points', done => {
          game
            .hitPosition(player1, 0, 0)
            .then(() => {
              player1.__points.should.equal(0);
              done();
            })
            .catch(done);
        });

        it('changes turns', done => {
          let turn = game.currentTurn;
          game
            .hitPosition(player1, 0, 0)
            .then(() => {
              game.currentTurn.should.not.equal(turn);
              done();
            })
            .catch(done);
        });

        it('emits the "turn-changed" event', done => {
          game
            .hitPosition(player1, 0, 0)
            .then(() => {
              game.emit.calledWith('turn-changed', player1.id).should.be.true();
              done();
            })
            .catch(done);
        });
      });
    });
  });
});
