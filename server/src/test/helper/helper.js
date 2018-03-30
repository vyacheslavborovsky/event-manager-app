const globalConfig = require("../../config/variable");
const bcrypt = require('bcryptjs');


exports.initInMemoryDB = function (mongoose, User, Event, mockData, requester, done) {
    return new Promise(function (resolve, reject) {
        mongoose.connect(globalConfig.mongo.uri + globalConfig.mongo.db, {
            keepAlive: 1,
            useMongoClient: true,
        }, function (error) {
            if (error) console.log('Error: ', error);

            let user1 = {
                ...mockData.user,
                local: {
                    ...mockData.user.local,
                    password: bcrypt.hashSync(mockData.user.local.password, 8)
                }
            };

            let testUser = new User(user1);
            let testToken;

            testUser.save(function (err) {
                if (err) console.log('Error during creating user: ', err);

                let now = new Date();
                let promisesArray = [];

                for (let event of mockData.events) {

                    let newEvent = new Event(
                        Object.assign(event, {
                            startDate: now.setHours(now.getHours() + 1),
                            endDate: now.setHours(now.getHours() + 3),
                            userId: testUser.id
                        }));

                    promisesArray.push(newEvent.save());
                    now.setDate(now.getDate() + 1);
                }

                Promise.all(promisesArray)
                    .then(function () {
                        requester
                            .post('/api/v1/auth/login/local')
                            .send({
                                username: mockData.user.local.username,
                                password: mockData.user.local.password
                            })
                            .end(function (err, res) {
                                if (err) {
                                    console.log('Login error ', err);
                                } else {
                                    testToken = res.body['x-auth-token'];
                                }

                                resolve({testUser, testToken})
                            });
                    })
                    .catch(function (error) {
                        reject(error);
                    })
            });
        });
    })
};

exports.removeInMemoryCollections = function (mockgoose, done) {
    mockgoose.helper.reset()
        .then(function () {
            done();
        })
};
