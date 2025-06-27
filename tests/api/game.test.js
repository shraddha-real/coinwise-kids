const request = require('supertest');
const { expect } = require('chai');
const app = require('../../server');

describe('Game API Tests', () => {
    let userId;
    let server;

    before((done) => {
        server = app.listen(3002, done);
    });

    after((done) => {
        server.close(done);
    });

    beforeEach((done) => {
        // Create a test user for each test
        request(app)
            .post('/api/user/create')
            .send({ nickname: 'GameTester' })
            .expect(200)
            .end((err, res) => {
                userId = res.body.user.id;
                done();
            });
    });

    describe('Hints API', () => {
        describe('GET /api/hint/:gameType', () => {
            it('should get hint for store game', (done) => {
                request(app)
                    .get('/api/hint/store')
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.property('hint');
                        expect(res.body.hint).to.include('shopping list');
                        done();
                    });
            });

            it('should get hint for piggybank game', (done) => {
                request(app)
                    .get('/api/hint/piggybank')
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.property('hint');
                        expect(res.body.hint).to.include('savings goal');
                        done();
                    });
            });

            it('should get hint for budget game', (done) => {
                request(app)
                    .get('/api/hint/budget')
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.property('hint');
                        expect(res.body.hint).to.include('savings');
                        done();
                    });
            });

            it('should get hint for learn game', (done) => {
                request(app)
                    .get('/api/hint/learn')
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.property('hint');
                        done();
                    });
            });

            it('should handle invalid game type', (done) => {
                request(app)
                    .get('/api/hint/invalid')
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.property('hint');
                        expect(res.body.hint).to.equal('Keep trying, you can do it!');
                        done();
                    });
            });
        });

        describe('POST /api/hint/use', () => {
            it('should use a hint successfully', (done) => {
                request(app)
                    .post('/api/hint/use')
                    .send({ userId, gameType: 'store' })
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.property('success', true);
                        expect(res.body).to.have.property('hintsRemaining', 2);
                        expect(res.body).to.have.property('hint');
                        done();
                    });
            });

            it('should track hints used', (done) => {
                // Use all hints
                request(app)
                    .post('/api/hint/use')
                    .send({ userId, gameType: 'store' })
                    .expect(200)
                    .end(() => {
                        request(app)
                            .post('/api/hint/use')
                            .send({ userId, gameType: 'store' })
                            .expect(200)
                            .end(() => {
                                request(app)
                                    .post('/api/hint/use')
                                    .send({ userId, gameType: 'store' })
                                    .expect(200)
                                    .end(() => {
                                        // Try to use fourth hint
                                        request(app)
                                            .post('/api/hint/use')
                                            .send({ userId, gameType: 'store' })
                                            .expect(200)
                                            .end((err, res) => {
                                                expect(res.body).to.have.property('success', false);
                                                expect(res.body).to.have.property('message', 'No hints remaining for this game');
                                                done();
                                            });
                                    });
                            });
                    });
            });

            it('should return 404 for invalid user', (done) => {
                request(app)
                    .post('/api/hint/use')
                    .send({ userId: 'invalid-id', gameType: 'store' })
                    .expect(404)
                    .end((err, res) => {
                        expect(res.body).to.have.property('error', 'User not found');
                        done();
                    });
            });

            it('should handle invalid game type gracefully', (done) => {
                request(app)
                    .post('/api/hint/use')
                    .send({ userId, gameType: 'invalid' })
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.property('success', true);
                        expect(res.body).to.have.property('hint');
                        done();
                    });
            });
        });
    });

    describe('Achievements API', () => {
        describe('GET /api/achievements', () => {
            it('should list all achievements', (done) => {
                request(app)
                    .get('/api/achievements')
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.be.an('array');
                        expect(res.body).to.have.lengthOf.at.least(4);
                        
                        const achievement = res.body[0];
                        expect(achievement).to.have.property('id');
                        expect(achievement).to.have.property('name');
                        expect(achievement).to.have.property('description');
                        expect(achievement).to.have.property('icon');
                        expect(achievement).to.have.property('coinReward');
                        done();
                    });
            });
        });

        describe('POST /api/achievement/unlock', () => {
            it('should unlock an achievement', (done) => {
                request(app)
                    .post('/api/achievement/unlock')
                    .send({ userId, achievementId: 'coin-collector' })
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.property('success', true);
                        expect(res.body).to.have.property('achievement');
                        expect(res.body.achievement).to.have.property('id', 'coin-collector');
                        expect(res.body.user.achievements).to.include('coin-collector');
                        expect(res.body.user.coins).to.equal(25); // Coin reward
                        done();
                    });
            });

            it('should not unlock same achievement twice', (done) => {
                request(app)
                    .post('/api/achievement/unlock')
                    .send({ userId, achievementId: 'coin-collector' })
                    .expect(200)
                    .end(() => {
                        request(app)
                            .post('/api/achievement/unlock')
                            .send({ userId, achievementId: 'coin-collector' })
                            .expect(200)
                            .end((err, res) => {
                                expect(res.body).to.have.property('success', false);
                                expect(res.body).to.have.property('message', 'Achievement already unlocked');
                                done();
                            });
                    });
            });

            it('should return 404 for invalid achievement', (done) => {
                request(app)
                    .post('/api/achievement/unlock')
                    .send({ userId, achievementId: 'invalid-achievement' })
                    .expect(404)
                    .end((err, res) => {
                        expect(res.body).to.have.property('error', 'User or achievement not found');
                        done();
                    });
            });
        });
    });

    describe('Parent Dashboard', () => {
        it('should generate parent report', (done) => {
            // Add some progress first
            request(app)
                .post(`/api/user/${userId}/progress`)
                .send({
                    coins: 100,
                    xp: 150,
                    gameType: 'store',
                    score: 90
                })
                .expect(200)
                .end(() => {
                    request(app)
                        .get(`/api/parent/report/${userId}`)
                        .expect(200)
                        .end((err, res) => {
                            expect(res.body).to.have.property('user');
                            expect(res.body).to.have.property('progress');
                            expect(res.body).to.have.property('learning');
                            expect(res.body).to.have.property('timeSpent');
                            
                            expect(res.body.user).to.have.property('nickname', 'GameTester');
                            expect(res.body.progress).to.have.property('gamesPlayed');
                            expect(res.body.learning).to.have.property('strongAreas');
                            expect(res.body.learning).to.have.property('needsImprovement');
                            expect(res.body.learning).to.have.property('recommendedActivities');
                            done();
                        });
                });
        });
    });
});