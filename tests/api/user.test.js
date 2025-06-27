const request = require('supertest');
const { expect } = require('chai');
const app = require('../../server');

describe('User API Tests', () => {
    let userId;
    let server;

    before((done) => {
        server = app.listen(3001, done);
    });

    after((done) => {
        server.close(done);
    });

    describe('POST /api/user/create', () => {
        it('should create a new user', (done) => {
            request(app)
                .post('/api/user/create')
                .send({ nickname: 'TestKid' })
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('success', true);
                    expect(res.body.user).to.have.property('nickname', 'TestKid');
                    expect(res.body.user).to.have.property('coins', 0);
                    expect(res.body.user).to.have.property('level', 1);
                    expect(res.body.user).to.have.property('xp', 0);
                    expect(res.body.user.hints).to.deep.equal({
                        store: 3,
                        piggybank: 3,
                        budget: 3,
                        learn: 3
                    });
                    userId = res.body.user.id;
                    done();
                });
        });

        it('should require nickname', (done) => {
            request(app)
                .post('/api/user/create')
                .send({})
                .expect(200)
                .end((err, res) => {
                    expect(res.body.user.nickname).to.be.undefined;
                    done();
                });
        });
    });

    describe('GET /api/user/:userId', () => {
        it('should get user data', (done) => {
            request(app)
                .get(`/api/user/${userId}`)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('nickname', 'TestKid');
                    expect(res.body).to.have.property('id', userId);
                    done();
                });
        });

        it('should return 404 for non-existent user', (done) => {
            request(app)
                .get('/api/user/invalid-user-id')
                .expect(404)
                .end((err, res) => {
                    expect(res.body).to.have.property('error', 'User not found');
                    done();
                });
        });
    });

    describe('POST /api/user/:userId/progress', () => {
        it('should update user progress', (done) => {
            request(app)
                .post(`/api/user/${userId}/progress`)
                .send({
                    coins: 50,
                    xp: 30,
                    gameType: 'store',
                    score: 85
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('success', true);
                    expect(res.body.user).to.have.property('coins', 50);
                    expect(res.body.user).to.have.property('xp', 30);
                    expect(res.body.user.gameProgress.store).to.deep.equal({
                        highScore: 85,
                        plays: 1
                    });
                    done();
                });
        });

        it('should handle level up', (done) => {
            request(app)
                .post(`/api/user/${userId}/progress`)
                .send({
                    coins: 100,
                    xp: 120
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body.user).to.have.property('level', 2);
                    expect(res.body.user).to.have.property('xp', 150);
                    done();
                });
        });

        it('should track high scores', (done) => {
            request(app)
                .post(`/api/user/${userId}/progress`)
                .send({
                    gameType: 'store',
                    score: 75
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body.user.gameProgress.store.highScore).to.equal(85);
                    expect(res.body.user.gameProgress.store.plays).to.equal(2);
                    done();
                });
        });
    });

    describe('GET /api/user/:userId/export', () => {
        it('should export user progress', (done) => {
            request(app)
                .get(`/api/user/${userId}/export`)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('nickname', 'TestKid');
                    expect(res.body).to.have.property('level');
                    expect(res.body).to.have.property('totalCoins');
                    expect(res.body).to.have.property('shareCode');
                    expect(res.body).to.have.property('topSkills');
                    done();
                });
        });
    });
});