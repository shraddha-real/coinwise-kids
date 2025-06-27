const request = require('supertest');
const { expect } = require('chai');
const app = require('../../server');

describe('Integration Tests', () => {
    let server;
    let userId;

    before((done) => {
        server = app.listen(3004, done);
    });

    after((done) => {
        server.close(done);
    });

    describe('Complete User Journey', () => {
        it('should complete a full user journey', (done) => {
            // 1. Create user
            request(app)
                .post('/api/user/create')
                .send({ nickname: 'JourneyKid' })
                .expect(200)
                .end((err, res) => {
                    userId = res.body.user.id;
                    
                    // 2. Play store game
                    request(app)
                        .post(`/api/user/${userId}/progress`)
                        .send({
                            gameType: 'store',
                            score: 85,
                            coins: 30,
                            xp: 40
                        })
                        .expect(200)
                        .end((err, res) => {
                            expect(res.body.user.coins).to.equal(30);
                            
                            // 3. Use a hint
                            request(app)
                                .post('/api/hint/use')
                                .send({ userId, gameType: 'store' })
                                .expect(200)
                                .end((err, res) => {
                                    expect(res.body.hintsRemaining).to.equal(2);
                                    
                                    // 4. Play more to earn achievement
                                    request(app)
                                        .post(`/api/user/${userId}/progress`)
                                        .send({
                                            coins: 75,
                                            xp: 60
                                        })
                                        .expect(200)
                                        .end((err, res) => {
                                            expect(res.body.user.coins).to.equal(105);
                                            
                                            // 5. Unlock achievement
                                            request(app)
                                                .post('/api/achievement/unlock')
                                                .send({ 
                                                    userId, 
                                                    achievementId: 'coin-collector' 
                                                })
                                                .expect(200)
                                                .end((err, res) => {
                                                    expect(res.body.user.coins).to.equal(130); // 105 + 25 reward
                                                    
                                                    // 6. Export progress
                                                    request(app)
                                                        .get(`/api/user/${userId}/export`)
                                                        .expect(200)
                                                        .end((err, res) => {
                                                            expect(res.body.totalCoins).to.equal(130);
                                                            expect(res.body.achievements).to.equal(1);
                                                            expect(res.body.shareCode).to.exist;
                                                            done();
                                                        });
                                                });
                                        });
                                });
                        });
                });
        });
    });

    describe('Multiplayer Interaction', () => {
        it('should handle multiple users playing simultaneously', (done) => {
            const users = [];
            const userCount = 5;
            let created = 0;

            // Create multiple users
            for (let i = 1; i <= userCount; i++) {
                request(app)
                    .post('/api/user/create')
                    .send({ nickname: `Player${i}` })
                    .expect(200)
                    .end((err, res) => {
                        users.push(res.body.user.id);
                        created++;
                        
                        if (created === userCount) {
                            // All users play games
                            let played = 0;
                            users.forEach((id, index) => {
                                request(app)
                                    .post(`/api/user/${id}/progress`)
                                    .send({
                                        gameType: 'store',
                                        score: 70 + index * 5,
                                        coins: 20 + index * 10,
                                        xp: 30 + index * 15
                                    })
                                    .expect(200)
                                    .end(() => {
                                        played++;
                                        if (played === userCount) {
                                            // Verify all users have different progress
                                            let verified = 0;
                                            users.forEach((id, index) => {
                                                request(app)
                                                    .get(`/api/user/${id}`)
                                                    .expect(200)
                                                    .end((err, res) => {
                                                        expect(res.body.nickname).to.equal(`Player${index + 1}`);
                                                        expect(res.body.coins).to.equal(20 + index * 10);
                                                        verified++;
                                                        if (verified === userCount) {
                                                            done();
                                                        }
                                                    });
                                            });
                                        }
                                    });
                            });
                        }
                    });
            }
        });
    });

    describe('Error Handling & Edge Cases', () => {
        it('should handle rapid progress updates', (done) => {
            request(app)
                .post('/api/user/create')
                .send({ nickname: 'RapidPlayer' })
                .expect(200)
                .end((err, res) => {
                    const userId = res.body.user.id;
                    let completed = 0;
                    const updates = 10;
                    
                    for (let i = 0; i < updates; i++) {
                        request(app)
                            .post(`/api/user/${userId}/progress`)
                            .send({
                                coins: 5,
                                xp: 10
                            })
                            .expect(200)
                            .end(() => {
                                completed++;
                                if (completed === updates) {
                                    request(app)
                                        .get(`/api/user/${userId}`)
                                        .expect(200)
                                        .end((err, res) => {
                                            expect(res.body.coins).to.equal(50);
                                            expect(res.body.xp).to.equal(100);
                                            expect(res.body.level).to.equal(2);
                                            done();
                                        });
                                }
                            });
                    }
                });
        });

        it('should maintain data integrity', (done) => {
            request(app)
                .post('/api/user/create')
                .send({ nickname: 'IntegrityTest' })
                .expect(200)
                .end((err, res) => {
                    const userId = res.body.user.id;
                    const initialHints = { ...res.body.user.hints };
                    
                    // Use all hints for one game
                    const useAllHints = (game, remaining) => {
                        if (remaining === 0) {
                            // Verify hints for other games are unchanged
                            request(app)
                                .get(`/api/user/${userId}`)
                                .expect(200)
                                .end((err, res) => {
                                    expect(res.body.hints.store).to.equal(0);
                                    expect(res.body.hints.piggybank).to.equal(3);
                                    expect(res.body.hints.budget).to.equal(3);
                                    expect(res.body.hints.learn).to.equal(3);
                                    done();
                                });
                            return;
                        }
                        
                        request(app)
                            .post('/api/hint/use')
                            .send({ userId, gameType: game })
                            .expect(200)
                            .end(() => {
                                useAllHints(game, remaining - 1);
                            });
                    };
                    
                    useAllHints('store', 3);
                });
        });
    });

    describe('Server Health', () => {
        it('should serve static files', (done) => {
            request(app)
                .get('/')
                .expect(200)
                .end((err, res) => {
                    expect(res.headers['content-type']).to.include('text/html');
                    expect(res.text).to.include('CoinWise Kids');
                    done();
                });
        });

        it('should handle 404 for non-existent routes', (done) => {
            request(app)
                .get('/api/nonexistent')
                .expect(200)
                .end((err, res) => {
                    // Because of catch-all route
                    expect(res.headers['content-type']).to.include('text/html'); // Returns index.html
                    done();
                });
        });

        it('should set correct MIME types', (done) => {
            request(app)
                .get('/css/styles.css')
                .expect(200)
                .end((err, res) => {
                    expect(res.headers['content-type']).to.match(/text\/css/);
                    done();
                });
        });
    });
});