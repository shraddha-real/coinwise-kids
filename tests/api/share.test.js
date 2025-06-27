const request = require('supertest');
const { expect } = require('chai');
const app = require('../../server');

describe('Sharing & Progress API Tests', () => {
    let userId1, userId2;
    let shareCode;
    let server;

    before((done) => {
        server = app.listen(3003, done);
    });

    after((done) => {
        server.close(done);
    });

    beforeEach((done) => {
        // Create two test users
        request(app)
            .post('/api/user/create')
            .send({ nickname: 'Player1' })
            .expect(200)
            .end((err, res) => {
                userId1 = res.body.user.id;
                
                request(app)
                    .post('/api/user/create')
                    .send({ nickname: 'Player2' })
                    .expect(200)
                    .end((err, res) => {
                        userId2 = res.body.user.id;
                        done();
                    });
            });
    });

    describe('Progress Export & Sharing', () => {
        it('should export user progress with share code', (done) => {
            // Add some progress first
            request(app)
                .post(`/api/user/${userId1}/progress`)
                .send({
                    coins: 200,
                    xp: 250,
                    gameType: 'store',
                    score: 95
                })
                .expect(200)
                .end(() => {
                    request(app)
                        .get(`/api/user/${userId1}/export`)
                        .expect(200)
                        .end((err, res) => {
                            expect(res.body).to.have.property('nickname', 'Player1');
                            expect(res.body).to.have.property('shareCode');
                            expect(res.body.shareCode).to.match(/^MW[A-Z0-9]+$/);
                            expect(res.body).to.have.property('topSkills');
                            expect(res.body.topSkills).to.be.an('array');
                            shareCode = res.body.shareCode;
                            done();
                        });
                });
        });

        it('should retrieve shared progress by share code', (done) => {
            // First export to get share code
            request(app)
                .get(`/api/user/${userId1}/export`)
                .expect(200)
                .end((err, res) => {
                    const shareCode = res.body.shareCode;
                    
                    // Then retrieve using share code
                    request(app)
                        .get(`/api/share/${shareCode}`)
                        .expect(200)
                        .end((err, res) => {
                            expect(res.body).to.have.property('nickname', 'Player1');
                            expect(res.body).to.have.property('level');
                            expect(res.body).to.have.property('totalCoins');
                            expect(res.body).to.have.property('achievements');
                            expect(res.body).to.have.property('joinDate');
                            // Should not include sensitive data
                            expect(res.body).to.not.have.property('id');
                            expect(res.body).to.not.have.property('hints');
                            done();
                        });
                });
        });

        it('should handle invalid share code', (done) => {
            request(app)
                .get('/api/share/INVALID123')
                .expect(404)
                .end((err, res) => {
                    expect(res.body).to.have.property('error', 'Invalid share code');
                    done();
                });
        });
    });

    describe('Friend Comparison', () => {
        beforeEach((done) => {
            // Set up different progress for both users
            request(app)
                .post(`/api/user/${userId1}/progress`)
                .send({
                    coins: 300,
                    xp: 350,
                    gameType: 'store',
                    score: 95
                })
                .expect(200)
                .end(() => {
                    request(app)
                        .post(`/api/user/${userId2}/progress`)
                        .send({
                            coins: 150,
                            xp: 180,
                            gameType: 'piggybank',
                            score: 85
                        })
                        .expect(200)
                        .end(() => {
                            // Get share code for player2
                            request(app)
                                .get(`/api/user/${userId2}/export`)
                                .expect(200)
                                .end((err, res) => {
                                    shareCode = res.body.shareCode;
                                    done();
                                });
                        });
                });
        });

        it('should compare two users', (done) => {
            request(app)
                .post('/api/compare')
                .send({
                    userId: userId1,
                    friendShareCode: shareCode
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('user');
                    expect(res.body).to.have.property('friend');
                    expect(res.body).to.have.property('insights');
                    
                    expect(res.body.user.nickname).to.equal('Player1');
                    expect(res.body.friend.nickname).to.equal('Player2');
                    expect(res.body.insights).to.be.an('array');
                    expect(res.body.insights).to.have.lengthOf.at.least(1);
                    done();
                });
        });

        it('should generate meaningful insights', (done) => {
            request(app)
                .post('/api/compare')
                .send({
                    userId: userId1,
                    friendShareCode: shareCode
                })
                .expect(200)
                .end((err, res) => {
                    const insights = res.body.insights;
                    expect(insights.some(i => i.includes('levels ahead'))).to.be.true;
                    expect(insights.some(i => i.includes('saved') && i.includes('coins'))).to.be.true;
                    done();
                });
        });

        it('should handle invalid friend code', (done) => {
            request(app)
                .post('/api/compare')
                .send({
                    userId: userId1,
                    friendShareCode: 'INVALID'
                })
                .expect(404)
                .end((err, res) => {
                    expect(res.body).to.have.property('error', 'User or friend not found');
                    done();
                });
        });
    });

    describe('Progress Tracking', () => {
        it('should track multiple game sessions', (done) => {
            const games = ['store', 'piggybank', 'budget', 'learn'];
            let completed = 0;

            games.forEach((game, index) => {
                request(app)
                    .post(`/api/user/${userId1}/progress`)
                    .send({
                        gameType: game,
                        score: 70 + (index * 5),
                        coins: 10,
                        xp: 20
                    })
                    .expect(200)
                    .end(() => {
                        completed++;
                        if (completed === games.length) {
                            // Check final state
                            request(app)
                                .get(`/api/user/${userId1}`)
                                .expect(200)
                                .end((err, res) => {
                                    expect(res.body.gameProgress).to.have.all.keys(games);
                                    Object.values(res.body.gameProgress).forEach(progress => {
                                        expect(progress).to.have.property('plays', 1);
                                        expect(progress).to.have.property('highScore');
                                    });
                                    done();
                                });
                        }
                    });
            });
        });

        it('should identify top skills based on performance', (done) => {
            // Give high scores in specific games
            request(app)
                .post(`/api/user/${userId1}/progress`)
                .send({
                    gameType: 'store',
                    score: 95,
                    coins: 50,
                    xp: 100
                })
                .expect(200)
                .end(() => {
                    request(app)
                        .post(`/api/user/${userId1}/progress`)
                        .send({
                            gameType: 'counting',
                            score: 90,
                            coins: 30,
                            xp: 50
                        })
                        .expect(200)
                        .end(() => {
                            request(app)
                                .get(`/api/user/${userId1}/export`)
                                .expect(200)
                                .end((err, res) => {
                                    const skills = res.body.topSkills;
                                    expect(skills).to.be.an('array');
                                    expect(skills.some(s => s.name === 'Smart Shopper')).to.be.true;
                                    done();
                                });
                        });
                });
        });
    });
});